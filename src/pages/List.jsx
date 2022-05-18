import React, { useState, useEffect } from 'react'
import './less/List.less'
import { Table, Space, Button, message } from 'antd';
import { ArticleListApi, ArticleDelectApi } from '../request/api'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

export default function List() {

  const navigate = useNavigate()
  // 列表数组
  const [arr, setArr] = useState([]);
  // 分页
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [update,setUpdate] = useState(1)

  // 标题组件
  function MyTitle(props) {
    return (
      <div>
        <a className='list_title' href={'http://codesohigh.com:8765/article/' + props.id} target='_blank'>{props.title}</a>
        <p style={{ color: '#999' }}>{props.subTitle}</p>
      </div>
    )
  }

  // 封装请求代码
  const getArticleList = (current, pageSize) => {
    ArticleListApi({
      num: current,
      count: pageSize
    }).then(res => {
      if (res.errCode === 0) {
        // 更改pagination
        let { num, count, total } = res.data;
        setPagination({
          current: num,
          pageSize: count,
          total
        })
        // 深拷贝获取到的数组
        let newArr = JSON.parse(JSON.stringify(res.data.arr))
        // 声明一个空数组
        let myarr = []
        // 1. 需要给每个数组项加key 让key=id
        // 2. 需要有一套标签结构
        newArr.map(item => {
          let obj = {
            key: item.id,
            date: moment(item.date).format("YYYY-MM-DD hh:mm:ss"),
            mytitle: <MyTitle id={item.id} title={item.title} subTitle={item.subTitle} />
          }
          myarr.push(obj)
        })
        setArr(myarr)
      }
    })
  }
  // 删除
  const delFn = (id) =>{
    ArticleDelectApi({id}).then(res=>{
      if(res.errCode === 0){
        message.success(res.message)
        // 重新刷新页面
        setUpdate(update+1)
      }else{
        message.error(res.message)
      }
    })
  }

  // 请求文章列表
  useEffect(() => {
    getArticleList(pagination.current, pagination.pageSize)
  }, [update])

  const columns = [
    {
      dataIndex: 'mytitle',
      key: 'mytitle',
      width: '65%',
      render: text => <div>{text}</div>
    },
    {
      dataIndex: 'date',
      key: 'date',
      render: text => <p>{text}</p>
    },
    {
      key: 'action',
      render: text => {
        return (
          <Space size="middle">
            <Button type='primary' onClick={() => navigate('/edit/' + text.key)}>编辑</Button>
            <Button type='danger' onClick={() => delFn(text.key)}>删除</Button>
          </Space>
        )
      },
    },
  ];

  // 分页函数
  const pageChange = (arg) => {
    getArticleList(arg.current, arg.pageSize)
  }

  return (
    <div className='list'>
      <Table
        showHeader={false}
        columns={columns}
        dataSource={arr}
        onChange={pageChange}
        pagination={pagination}
      />
    </div>
  )
}
