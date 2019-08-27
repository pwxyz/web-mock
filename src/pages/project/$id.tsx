


import React from 'react'
import styles from './id.less'
import request from '@/utils/request';
import api from '@/constants/api';
import { Tag, Modal } from 'antd';
import result from 'lodash/result';
import dayjs from 'dayjs'

interface InitState {
  data: [{
    _id: string,
    router: string,
    method: string,
    updatedAt: number
  }] | [],
  project: {
    name: string,
    testUrl: string
  },
  visible: boolean,
  selectApi: object
}
class ProjectIdCompoent extends React.Component<any, InitState>{
  state: InitState = {
    data: [],
    project: {
      name: '',
      testUrl: ''
    },
    visible: false,
    selectApi: {}
  }
  componentDidMount() {
    let id = result(this.props, 'match.params.id', '')
    this.getApiList(id)
    this.getProjectInfo(id)
  }

  getApiList = async (id: string) => {

    let res = await request({ method: 'get', url: api.API, data: { id } })
    let { data } = res
    if (data && data.length) {
      this.setState({ data })
    }
  }

  getProjectInfo = async (id: string) => {
    let res = await request({ method: 'get', url: api.PROJECT, data: { id } })
    let { data } = res
    if (data && data._id) {
      this.setState({ project: data })
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
    this.setState({ visible: false })
  }


  render() {
    const { data, project, visible, selectApi } = this.state

    return (
      <div className={styles.container} >
        <div  >
          <h2>{project.name}</h2>
          <div><span>对接地址：</span>{project.testUrl}</div>
          <div><span>mock地址：</span>{project.testUrl}</div>
        </div>
        <div>
          {
            data && data.length ? data.map(i => <Item key={i._id} router={i.router} method={i.method} id={i._id} onClick={this.getApiClick} />) : '暂时没有APi'
          }
        </div>
        <Modal visible={visible} onCancel={this.hideModal} >
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
  onClick: (id: any) => void
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

const Item = ({ id, router, method, onClick }: ItemProps) => {
  const color = getColor(method)
  const getClick = () => {
    onClick(id)
  }
  return (
    <div className={styles.item} onClick={getClick} >
      <Tag color={color} >{method}</Tag>
      <div>{router}</div>
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
      {/* <div><span>备注：</span>{ remark }</div> */}
      <div><span>注意：</span>一般情况下，get、delete参数位置在URL上，post、put在body上，暂不考虑特殊情况</div>
    </div>
  )
}

const JsonRender = ({ obj }: { obj: object | undefined }) => {
  return (
    <div>
      <code style={{ whiteSpace: 'pre' }}  >{JSON.stringify(obj, null, 2)}</code>
    </div>
  )
}

