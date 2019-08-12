import {combineActionTypes,actionExpand} from '@geekagency/redux-action-types'
import {compose,trace} from '@geekagency/composite-js'
import {store,reset} from './store'
import {withKeys as makeIntervalMetric, KEYS as intervalKEYS } from './intervalMetric'


export const KEYS = combineActionTypes(
  'HEAP_USED',
  'LAST_HEAP_USED',
  intervalKEYS
)

export const withKeys = keys => {

  let {reset_interval,runAfterInterval,interval_store} = makeIntervalMetric(keys);

  const memory_store = compose(interval_store,store)

  const reset_heap = reset(keys.HEAP_USED)(()=>process.memoryUsage().heapUsed/1024/1024)

  const compute_memory = store => {
    let {get,set}= store;
    const memory = get(keys.HEAP_USED);
    console.log('memory usage', memory, `(+${memory-get(keys.LAST_HEAP_USED)})`)
    set(keys.LAST_HEAP_USED,memory)
    return store
  }
  const log_memory = compose(reset_interval,compute_memory)

  const memory = compose(runAfterInterval(log_memory)(1000),reset_heap, memory_store)

  return {memory_store,reset_heap,compute_memory,log_memory,memory}
}

export default ()=> withKeys(KEYS())
