# graphql-compose-schema-wrapper

>NOTE: this repository require [graphql-compose](https://github.com/nodkz/graphql-compose) to work properly

`graphql-compose-schema-wrapper` - is a tools that let you can easily manage your wrapper in `graphql-compose` schema.

Such as verify session, Authorization, middleware and more

## Installation
```
yarn add graphql-compose graphql graphql-compose-schema-wrapper
```

## Usage
- After your schema setup is done, pick resolvers or field your need to wrap (by path selector) and then use `wrapResolverHelper` and `wrapResolverFieldHelper` to wrap what you need
```js

GQC.rootQuery().addFields({
  getVersionInfo: info.getResolver('get')
})
GQC.rootMutation().addFields({
  updateVersionInfo: info.getResolver('set')
})


wrapResolverHelper(
  ['Query.version.$get', 'Mutation.version.$set'],
  next => rp => {
    console.log('this resolver is wrapped')
    return next(rp)
  }
)

wrapResolverFieldHelper(['Query.version.$get.version'], rp => {
  console.log('this field is wrapped', rp)
  return rp.source
})
```

# Limitation (PLEASE READ CAREFULLY)
- `graphql-compose-schema-wrapper` **cannot use with nested Resolver inside TypeComposer or Relation** ( only support rootQuery and rootMutation )