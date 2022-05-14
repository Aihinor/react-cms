import React from 'react'
import './assets/base.less'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd';
import Header from './components/Header';
import Aside from './components/Aside';
import Bread from './components/Bread';

const { Content } = Layout;

export default function App() {
  return (
    <Layout id='app'>
      <Header />
      <div className='container'>
        <Aside/>
        <Content>
          <div className='container_box' >
            <Bread/>
            <Outlet />
          </div>
        </Content>
      </div>
      <footer>Respect | Copyright © 2022 Author 你单排吧</footer>
    </Layout>
  )
}
