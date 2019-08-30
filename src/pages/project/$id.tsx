


import React from 'react'
import styles from './id.less'
import request from '@/utils/request';
import api from '@/constants/api';
import { Tag, Modal, Switch, Input, Button, Popconfirm, message } from 'antd';
import result from 'lodash/result';
import dayjs from 'dayjs'
import { connect } from 'dva';
import JsonView from './../../components/JsonView/index';

interface InitState {
  data: [{
    _id: string,
    router: string,
    method: string,
    updatedAt: number
  }] | [],
  projectid: string,
  project: {
    name: string,
    testUrl: string,
    allowAdd: boolean
  },
  visible: boolean,
  selectApi: {
    [x: string]: any
  }
}
const mapStateToProps = (state: { [x: string]: any }) => {
  return {
    isLogin: state['config']['isLogin'],
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
    projectid: ''
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
    await request({ method: 'delete', url: api.API + '/' + id })
    // console.log(res)
    // if (res) {
    message.success('删除成功')
    let projectid = result(this.props, 'match.params.id', '')
    this.getApiList(projectid)
    // }
  }

  render() {
    const { data, project, visible, selectApi, projectid } = this.state
    const { isLogin = false } = this.props
    return (
      <div className={styles.container} >
        <div  >
          <h2>{project.name}</h2>
          <div><span>对接地址：</span>{project.testUrl}</div>
          <div><span>mock地址：</span>{`${location.host}/mock/${projectid}`}</div>
          <div><span>允许导入：</span><Switch checked={project.allowAdd} disabled={true} /></div>
        </div>
        <div>
          {
            data && data.length ? data.map(i => <Item key={i._id} router={i.router} method={i.method} id={i._id} onClick={this.getApiClick} selectApi={selectApi} delApi={this.delApi} isLogin={isLogin} />) : '暂时没有APi'
          }
        </div>
        <Modal visible={visible} onCancel={this.hideModal} maskClosable={false} footer={null} width={1000} >
          <ModalContent {...selectApi} />
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

const Item = ({ id, router, method, onClick, selectApi, delApi, isLogin }: ItemProps) => {
  const color = getColor(method)
  const getClick = () => {
    onClick(id)
  }
  const onDel = () => {
    delApi(id)
  }

  const isSelected = selectApi && selectApi['_id'] && id === selectApi['_id']

  return (
    <div className={styles.item} style={{ background: `${isSelected ? 'rgba(0,0,0,0.3)' : ''}` }} >
      <div style={{ flex: 1, cursor: 'pointer', marginRight: 15 }} onClick={getClick} >
        <Tag color={color} >{method}</Tag>
        <span style={{ fontSize: 18 }} >{router}</span>
      </div>
      {
        isLogin && <div>
          <Button type='primary' style={{ marginRight: 15 }} >编辑</Button>
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

      {/* <div><span>备注：</span>{ remark }</div> */}
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

