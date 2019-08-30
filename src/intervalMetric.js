import {combineActionTypes} from '@geekagency/redux-action-types'
import * as c from '@geekagency/composite-js'
import * as C from '@geekagency/composite-js/Combinator'
const {asFunctionPropFromProp:asF} = C;
import * as S from './store'
import {withKeys} from './utils'

export const KEYS= combineActionTypes(
  'DATE_STARTED',
  'LAST_INTERVAL',
  'NOW'
)

export const init_store = c.curry((keys,store) => {
  let now = Date.now();
  let {get,set} = store
  if(!get(keys.DATE_STARTED))
    set(keys.DATE_STARTED,now);

  if(!get(keys.LAST_INTERVAL))
    set(keys.LAST_INTERVAL,now)

  set(keys.NOW,now)

  return store;
})

export const runAfterInterval = keys => fn => interval => store => {
  let {get,set} = store;
  let elapsed= get(keys.NOW) - get(keys.LAST_INTERVAL)
  if( elapsed >= interval){
    store = fn(store)
  }
  return store;
}

export const makeIntervalOf = keys=> interval => fn => {
  return runAfterInterval(keys)(fn)(interval);
}

export const reset = keys => S.reset(keys.LAST_INTERVAL)(store=> store.get(keys.NOW))



export const interval = C.combineObject(
  asF({init_store}),
  asF({runAfterInterval}),
  asF({makeIntervalOf}),
  asF({reset})
)

export const defaultInterval = c.compose(interval,withKeys)

export default ()=> defaultInterval(KEYS)
