import { GraphQLScalarType } from 'graphql'
import { GQC, InputTypeComposer, Resolver } from 'graphql-compose'
import { typeByPath } from 'graphql-compose/lib/typeByPath'
import { ResolverNextRpCb, ResolverRpCb } from 'graphql-compose/lib/resolver'
import TypeComposer from 'graphql-compose/lib/typeComposer'

type WrapHelperCb<TSource, TContext> = ResolverRpCb<TSource, TContext>

function getLatestPath(path: string) {
  const paths = path.split('.')
  return paths[paths.length - 1]
}
function getPathParent(path: string) {
  return path
    .split('.')
    .filter((s, i, arr) => i < arr.length - 1)
    .join('.')
}

function wrapByTypeResolverResolve<TSource, TContext>(
  src: Resolver<TSource, TContext>,
  cb: WrapHelperCb<TSource, TContext>
) {
  return src.wrapResolve(cb)
}

function wrapByType<TSource, TContext>(
  selector: string,
  wrapResolve: WrapHelperCb<TSource, TContext>
) {
  const rootType = selector.split('.')[0]
  const rootFieldName = selector.split('.')[1]
  const tcSelector = selector
    .split('.')
    .filter((s, i) => i > 0)
    .join('.')
  let src = GQC.get(rootType).get(tcSelector)
  if (src instanceof TypeComposer) {
    console.log('wrap tc ?')
    new Error(
      'we are currently able to wrap TypeComposer yet please re-check your selector...'
    )
  } else if (src instanceof InputTypeComposer) {
    console.log('wrap InputTypeComposer ?')
    new Error(
      'we are currently able to wrap InputType yet please re-chord your selector...'
    )
  } else if (src instanceof Resolver) {
    const wrappedResolver = wrapByTypeResolverResolve(src, wrapResolve)
    GQC.get(rootType).addFields({
      [rootFieldName]: wrappedResolver
    })
  } else if (src instanceof GraphQLScalarType) {
    const parentSelector = getPathParent(tcSelector)
    const resolver: Resolver<any, any> = GQC.get(rootType).get(parentSelector)
    const tc = resolver.getTypeComposer()
    const fieldName = getLatestPath(tcSelector)
    const fieldConfig = tc.getField(fieldName)
    tc.extendField(fieldName, {
      ...fieldConfig,
      resolve: wrapResolve
    })
  }
}

function wrapResolverFieldHelper<TSource, TContext>(
  selectors: string,
  wrapFieldResolve: ResolverRpCb<TSource, TContext>
)
function wrapResolverFieldHelper<TSource, TContext>(
  selectors: string[],
  wrapFieldResolve: ResolverRpCb<TSource, TContext>
)
function wrapResolverFieldHelper<TSource, TContext>(
  selectors: any,
  wrapFieldResolve: ResolverRpCb<TSource, TContext>
) {
  wrapResolverHelper(selectors, wrapFieldResolve)
}

function wrapResolverHelper<TSource, TContext>(
  selectors: string,
  wrapResolverNextRpCb: ResolverNextRpCb<TSource, TContext>
)
function wrapResolverHelper<TSource, TContext>(
  selectors: string[],
  wrapResolverNextRpCb: ResolverNextRpCb<TSource, TContext>
)
function wrapResolverHelper<TSource, TContext>(
  selectors: any,
  wrapResolverNextRpCb:
    | ResolverNextRpCb<TSource, TContext>
    | ResolverRpCb<TSource, TContext>
) {
  let _selectors: string[]
  if (typeof selectors === 'string') {
    selectors = [selectors]
  } else {
    _selectors = selectors
  }
  _selectors.forEach(selector => {
    wrapByType(selector, wrapResolverNextRpCb)
  })
}

export { wrapResolverHelper, wrapResolverFieldHelper }
