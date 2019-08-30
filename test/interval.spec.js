import * as im from '../src/intervalMetric'
import * as S from '../src/store'
import {withKeys} from '../src/utils'

test ("test",()=>{
  let intervalMetric = im.default();

  let myStore = S.store();

  intervalMetric.init_store(myStore);

  expect(
    myStore.getAll()
  ).toBeInstanceOf(Object)

  expect(
    myStore.getAll()
  ).toHaveProperty('DATE_STARTED')

  expect(
    myStore.getAll()
  ).toHaveProperty('LAST_INTERVAL')

  expect(
    myStore.getAll()
  ).toHaveProperty('NOW')

})

test ("Ensure keys is combinable",()=>{

  let keys = im.KEYS(x=>x+'_test')
  let intervalMetric = im.interval(withKeys(keys));

  let myStore = S.store();

  intervalMetric.init_store(myStore);

  expect(
    myStore.getAll()
  ).toBeInstanceOf(Object)

  expect(
    myStore.getAll()
  ).toHaveProperty('DATE_STARTED_test')

  expect(
    myStore.getAll()
  ).toHaveProperty('LAST_INTERVAL_test')

  expect(
    myStore.getAll()
  ).toHaveProperty('NOW_test')

})
