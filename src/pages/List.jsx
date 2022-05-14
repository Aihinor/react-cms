import React, { useState, useEffect } from 'react'
import './less/List.less'
import { Table, Space, Button } from 'antd';
import { ArticleListApi } from '../request/api'
import moment from 'moment'

export default function List() {

  const [arr, setArr] = useState([
    {
      key: '1',
      name: 'John Brown',
      address: 'New York No. 1 Lake Park',
    },
  ])

  //
  useEffect(() => {
    ArticleListApi().then(res => {
      if (res.errCode === 0) {
        console.log(res.data);
        let newArr = JSON.parse(JSON.stringify(res.data.arr))
        // 1. 需要给每个数组项加key 让key=id
        // 2. 需要有一套标签结构
        newArr.map(item => {
          item.key = item.id;
          item.date = moment(item.date).format("YYYY-MM-DD hh:mm:ss");
          item.mytitle = `
            <div>
              <Link className='list_title' to='/'>${item.title}</Link>
              <p style={{ color: '#999' }}>${item.subTitle}</p>
            </div>
          `
        })
        console.log(newArr);
        setArr(newArr)
      }
    })
  }, [])

  const columns = [
    {
      dataIndex: 'mytitle',
      key: 'mytitle',
      width: '65%',
      render: text => <div dangerouslySetInnerHTML={{__html:text}}></div>
    },
    {
      dataIndex: 'date',
      key: 'date',
      render: text => <p>{text}</p>
    },
    {
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type='primary'>编辑</Button>
          <Button type='danger'>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='list'>
      <Table showHeader={false} columns={columns} dataSource={arr} />
    </div>
  )
}
