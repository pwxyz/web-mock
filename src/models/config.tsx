// @ts-ignore
import namespace from '@/constants/namespace'
import api from '@/constants/api';
import request from '@/utils/request'

export default {
  namespace: namespace.CONFIG,
  state: {
    isLogin: false //是否登陆
  },

  effects: {
    // @ts-ignore
    *fetch({ payload }, { call, put }) {
      console.log('model')
      const res = yield call(request, { method: 'post', url: api.LOGIN_VERIFY })
      if (res) {
        yield put({ type: 'loginState', payload: res['isLogin'] })
      }
    }
  },

  subscriptions: {
    // @ts-ignore
    setup({ dispatch, history }) {
      dispatch({ type: 'fetch' })
    }
  },

  reducers: {
    // @ts-ignore
    loginState(state, { payload }) {
      return { ...state, isLogin: payload }
    }
  }
}
