
import React from 'react'
import { Icon, Table, Form } from 'antd'
import { columns } from './constants';

interface TagTableProps {
  data: object[]
  onSelectChange: (arr: string[], arg: object) => void
}

class Tag extends React.Component<TagTableProps, any>{

  select = (selecrRowKeys: any, rows: any) => {
    let arr = rows && rows.map((i: { _id: string }) => i && i._id)
    let arg: {} = rows && rows.length === 1 ? rows[0] : {}
    this.props.onSelectChange(arr, arg)
  }
  render() {
    const { data, onSelectChange } = this.props
    return (
      <div>
        <Table columns={columns} dataSource={data} rowSelection={{ onChange: this.select }} rowKey='_id' />
      </div>
    )
  }
}


export default Tag
