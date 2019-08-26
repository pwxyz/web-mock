

import React, { FormEvent } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import request from '@/utils/request'
import router from 'umi/router'
import { setCache } from '@/utils/cache';
import api from '@/constants/api'

interface Props {
  form: {
    [x: string]: any
  }
}


class LoginComponent extends React.Component<Props, any> {

  handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err: null | string, values: object) => {
      if (!err) {
        this.login(values)
      }
    });
  };

  put = () => {
    this.props.form.validateFields((err: null | string, values: object) => {
      if (!err) {
        this.signAndLogin(values)
      }
    });
  }

  signAndLogin = async (arg: object) => {
    let res = await request({ method: 'put', url: api.LOGIN, data: arg })
    if (res && res['token']) {
      setCache('access-token', res['token'])
      router.push('/')
    }
  }

  login = async (arg: object) => {
    let res = await request({ method: 'post', url: api.LOGIN, data: arg })
    if (res && res['token']) {
      setCache('access-token', res['token'])
      router.push('/')
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }} >
        <Form onSubmit={this.handleSubmit} style={{ width: 300, padding: 30, marginTop: 300, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.1)' }}>
          <Form.Item  >
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入用户名' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入密码' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              登陆
            </Button>
            或者
              <Button onClick={this.put} style={{ float: "right" }} >
              注册并登陆
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }

}

const Login = Form.create()(LoginComponent)


export default function () {
  return (
    <div>
      <Login />
    </div>
  )
}
