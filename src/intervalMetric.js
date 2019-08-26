import {combineActionTypes} from '@geekagency/redux-action-types'

import {compose,trace,curry} from '@geekagency/composite-js'
import * as C from '@geekagency/composite-js/Combinator'
const {asFunctionPropFromProp:asF} = C;
import {store,reset} from './store'

export const KEYS= combineActionTypes(
  'DATE_STARTED',
  'LAST_INTERVAL',
  'NOW'
)


export const init_store = curry((keys,store) => {
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

export const reset = keys => reset(keys.LAST_INTERVAL)(store=> store.get(keys.NOW))

// apply the keys as an enhancer
// accepts both combinator or object
export const withKeys = keys => fn => args => {
  let _keys = keys;

  if(c.is_type_function(keys))  //accepting function or combinator as well
      _keys = keys();

  return fn(keys)(...args);

}

export const interval = combineObject(
  asF({init_store}),
  asF({runAfterInterval}),
  asF({makeIntervalOf}),
  asF({reset})
)


export default ()=> interval(withKeys(KEYS))
