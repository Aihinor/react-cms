import React from 'react'
import { Form, Input, Button,message } from 'antd';
import './less/Login.less'
import study from '../assets/study.webp'
import { Link,useNavigate } from 'react-router-dom'
import Register from './Register';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {LoginApi} from '../request/api'

export default function Login() {

  const navigate = useNavigate()

  const onFinish = (values) => {
    LoginApi({
      username:values.username,
      password:values.password
    }).then(res=>{
      console.log(res);
      if(res.errCode === 0){
        message.success(res.message + '!正在跳转页面.....')
        // 存储数据
        localStorage.setItem('avatar',res.data.avatar)
        localStorage.setItem('cms-token',res.data['cms-token'])
        localStorage.setItem('editable',res.data.editable)
        localStorage.setItem('player',res.data.player)
        localStorage.setItem('username',res.data.username)
        // 跳转到根路径
        setTimeout(() => navigate('/'), 2000);
      }else{
        message.error(res.message)
      }
    })
  };

  return (
    <div className="login">
      <div className='login_box' >
        {/* <img src={study} alt='' style={{width:'300px',height:'100px'}}/> */}
        <h1>用户登录</h1>
        <Form 
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '用户名不能为空!',
              },
            ]}
          >
            <Input 
            placeholder='请输入用户名' 
            size='large'  
            prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '密码不能为空!',
              },
            ]}
          >
            <Input.Password 
            placeholder='请输入密码' 
            size='large'
            prefix={<LockOutlined/>}/>
          </Form.Item>

          <Form.Item>
            <Link to='/register' element={<Register/>}>还没账号？立即注册</Link>
          </Form.Item>

          <Form.Item>
            <Button size='large' type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
