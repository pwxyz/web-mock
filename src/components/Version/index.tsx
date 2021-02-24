import React from 'react'
import { Form, Input, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import result from 'lodash/result';

interface VersionEditProps extends FormComponentProps {
  onSubmit: (obj: object) => void
  reback: () => void
  data?: {
    name?: string
  }
}

const FormItem = Form.Item

class TagEdit extends React.Component<VersionEditProps, any>{
  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let obj = { ...values }
        // if (result(this.props.data, 'name')) {
        //   obj['id'] = this.props.tagId
        // }

        this.props.onSubmit && this.props.onSubmit(obj)
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { data } = this.props
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
    return (
      <div>
        <Form   {...formItemLayout} onSubmit={this.handleSubmit}>
          <FormItem label="name">
            {
              getFieldDecorator('name', {
                initialValue: result(data, 'name'),
                rules: [
                  { required: true }
                ]
              })(<Input />)
            }
          </FormItem>
          <Form.Item {...tailFormItemLayout} >
            <Button onClick={this.props.reback} style={{ marginRight: 60 }} >返回</Button>
            <Button type="primary" htmlType="submit">
              {/* {result(data, 'name') ? '编辑' : '新增'} */}
              确定
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}

export default Form.create<VersionEditProps>()(TagEdit);
