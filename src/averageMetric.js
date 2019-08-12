import {combineActionTypes} from '@geekagency/redux-action-types'

import {compose,trace} from '@geekagency/composite-js'
import {store,reset,increment} from './store'
import {withKeys as makeIntervalMetric, KEYS as intervalKEYS } from './intervalMetric'
import {withKeys as makeCounterMetric, KEYS as counterKeys } from './counterMetric'

export const KEYS = combineActionTypes(
  'COUNTER',
  'LAST_COUNTER',
  intervalKEYS,
  counterKeys,
  'AVERAGE'
)

export const withKeys = keys =>{

  let {reset_interval,runAfterInterval,byIntervalOf2Sec,interval_store} = makeIntervalMetric(keys);
  let {count_store,reset_count} = makeCounterMetric(keys);

  const average_store = compose (count_store,interval_store)
  const reset_average = compose(reset_interval,reset_count)

  const collect_metric = increment(keys.COUNTER)

  const compute_average = store=>{
    let {get,set} = store
    // get the time elapsed in seconds
    let elapsed = ((get(keys.NOW) - get(keys.LAST_INTERVAL)) / 1000 )
    // calculate the average per elapsed
    let average = get(keys.COUNTER) / elapsed
    set(keys.AVERAGE,average);
    return store;
  }

  const log_average = store =>{
    const {get,set} = store
    console.log('average', get(keys.AVERAGE));
    return store;
  }

  const compute_and_log = compose(reset_interval,log_average,reset_count,compute_average)
  const average = compose(byIntervalOf2Sec(compute_and_log),collect_metric,average_store)

  return {average_store,reset_average,compute_average,log_average,average}
}

export default ()=> withKeys(KEYS())
