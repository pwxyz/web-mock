import React from 'react';
import styles from './index.less';
import request from '@/utils/request';
import api from '@/constants/api'
import dayjs from 'dayjs'
import router from 'umi/router'
import { connect } from 'dva';
import { Button, Form, Input, Modal, message, Popconfirm, Switch } from 'antd';
import result from 'lodash/result'

interface InitState {
  data: [
    { name: string, createdAt: number, _id: string }
  ] | [],
  modalVisible: boolean,
  id?: string,
  selectArg?: object
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
    id: '',
    selectArg: {},
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

  delProject = async (id: string) => {
    let { err } = await request({ method: 'delete', url: api.PROJECT, data: { id: [id] } })
    if (!err) {
      message.success('删除成功')
      this.getProject()
    }
  }

  editProject = async (obj: object) => {
    let data = { ...obj, id: this.state.id }
    let { err } = await request({ method: 'put', url: api.PROJECT, data })
    if (!err) {
      message.success('修改成功')
      this.getProject()
    }
  }

  projectClick = async (id: string) => {
    router.push(`/project/${id}`)
  }

  showProjectModal = (id?: string) => {
    let selectArg = result(this.state, 'data', []).find(i => i['_id'] === id) || {}
    this.setState({ modalVisible: true, isNew: !id, id, selectArg })
  }

  hideProjectModal = () => {
    this.setState({ modalVisible: false })
  }


  render() {
    const { data, isNew, modalVisible, selectArg } = this.state
    // console.log(this.props)
    const { isLogin = false } = this.props
    const add = () => this.showProjectModal()
    return (
      <div className={styles.container} >
        {
          data && data.length ? data.map(i => <Project name={i.name} createdAt={i.createdAt} key={i._id} id={i._id} onClick={this.projectClick} delProject={this.delProject} showEditProject={this.showProjectModal} />) : '暂无项目'
        }
        {isLogin && <div style={{ position: 'fixed', right: 70, top: 70 }} ><Button type='primary' onClick={add} >新增项目</Button></div>}
        <Modal footer={null} visible={modalVisible} maskClosable={false} onCancel={this.hideProjectModal} title={isNew ? '新增' : '编辑'} >

          <ProjectModalContent onChange={isNew ? this.addProject : this.editProject} isNew={isNew} data={selectArg} />
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
  delProject: (id: string) => void
  showEditProject: (id: string) => void
}

const Project = ({ name, createdAt, id, onClick, delProject, showEditProject }: ProjectProps) => {
  const getClick = () => {
    onClick(id)
  }
  return (
    <div className={styles.project}   >
      <div onClick={getClick} style={{ cursor: 'pointer' }} >
        <div>{name}</div>
        <div>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
      <div className={styles.btncontent} >
        <Popconfirm title='确定删除该项目?' onConfirm={_ => delProject(id)} >
          <Button type='danger' >删除</Button>
        </Popconfirm>

        <Button onClick={_ => showEditProject(id)} >编辑</Button>
      </div>
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
    const { data = {}, isNew } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form  {...formItemLayout} className={styles.forms}>
          <FormItem required={true} label='name'>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入name' }],
              initialValue: result(data, 'name') || ''
            })(
              <Input />
            )}
          </FormItem>
          <FormItem required={true} label='description' >
            {getFieldDecorator('description', {
              initialValue: result(data, 'description') || ''
            })(
              <Input />
            )}
          </FormItem>
          <FormItem required={false} label='testUrl'>
            {getFieldDecorator('testUrl', {
              initialValue: result(data, 'testUrl') || '',

            })(
              <Input />
            )}
          </FormItem>
          <FormItem required={true} label='是否允许自动添加'>
            {getFieldDecorator('allowAdd', {
              initialValue: result(data, 'allowAdd') || true,
              valuePropName: 'checked'
            })(
              <Switch />
            )}
          </FormItem>
          <FormItem required={false} label='routerPrefix'>
            {getFieldDecorator('routerPrefix', {
              initialValue: result(data, 'routerPrefix') || ''
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

