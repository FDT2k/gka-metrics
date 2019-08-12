import {combineActionTypes} from '@geekagency/redux-action-types'

import {compose,trace} from '@geekagency/composite-js'
import {store,reset,increment} from './store'
import {withKeys as makeIntervalMetric, KEYS as intervalKEYS } from './intervalMetric'


export const KEYS = combineActionTypes(
  'COUNTER',
  'LAST_COUNTER',
  intervalKEYS
)

export const withKeys = keys =>{

  let {reset_interval,runAfterInterval,interval_store} = makeIntervalMetric(keys);


  const init_store_count =  (store)=>{
    let {get,set}=store
    if(!get(keys.COUNTER))
      set(keys.COUNTER,0)
    return store;
  }

  const count_store = compose(init_store_count,interval_store,store)

  const reset_count =  reset (keys.COUNTER)(0)

  const compute_counter = store=>{
    let {get,set}=store;
    let count = get(keys.COUNTER)
    console.log('counter ',count, `(+${count-get(keys.LAST_COUNTER)})`)
    set(keys.LAST_COUNTER,count)
    return store

  }

  const log_count = compose(reset_interval,compute_counter)

  const counter= compose(runAfterInterval(log_count)(2000),increment(keys.COUNTER),count_store)

  return {
    init_store_count,
    count_store,
    reset_count,
    compute_counter,
    log_count,
    counter
  }

}

export default ()=> withKeys(KEYS())
