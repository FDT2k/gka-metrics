import {combineActionTypes} from '@geekagency/redux-action-types'

import {compose,trace} from '@geekagency/composite-js'
import {store,reset} from './store'

export const KEYS= combineActionTypes(
  'DATE_STARTED',
  'LAST_INTERVAL',
  'NOW'
)

export const withKeys = keys =>{

  const init_store = (store)=>{
    let now = Date.now();
    let {get,set} = store
    if(!get(keys.DATE_STARTED))
      set(keys.DATE_STARTED,now);

    if(!get(keys.LAST_INTERVAL))
      set(keys.LAST_INTERVAL,now)

    set(keys.NOW,now)

    return store;
  }

  // run FN if elapsedTime >= interval.

  const runAfterInterval = FN => interval => store => {
    let {get,set} = store;
    let elapsed= get(keys.NOW) - get(keys.LAST_INTERVAL)
    if( elapsed >= interval){
      store = FN(store)
    }
    return store;
  }


  const interval_store = compose(init_store,store)

  const reset_interval = reset(keys.LAST_INTERVAL)(store=> store.get(keys.NOW))

  /*run FN after interval but wit */
  const makeIntervalOf = interval => fn => {
    return runAfterInterval(fn)(interval);
  }

  return {
    init_store,
    interval_store,
    reset_interval,
    runAfterInterval,
    makeIntervalOf,
    byIntervalOf2Sec: makeIntervalOf(2000)
  }
}
export default ()=> withKeys(KEYS())
