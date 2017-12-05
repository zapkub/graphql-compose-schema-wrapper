import { GQC } from 'graphql-compose'
import { ResolverWrapCb } from 'graphql-compose/lib/resolver';


function wrapHelper<TSource, TContext>(selectors: string[], wrapResolve: ResolverWrapCb<TSource, TContext>)
function wrapHelper<TSource, TContext>(selectors: string, wrapResolve: ResolverWrapCb<TSource, TContext>)
function wrapHelper<TSource, TContext>(selectors: any, wrapResolve: ResolverWrapCb<TSource, TContext>) {
  let _selectors: string[]
  if(typeof selectors === 'string') {
    selectors = [selectors]
  } else {
    _selectors = selectors
  }


  
}

