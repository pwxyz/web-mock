import axios from 'axios'
import { message } from 'antd'
import { getCache } from '@/utils/cache';
import qs from 'qs'

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

const getBaseUrl = () => 'http://172.31.50.85:3357'


const getToken = () => getCache('access-token')

const request = async (arg: Arg) => {
  let url = getBaseUrl() + arg.url
  let needQs = arg.method === 'get' || 'delete'
  url += needQs && arg.data ? '?' + qs.stringify(arg.data) : ''
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
      return res.data['payload']
    }
    else {
      let err = res && res.data && res.data['message'] || '发生错误'
      message.error(err)
    }
  }
  else {
    let err = res && res.statusText
    message.error(err)
    console.error(err)
  }
}


export default request
