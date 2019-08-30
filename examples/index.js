import {compose,trace}      from '@geekagency/composite-js'
import {combineActionTypes} from '@geekagency/redux-action-types'

import {store,increment,reset,debug_trace,add}  from '../src/store'

//import {withKeys} from './store_handlers';
import {withKeys as memoryMetricWithKeys  ,  KEYS as memoryKeys   } from '../src/memoryMetric';
import {withKeys as counterMetricWithKeys ,  KEYS as counterKeys  } from '../src/counterMetric';
import {withKeys as averageMetricWithKeys ,  KEYS as averageKeys  } from '../src/averageMetric';


const KEYS = combineActionTypes(memoryKeys,counterKeys)

const memoryMetrics = memoryMetricWithKeys(memoryKeys())
const counterMetric = counterMetricWithKeys(counterKeys())
const averageMetric = averageMetricWithKeys(averageKeys())

let _store = store();
let _store_count= store();
let _store_memory= store();

/*let's build a custom AverageMetric*/

let _custom_store = store();

// we will use this custom add
const addCustom = key => val => reset(key)(store=>{
  let initial = 0;
  let stored = store.get(key)
  if(typeof(stored)=="undefined")
    stored = initial
  return stored + val
})

// we define our custom collector with the already set up metric collection in average metric
let custom_collector = btc_sell=> compose(averageMetric.collect_metric,addCustom('BTC_SELL')(btc_sell))


// define our custom compute function
const compute_average_btc = store=>{
  let {get,set} = store

  let average = get('BTC_SELL') / get(averageKeys().COUNTER)
  console.log('BTC_AVERAGE',average)
  console.log('received',get(averageKeys().COUNTER))
  set('AVERAGE_BTC_SELL',average);
  return store;
}



let custom_reducer = compose(reset('BTC_SELL')(0),averageMetric.compute_and_log,compute_average_btc)


while(1){
/*
  memoryMetrics.memory(_store_memory);
  counterMetric.counter(_store_count);
  averageMetric.average(_store);
*/

  let collect = custom_collector(Math.floor(Math.random() * Math.floor(10000)))
  averageMetric.averageWithCustomCollector(custom_reducer)(collect)(_custom_store)
//  console.log(_custom_store.get('BTC_SELL'),_custom_store.get('COUNTER'))
}
