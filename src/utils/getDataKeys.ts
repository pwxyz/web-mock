
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject'
import flatten from 'lodash/flatten'

const data = [
  { res: { "status": 1, payload: { data: [{ name: 1, value: 2 }] } } }
]

const arr = [
  { xx: {} },
]

const getObjKeys = (arg: { [x: string]: any } | any) => {
  if (typeof arg !== 'object') {
    return []
  }
  let arr: any[] = []
  for (let key in arg) {
    arr.push(key);
    if (arg[key] && isArray(arg[key])) {
      let array = arg[key].map((item: any) => getObjKeys(item))
      // console.log(array, arg[key])
      if (array && array.length) {
        array.forEach((arrayi: []) => arr = arr.concat(...arrayi))
      }
    }
    if (arg[key] && isObject(arg[key])) {
      let array = getObjKeys(arg[key])
      arr = arr.concat(...array)
    }
  }
  return arr
}

interface DataObjProps {
  [x: string]: {
    [x: string]: any
  } | {}
}

const getDataKeys = (arg: DataObjProps[]) => {
  try {
    if (arg && arg.length) {
      let arr = arg.map(i => ({ ...i.res, ...i.req }))
      arr = arr.map(i => getObjKeys(i))
      let array = Array.from(new Set(flatten(arr)))
      return array.filter(i => i && !/^\d$/.test(String(i)))
    }
  }
  catch (err) {
    console.error(err)
    return []
  }
}


export default getDataKeys
