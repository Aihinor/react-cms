import logoImg from '../assets/logo.png'
import React,{useEffect, useState} from 'react'
import { Menu, Dropdown, Space ,message} from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import defaultAvatar from '../assets/defaultAvatar.jpeg'
import { useNavigate } from 'react-router-dom';

export default function Header() {

  const [avatar,setAvatar] = useState(defaultAvatar);
  const [username,setUsername] = useState('游客');
  const navigate = useNavigate()
   
  useEffect(()=>{
    let username1 = localStorage.getItem('username')
    let avatar1 = localStorage.getItem('avatar')
    if(username1){
      setUsername(username1)
    }
    if(avatar1){
      setAvatar('http://47.93.114.103:6688/' + avatar1)
    }
  },[]);

  // 退出登录
  const logout = ()=>{
    localStorage.clear() // 清楚localStorage中的数据
    message.success('退出成功，即将返回登录页.....')
    setTimeout(() => navigate('/login'),2000);
  }

  const menu = (
    <Menu>
      <Menu.Item key={1}>修改资料</Menu.Item>
      <Menu.Divider/>
      <Menu.Item key={2} onClick={logout}>退出登录</Menu.Item>
    </Menu>
  );

  return (
    <div>
      <header>
        <img src={logoImg} alt='' className='logo' />
        <div className='right'>
          <Dropdown overlay={menu}>
            <a className='decline' onClick={e => e.preventDefault()}>
              <Space>
                <img className='avatar' src={avatar} alt=''/>
                <span>{username}</span>
                <CaretDownOutlined />
              </Space>
            </a>
          </Dropdown>
        </div>
      </header>
    </div>
  )
}
