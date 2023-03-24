import React from 'react'
import { Form, Input, Button,message } from 'antd';
import './less/Login.less'
import logoImg from '../assets/logo.png'
import { Link,useNavigate } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Login from './Login';
import {RegisterApi} from '../request/api'

export default function Register() {

  const navigate = useNavigate()

  const onFinish = (values) => {
    RegisterApi({
      username:values.username,
      password:values.password
    }).then(res=>{
      if(res.errCode === 0){
        message.success(res.message + '!正在跳转到登录页.....');
        // 跳到登录页
        setTimeout(() =>navigate('/login'), 2000);
      }else {
        message.error(res.message);
      }
    })
  };

  return (
    <div className="login">
      <div className='login_box' >
        {/* <img src={logoImg} alt='' /> */}
        <h1>用户注册</h1>
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
              prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '请输入确认密码!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('两次输入密码不一致!'));
                },
              }),
            ]}
          >
            <Input.Password size='large' placeholder='请输入确认密码' prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Link to='/login' element={<Login />}>已有账号？前往登录</Link>
          </Form.Item>

          <Form.Item>
            <Button size='large' type="primary" htmlType="submit" block>
              立即注册
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
