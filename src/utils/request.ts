import axios from 'axios'
import { message } from 'antd'
import { getCache, removeCache } from '@/utils/cache';
import qs from 'qs'
import isArray from 'lodash/isArray'
import router from 'umi/router'

enum methodArr {
  'get',
  'post',
  'delete',
  'put'
}

interface Arg {
  method: 'get' | 'post' | 'delete' | 'put',
  url: string,
  data?: object,
  headers?: object
}

let url = 'http://172.31.50.85:3357'
// let url = 'http://47.97.194.165:3357'

export const getBaseUrl = () => url

const qsArrToString = (obj: { [x: string]: any }) => {
  let newObj: { [x: string]: any } = {}
  for (let key in obj) {
    if (isArray(obj[key])) {
      newObj[key] = String(obj[key])
    }
    else {
      newObj[key] = obj[key]
    }
  }
  return newObj
}


const getToken = () => getCache('access-token')

const request = async (arg: Arg) => {
  let url = getBaseUrl() + arg.url
  let needQs = ['get', 'delete'].includes(arg.method)
  url += needQs && arg.data ? '?' + qs.stringify(qsArrToString(arg.data)) : ''
  let obj: Arg = {
    method: arg.method,
    url,
    headers: { 'access-token': String(getToken()), ...arg.headers }
  }
  if (!needQs) {
    obj.data = arg.data
  }
  let res = await axios.request(obj)
  if (res && res.status === 200) {
    if (res.data['status'] && res.data['status'] === 1) {
      return res.data['payload'] || {}
    }
    if (res.data['status'] === -5) {
      removeCache('access-token')
      router.push('/login')
    }
    else {
      let err = res && res.data && res.data['message'] || '发生错误'
      message.error(err)
      return { err: '发生错误' }
    }
  }
  else {
    let err = res && res.statusText
    message.error(err)
    console.error(err)
  }
}


export default request
