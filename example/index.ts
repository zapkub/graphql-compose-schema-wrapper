import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import * as express from 'express'
import * as bodyPaser from 'body-parser'
import { TypeComposer, Resolver, GQC } from 'graphql-compose'
import { wrapResolverHelper, wrapResolverFieldHelper } from '../lib'
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
  version: info.getResolver('get')
})
GQC.rootMutation().addFields({
  version: info.getResolver('set')
})

/**
 * user wrap helper after setup your rootQuery and rootMutation
 * limitation: grpahql-compose-wrap-help able to 
 * wrap only field and resolver on rootQuery, rootMutation only
 */
wrapResolverHelper<any, any>(['Query.version.$get', 'Mutation.version.$set'], next => rp => {
  console.log('this resolver is wrapped')
  return next(rp)
})

wrapResolverFieldHelper<any, any>(['Query.version.$get.version'], rp => {
  console.log('this field is wrapped', rp)
  return rp.source
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
