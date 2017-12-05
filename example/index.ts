import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import express from 'express'
import bodyPaser from 'body-parser'
import { TypeComposer, GQC } from 'graphql-compose'

const app = express()

app.use(bodyPaser.json())


const info = TypeComposer.create({
  name: 'InfoType',
  fields: {
    version: {
      type: 'String'
    }
  }
})
info.addResolver({
  name: 'get',
  resolve: ({ }) => {
    return {
      version: '1.0'
    }
  }
})

GQC.rootQuery().addFields({
  version: info.getResolver('get')
})

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphiql' }))
app.use('/graphql', graphqlExpress({
  schema: GQC.buildSchema()
}))


