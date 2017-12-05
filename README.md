# graphql-compose-schema-wrapper

> NOTE: this repository require
> [graphql-compose](https://github.com/nodkz/graphql-compose) to work properly

`graphql-compose-schema-wrapper` - is a tools that let you can easily manage
your wrapper in `graphql-compose` schema.

Such as verify session, Authorization, middleware and more

## Installation

```
yarn add graphql-compose graphql graphql-compose-schema-wrapper
```

## Usage

* After your schema setup is done, pick resolvers or field your need to wrap (by
  path selector) and then use `wrapResolvers`, `wrapResolverHelper` or `wrapResolverFieldHelper`
  to wrap what you need

## Use `wrapResolvers`
```js
// wrap with wrapResolvers
GQC.rootQuery().addFields(
  wrapResolvers(
    {
      // list of fields you want to expose to rootQuery
      getVersionInfoWrap: info.getResolver('get')
    },
    next => rp => {
      // implement your logic here before
      // resolve data
      return next(rp)
    }
  )
)

```

## User `wrapResolverHelper` and `wrapResolverFieldHelper`
```js
// wrap with path selector helper
// setup your schema
GQC.rootQuery().addFields({
  getVersionInfo: info.getResolver('get')
})
GQC.rootMutation().addFields({
  updateVersionInfo: info.getResolver('set')
})
wrapResolverHelper(
  ['Query.getVersionInfo.$get', 'Mutation.updateVersionInfo.$set'],
  next => rp => {
    // implement your logic here before
    // resolve data
    return next(rp)
  }
)

wrapResolverFieldHelper(['Query.getVersionInfoWrap.$get.version'], rp => {
    // implement your logic here before
    // resolve data
  return rp.source
})
```

# Limitation (PLEASE READ CAREFULLY)

* `graphql-compose-schema-wrapper` **cannot use with nested Resolver inside
  TypeComposer or Relation** ( only support rootQuery and rootMutation )


# LICENSE
MIT