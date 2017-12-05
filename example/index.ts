import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import * as express from 'express'
import * as bodyPaser from 'body-parser'
import { TypeComposer, Resolver, GQC } from 'graphql-compose'
import { wrapResolvers, wrapResolverHelper, wrapResolverFieldHelper } from '../lib'
import { resolve } from 'path'

const app = express()

app.use(bodyPaser.json())
const description = TypeComposer.create({
  name: 'DescriptionType',
  fields: {
    detail: {
      type: 'String'
    }
  }
})
description.addResolver({
  name: 'fetch',
  type: description,
  resolve: ({}) => {
    return {
      detail: 'something nested'
    }
  }
})
const info = TypeComposer.create({
  name: 'InfoType',
  fields: {
    version: {
      type: 'String'
    }
  }
})
info.addRelation('desc', {
  resolver: description.getResolver('fetch')
})
info.addResolver({
  name: 'get',
  type: info,
  resolve: ({}) => {
    return {
      version: '1.0'
    }
  }
})
info.addResolver({
  name: 'set',
  type: info,
  args: {
    record: 'String'
  },
  resolve: () => {
    return {
      version: 'yeah'
    }
  }
})

GQC.rootQuery().addFields({
  getVersionInfo: info.getResolver('get')
})
GQC.rootMutation().addFields({
  updateVersionInfo: info.getResolver('set')
})

/**
 * user wrap helper after setup your rootQuery and rootMutation
 * limitation: grpahql-compose-wrap-help able to
 * wrap only field and resolver on rootQuery, rootMutation only
 */

// wrap with wrapResolvers
GQC.rootQuery().addFields(wrapResolvers({
  getVersionInfoWrap: info.getResolver('get')
}, (next) => rp => {
  console.log('this resolver wrap by wrapResolvers')
  return next(rp)
}))

// wrap with path helper
wrapResolverHelper<any, any>(
  ['Query.getVersionInfo.$get', 'Mutation.updateVersionInfo.$set'],
  next => rp => {
    console.log('this resolver is wrapped')
    return next(rp)
  }
)

wrapResolverFieldHelper<any, any>(['Query.getVersionInfo.$get.version'], rp => {
  console.log('this field is wrapped')
  return rp.source.version
})

app.use(
  '/graphql',
  graphqlExpress({
    schema: GQC.buildSchema()
  })
)
app.get('/', graphiqlExpress({ endpointURL: '/graphql' }))

app.listen(3000, function() {
  console.log('localhost:3000 is ready!!')
})
