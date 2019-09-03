import React from 'react';
import styles from './index.css';
import request from '@/utils/request';
import api from '@/constants/api'
import dayjs from 'dayjs'
import router from 'umi/router'
import { connect } from 'dva';
import { Button, Form, Input, Modal, message } from 'antd';
import result from 'lodash/result'

interface InitState {
  data: [
    { name: string, createdAt: number, _id: string }
  ] | [],
  modalVisible: boolean,
  isNew: boolean
}

const mapStateToProps = (state: { [x: string]: any }) => {
  return {
    isLogin: state['config']['isLogin'],
    state
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    dispatch
  }
}
@(connect(mapStateToProps, mapDispatchToProps) as any)
class IndexPage extends React.Component<any, any>{
  state: InitState = {
    data: [],
    modalVisible: false,
    isNew: true
  }
  componentDidMount() {
    this.getProject()
  }

  getProject = async () => {
    let res = await request({ method: 'get', url: api.PROJECT })
    let { data } = res
    if (data && data.length > -1) {
      this.setState({ data })
    }
  }

  addProject = async (data: object) => {
    let { err } = await request({ method: 'post', url: api.PROJECT, data })
    if (!err) {
      message.success('新增成功')
      this.getProject()
    }
  }

  projectClick = async (id: string) => {
    router.push(`/project/${id}`)
  }

  showProjectModal = (id?: string) => {
    this.setState({ modalVisible: true, isNew: !id })
  }

  hideProjectModal = () => {
    this.setState({ modalVisible: false })
  }

  render() {
    const { data, isNew, modalVisible } = this.state
    console.log(this.props)
    const { isLogin = false } = this.props
    const add = () => this.showProjectModal()
    return (
      <div className={styles.container} >
        {
          data && data.length ? data.map(i => <Project name={i.name} createdAt={i.createdAt} key={i._id} id={i._id} onClick={this.projectClick} />) : '暂无项目'
        }
        {isLogin && <div style={{ position: 'fixed', right: 70, top: 70 }} ><Button type='primary' onClick={add} >新增项目</Button></div>}
        <Modal footer={null} visible={modalVisible} maskClosable={false} onCancel={this.hideProjectModal} title={isNew ? '新增' : '编辑'} >

          <ProjectModalContent onChange={this.addProject} />
        </Modal>
      </div>
    )
  }
}

interface ProjectProps {
  name: string,
  createdAt: number,
  id: string,
  onClick: (id: string) => void
}

const Project = ({ name, createdAt, id, onClick }: ProjectProps) => {
  const getClick = () => {
    onClick(id)
  }
  return (
    <div className={styles.project} onClick={getClick}  >
      <div>{name}</div>
      <div>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
    </div>
  )
}


export default IndexPage

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


const FormItem = Form.Item

class ProjectContent extends React.Component<any, any>{

  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: undefined | string, values: object) => {
      if (!err) {
        this.props.onChange(values)
      }
    })
  }

  render() {
    const { data = {} } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form  {...formItemLayout} className={styles.forms}>
          <FormItem required={false} label='name'>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入name' }],
              initialValue: result(data, 'name') || ''
            })(
              <Input />
            )}
          </FormItem>
          <FormItem required={false} label='description' >
            {getFieldDecorator('description', {
              initialValue: result(data, 'description') || ''
            })(
              <Input />
            )}
          </FormItem>
          <FormItem required={false} label='testUrl'>
            {getFieldDecorator('testUrl', {
              initialValue: result(data, 'testUrl') || ''
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout} >
            <Button type={'primary'} loading={false} onClick={this.handleSubmit} style={{ width: "100%", marginTop: "10px" }}>
              {'提交'}
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}


const ProjectModalContent = Form.create()(ProjectContent)

