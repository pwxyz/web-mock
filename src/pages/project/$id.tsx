


import React from 'react'
import styles from './id.less'
import request from '@/utils/request';
import api from '@/constants/api';
import { Tag, Modal, Switch, Input, Button, Popconfirm, message, Icon } from 'antd';
import result from 'lodash/result';
import dayjs from 'dayjs'
import { connect } from 'dva';
import ApiEditor from '@/components/ApiEditor/index';
import { string } from 'prop-types';

interface InitState {
  data: [{
    _id: string,
    router: string,
    method: string,
    updatedAt: number,
    remark?: string,
  }] | [],
  projectid: string,
  project: {
    name: string,
    testUrl: string,
    allowAdd: boolean
  },
  visible: boolean,
  isAddApi: boolean,
  apiModal: boolean,
  selectApi: {
    [x: string]: any
  }
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
class ProjectIdCompoent extends React.Component<any, InitState>{
  state: InitState = {
    data: [],
    project: {
      name: '',
      testUrl: '',
      allowAdd: false
    },
    visible: false,
    selectApi: {},
    projectid: '',
    isAddApi: true,
    apiModal: false,
  }
  componentDidMount() {
    let id = result(this.props, 'match.params.id', '')
    this.setState({ projectid: id })
    this.getApiList(id)
    this.getProjectInfo(id)
  }

  getApiList = async (id: string) => {

    let res = await request({ method: 'get', url: api.API, data: { id } })
    if (res && res.data && res.data.length) {
      this.setState({ data: res.data })
    }
  }

  getProjectInfo = async (id: string) => {
    let res = await request({ method: 'get', url: api.PROJECT, data: { id } })
    if (res && res.data && res.data._id) {
      this.setState({ project: res.data })
    }
  }

  getApiClick = (id: string) => {
    let { data } = this.state
    if (data && data.length) {
      let obj = data.find(i => i._id === id)
      obj && obj['_id'] && this.setState({ selectApi: obj, visible: true })
    }

  }

  hideModal = () => {
    this.setState({ visible: false, selectApi: {} })
  }

  delApi = async (id: string) => {
    let { err } = await request({ method: 'delete', url: api.API + '/' + id })
    if (!err) {
      message.success('删除成功')
      let projectid = this.state.projectid
      this.getApiList(projectid)
    }
  }

  addApi = async (obj: object) => {
    let projectid = this.state.projectid
    let { err } = await request({ method: 'post', url: api.API, data: { ...obj, belongTo: projectid } })
    if (!err) {
      message.success('新增成功')
      this.getApiList(projectid)
    }
  }

  editApi = async (obj: object) => {
    let apiId = this.state.selectApi._id
    let projectid = this.state.projectid
    let { err } = await request({ method: 'put', url: api.API + '/' + apiId, data: obj })
    if (!err) {
      message.success('修改成功')
      this.getApiList(projectid)
    }
  }

  hideApiModal = () => {
    this.setState({ apiModal: false, selectApi: {} })
  }

  showApiMoadl = (id?: string) => {
    interface ObjProps {
      apiModal: boolean,
      isAddApi: boolean,
      selectApi: {
        [x: string]: any
      }
    }
    let obj: ObjProps = {
      apiModal: true,
      isAddApi: !id,
      selectApi: this.state.data.find(i => i._id === id) || {}
    }
    this.setState(obj)
  }

  render() {
    const { data, project, visible, selectApi, projectid, isAddApi, apiModal } = this.state
    const { isLogin = false } = this.props
    console.log(isLogin, this.props.state)
    const add = () => this.showApiMoadl()
    return (
      <div className={styles.container} >
        {isLogin && <div style={{ position: 'fixed', right: 70, top: 70 }} >
          <Button onClick={add} type='primary' icon='plus' >新增Api</Button>
        </div>}
        <div  >
          <h2>{project.name}</h2>
          <div><span>对接地址：</span>{project.testUrl}</div>
          <div><span>mock地址：</span>{`${location.host}/mock/${projectid}`}</div>
          <div><span>允许导入：</span><Switch checked={project.allowAdd} disabled={true} /></div>
        </div>
        <div>
          {
            data && data.length ? data.map(i => <Item remark={i.remark || ''} updatedAt={i.updatedAt} key={i._id} router={i.router} method={i.method} id={i._id} onClick={this.getApiClick} selectApi={selectApi} delApi={this.delApi} isLogin={isLogin} editApi={this.showApiMoadl} />) : '暂时没有APi'
          }
        </div>
        <Modal visible={visible} onCancel={this.hideModal} maskClosable={false} footer={null} width={1000} >
          <ModalContent {...selectApi} />
        </Modal>
        <Modal visible={apiModal} footer={null} width={1000} title={isAddApi ? '新增' : '编辑'} maskClosable={false} onCancel={this.hideApiModal} >
          // @ts-ignore
          <ApiEditor onChange={isAddApi ? this.addApi : this.editApi} data={selectApi} />
        </Modal>
      </div>
    )
  }
}

interface ItemProps {
  id: string,
  router: string,
  method: string,
  updatedAt?: number,
  isLogin: boolean,
  editApi: (id: string) => void,
  remark: string,
  selectApi?: {
    [x: string]: string
  }
  onClick: (id: any) => void,
  delApi: (id: any) => void
}

const getColor = (key?: string) => {
  switch (key) {
    case 'GET':
      return '#2d8cf0';
      break;
    case 'POST':
      return '#19be6b'
      break;
    case 'DELETE':
      return '#ed3f14';
      break;
    case 'PUT':
      return '#f90';
      break;
    default:
      return '#2d8cf0'
  }
}

const Item = ({ id, router, method, onClick, selectApi, delApi, isLogin, editApi, updatedAt, remark }: ItemProps) => {
  const color = getColor(method)
  const getClick = () => {
    onClick(id)
  }
  const onDel = () => {
    delApi(id)
  }

  const onEditApi = () => {
    editApi(id)
  }

  // const isSelected = selectApi && selectApi['_id'] && id === selectApi['_id']

  const isSelected = false
  return (
    <div className={styles.item} style={{ background: `${isSelected ? 'rgba(0,0,0,0.3)' : ''}` }} >
      <div style={{ flex: 1, cursor: 'pointer', marginRight: 15 }} onClick={getClick} >
        <Tag color={color} >{method}</Tag>
        <span style={{ fontSize: 18 }} >{router}</span>
        <span style={{ float: 'right' }} >
          <span style={{ marginRight: 20 }} >{remark}</span>
          <span>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        </span>
      </div>
      {
        isLogin && <div>
          <Button type='primary' style={{ marginRight: 15 }} onClick={onEditApi} >编辑</Button>
          <Popconfirm onConfirm={onDel} title='确定删除该api?' okText='是' cancelText='否' >
            <Button type='danger'  >删除</Button>
          </Popconfirm>
        </div>
      }
    </div>
  )
}

export default ProjectIdCompoent


interface ModalConenteProps {
  router?: string
  method?: string
  createdAt?: number
  updatedAt?: number
  req?: object
  res?: object
  remark?: string
}

const ModalContent = ({ router, method, createdAt, updatedAt, req, res, remark }: ModalConenteProps) => {
  return (
    <div className={styles.content} >
      <div><span>Router：</span>{router}</div>
      <div><span>method：</span>{method}</div>
      <div><span>createdAt：</span>{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
      <div><span>updatedAt：</span>{dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>
      <div><span>req：</span><JsonRender obj={req} /></div>
      <div><span>res：</span><JsonRender obj={res} /></div>
      {/* <div><span>req：</span><JsonView json={req} /></div>
      <div><span>res：</span><JsonView json={res} /></div> */}

      <div><span>备注：</span>{remark}</div>
      <div><span>注意：</span>一般情况下，get、delete参数位置在URL上，post、put在body上，暂不考虑特殊情况; </div>
    </div>
  )
}




const JsonRender = ({ obj }: { obj: object | undefined }) => {
  return (
    <div style={{ background: 'rgba(204, 197, 197, 0.2)', padding: 10, overflow: 'hidden' }} >
      <code style={{ whiteSpace: 'pre' }}  >{JSON.stringify(obj, null, 2) || '{}'}</code>
    </div>
  )
}

