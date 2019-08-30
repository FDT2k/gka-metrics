import * as im from '../src/counterMetric'
import * as S from '../src/store'
import {withKeys,composeMetric} from '../src/utils'

test ("test",()=>{
  let module = im.defaultCounterModule(im.KEYS)
  console.log(module)

  console.log(module.init_store(S.store()))

  //  let metric = module.composeMetric(module.reduce_and_log,module.collect,module.init_store)

/*
  let _Store = S.store();
  module.collect(_Store);
  console.log(_Store.getAll())*/
/*
  let res = metric(_Store)
  console.log(_Store.getAll(),res('test'))*/
})

test ("Ensure keys is combinable",()=>{


})
