
import React from 'react'
import getTimeStr from '@/utils/getTimeStr'


export const columns = [
  {
    title: 'name',
    dataIndex: 'name',
  },
  {
    title: '描述',
    dataIndex: 'description',
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    render: (num: number) => <div>{getTimeStr(num)}</div>
  },
  {
    title: '修改时间',
    dataIndex: 'updatedAt',
    render: (num: number) => <div>{getTimeStr(num)}</div>
  }
]
