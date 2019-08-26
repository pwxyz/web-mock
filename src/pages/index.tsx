import React from 'react';
import styles from './index.css';
import { formatMessage } from 'umi-plugin-locale';
import request from '@/utils/request';
import api from '@/constants/api'
import dayjs from 'dayjs'
import router from 'umi/router'

interface InitState {
  data: [
    { name: string, createdAt: number, _id: string }
  ] | []
}


class IndexPage extends React.Component<any, any>{
  state: InitState = {
    data: []
  }
  componentDidMount() {
    this.getProject()
  }

  getProject = async () => {
    let res = await request({ method: 'get', url: api.PROJECT })
    let { data } = res
    if (data && data.length) {
      this.setState({ data })
    }
  }

  projectClick = async (id: string) => {
    router.push(`/project/${id}`)
  }

  render() {
    const { data } = this.state
    return (
      <div className={styles.container} >
        {
          data && data.length ? data.map(i => <Project name={i.name} createdAt={i.createdAt} key={i._id} id={i._id} onClick={this.projectClick} />) : ''}
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



