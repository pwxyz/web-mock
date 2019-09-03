

import React from 'react'
import { Form, Button, Input, Select } from 'antd'
import CodeEditor from '@/components/CodeEditor'
import result from 'lodash/result';
import Styles from './index.less'
let FormItem = Form.Item

const methodArr = ['GET', 'POST', 'DELETE', 'PUT']


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

interface ApiEditorProps {
  onChange: (obj: object) => void,
  data: { [x: string]: string | object },
  form?: {
    validateFieldsAndScroll: any,
    getFieldDecorator: any
  }
}

class ApiEditorContent extends React.Component<any, any>{

  state = {

  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: undefined | string, values: object) => {
      if (!err) {
        let obj: { [x: string]: string } = { ...values }
        obj['res'] = JSON.parse(obj['res'])
        obj['req'] = JSON.parse(obj['req'])
        // console.log(obj)
        this.props.onChange(obj)
      }
    })
  }

  getReq = (value: any) => {
    console.log(value)
  }

  handleVerifyJson = (rule: any, value: string, cb: (any?: any) => any) => {
    try {
      if (JSON.parse(value)) {
        cb()
      }
    }
    catch (err) {
      cb('JSON格式不正确')
    }
  }

  handleVerifyRouter = (rule: any, value: string, cb: (any?: any) => any) => {
    try {
      if (value && /^\//.test(value)) {
        cb()
      }
      else cb('router必须以/起头')
    }
    catch (err) {
      cb('router必须以/起头')
    }
  }

  render() {
    const { data = {} } = this.props
    const { getFieldDecorator } = this.props.form
    console.log(data)
    return (
      <Form  {...formItemLayout} className={Styles.forms}>
        <FormItem required={false} label='router'>
          {getFieldDecorator('router', {
            rules: [{ required: true, message: '请输入router' }, { validator: this.handleVerifyRouter }],
            initialValue: result(data, 'router') || '/'
          })(
            <Input />
          )}
        </FormItem>
        <FormItem required={false} label='method' >
          {getFieldDecorator('method', {
            rules: [{ required: true, message: '请输入method' }],
            initialValue: result(data, 'method') || methodArr[0]
          })(
            <Select>
              {
                methodArr.map(i => <Select.Option value={i} key={i} >{i}</Select.Option>)
              }
            </Select>
          )}
        </FormItem>
        <FormItem required={false} label='备注'>
          {getFieldDecorator('remark', {
            initialValue: result(data, 'remark') || ''
          })(
            <Input />
          )}
        </FormItem>
        <FormItem required={false} label='req'>
          {getFieldDecorator('req', {
            rules: [{ required: true, message: 'req' }, { validator: this.handleVerifyJson }],
            initialValue: result(data, 'req') ? JSON.stringify(result(data, 'req'), null, 2) : '{\n  \n}'
          })(
            <CodeEditor height={200} width={600} type={'editor'} onChange={this.getReq} key={Number(new Date())} />
          )}
        </FormItem>
        <FormItem required={false} label='res'>
          {getFieldDecorator('res', {
            rules: [{ required: true, message: 'res' }, { validator: this.handleVerifyJson }],
            initialValue: result(data, 'res') ? JSON.stringify(result(data, 'res'), null, 2) : '{\n  "status":1,\n  "message":"错误信息",\n  "payload":{\n  \n  }  \n}'
          })(
            <CodeEditor height={380} width={600} type={'editor'} onChange={this.getReq} key={Number(new Date())} />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout} >
          <Button type={'primary'} loading={false} onClick={this.handleSubmit} style={{ width: "100%", marginTop: "10px" }}>
            {'提交'}
          </Button>
        </FormItem>
      </Form>
    )
  }
}


const ApiEditor = Form.create()(ApiEditorContent)

export default ApiEditor
