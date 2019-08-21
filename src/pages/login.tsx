

import React from 'react'
import { Form, Icon, Input, Button } from 'antd'


const LoginComponent = (props: Object) => {
  console.log(props)
  return (
    <div>
      LoginComponent
    </div>
  )
}

const Login = Form.create()(LoginComponent)


export default function () {
  return (
    <div>
      <Login />
    </div>
  )
}
