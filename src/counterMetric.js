import * as CAT       from  '@geekagency/redux-action-types'
import * as c         from  '@geekagency/composite-js'
import * as C from '@geekagency/composite-js/Combinator'
import * as S         from  './store'
import * as Interval  from  './intervalMetric'
import {withKeys,composeMetric} from './utils'

const {asFunctionPropFromProp:asFP, asFunctionProp: asF} = C;


export const KEYS = CAT.combineActionTypes(
  'COUNTER',
  'LAST_COUNTER',
  CAT.groupAs('interval')(Interval.KEYS)
)

export const init_store_count = keys=>  (store)=>{

  let {get,set}=store
  if(!get(keys.COUNTER))
    set(keys.COUNTER,0)
  return store;
}

export const init_store =  keys => other_stores=> {
  console.log('keys',keys,'store',other_stores)

  return c.compose(init_store_count,other_stores)(keys)
}

export const reset        = keys => S.reset (keys.COUNTER)(0)

export const reducer      = keys => store=>{

  let {get,set}=store;
  let count = get(keys.COUNTER)
  //console.log('counter ',count, `(+${count-get(keys.LAST_COUNTER)})`)
  set(keys.COUNTER_DIFF,count-get(keys.LAST_COUNTER))
  set(keys.LAST_COUNTER,count)
  return store

}


export const collect = keys=>store => S.increment(keys.COUNTER)

export const log = keys=> store=>console.log('counter ',get(keys.LAST_COUNTER), `(+${get(keys.COUNTER_DIFF)})`)

export const reduce_and_log = other_resets =>  c.compose(other_resets,log,reducer)
export const reduce = other_resets =>  c.compose(other_resets,reducer)

export const makeModule = keys => {
  let interval = Interval.interval(keys);

  return C.combineObject(
    asF('init_store',init_store(interval.init_store)),
    asFP({reset}),
    asFP({reducer}),
    asFP({reduce}),
    asF('reduce_and_log',reduce_and_log(interval.reset)),
    asFP({composeMetric}),
    asFP({collect})
  )(keys)
}



export const defaultCounterModule = c.compose(makeModule,withKeys)


export const counterOnInterval = keys => delay => reduce=>  compose(runAfterInterval(reduce)(delay),increment(keys.COUNTER),count_store)
