import {compose,trace}      from '@geekagency/composite-js'
import {combineActionTypes} from '@geekagency/redux-action-types'

import {store,increment,reset,debug_trace}  from '../src/store'

//import {withKeys} from './store_handlers';
import {withKeys as memoryMetricWithKeys  ,  KEYS as memoryKeys   } from './memoryMetric';
import {withKeys as counterMetricWithKeys ,  KEYS as counterKeys  } from './counterMetric';
import {withKeys as averageMetricWithKeys ,  KEYS as averageKeys  } from './averageMetric';


const KEYS = combineActionTypes(memoryKeys,counterKeys)

const memoryMetrics = memoryMetricWithKeys(memoryKeys())
const counterMetric = counterMetricWithKeys(counterKeys())
const averageMetric = averageMetricWithKeys(averageKeys())

let _store = store();
let _store_count= store();
let _store_memory= store();

while(1){

  memoryMetrics.memory(_store_memory);
  counterMetric.counter(_store_count);
  averageMetric.average(_store);

}
