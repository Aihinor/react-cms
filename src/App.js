import React from 'react'
import './assets/base.less'
import { Outlet } from 'react-router-dom'
import { Layout } from 'antd';
import Header from './components/Header';
import Aside from './components/Aside';
import Bread from './components/Bread';
import { connect } from 'react-redux';

const { Content } = Layout;

function App(props) {
  return (
    <Layout id='app'>
      <Header key={props.mykey} />
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

const mapStateToProps = (state)=>{
  return {
    mykey:state.mykey
  }
}
export default connect(mapStateToProps)(App)