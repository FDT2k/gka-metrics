
export const store = (initialStore)=>{
  if(initialStore ){
    return initialStore
  }
  let data = {};
  return {
    getAll: ()=> data,
    get: (x)=>data[x],
    set: (x,y)=>{
      data[x]=y;
    }
  }
}


/*
  Reset a value in the store
*/
export const reset = key=> val=> store =>{
  let _val = (typeof val === 'function') ? val(store) : val;
  let {set,get } = store;
  set(key,_val)
  return store
}

/*
increment a value in the store
*/
export const increment = key => reset(key)(store=>(store.get(key)+1))

/*holds execution if inspector enabled*/

export const debug_trace = (x)=>{let data = x.getAll();debugger;  return x}
