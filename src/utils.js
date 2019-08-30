import * as c from '@geekagency/composite-js'
// apply the keys as an enhancer
// accepts both combinator or object
export const withKeys = keys => fn => args => {
  let _keys = keys;

  if(c.is_type_function(keys))  //accepting function or combinator as well
      _keys = keys();

  return fn(_keys)(args);
}


export const composeMetric = c.curry((keys,reduce,collect,init_store) =>{
console.log('k',keys,'r',reduce,'c',collect,'i',init_store)
  return c.compose(reduce,collect,init_store)(keys)})
