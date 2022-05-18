import React, { useEffect, useState } from 'react'
import { PageHeader, Button, Modal, Form, Input, message } from 'antd';
import moment from 'moment';
import E from 'wangeditor'
import { ArticleAddApi, ArticleSearchApi, ArticleUpdateApi } from '../request/api'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

let editor = null;

export default function Edit() {

  const [content, setContent] = useState()
  const [title, setTitle] = useState()
  const [subTitle, setSubTitle] = useState()
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const dealData = (errCode, msg) => {
    if (errCode === 0) {
      message.success(msg + '!即将返回文章列表....')
      setTimeout(() => navigate('/list'), 1500);
    } else {
      message.error(msg)
    }
    setIsModalVisible(false) // 关闭对话框
  }

  // 对话框点击了提交
  const handleOk = () => {
    form
      .validateFields() // validate校验 Fields字段
      .then((values) => {
        form.resetFields();
        console.log('Received values of form: ', values);
        let { title, subTitle } = values;
        // 地址栏有ID代表想要更新一篇文章
        if (params.id) {
          // 更新文章的请求
          ArticleUpdateApi({ content, title, subTitle, id: params.id }).then(res => dealData(res.errCode, res.message))
        } else {
          // 添加文章的请求
          ArticleAddApi({ title, subTitle, content }).then(res => dealData(res.errCode, res.message))
        }
      }).catch((info) => {
        return;
      });
  };

  useEffect(() => {
    editor = new E('#div1')
    editor.config.onchange = (newHtml) => {
      setContent(newHtml)
    }
    editor.create()

    // 根据地址栏ID做请求
    if (params.id) {
      ArticleSearchApi({ id: params.id }).then(res => {
        if (res.errCode === 0) {
          editor.txt.html(res.data.content) // 重新设置编辑器的内容
          setTitle(res.data.title)
          setSubTitle(res.data.subTitle)
        }
      })
    }

    return () => {
      // 组件销毁时销毁编辑器
      editor.destroy()
    }
  }, [location.pathname])

  return (
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        ghost={false}
        onBack={params.id ? () => window.history.back() : null}
        title="文章编辑"
        subTitle={"当前日期：" + moment(new Date()).format('YYYY-MM-DD')}
        extra={<Button key="1" type="primary" onClick={() => setIsModalVisible(true)}>提交文章</Button>}
      >
      </PageHeader>
      <div id="div1" style={{ padding: '0 20px 155px', background: '#fff' }}></div>
      <Modal
        title="填写文章标题"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        zIndex={99999}
        okText='提交'
        cancelText='取消'
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 3, }}
          wrapperCol={{ span: 21, }}
          autoComplete="off"
          initialValues={{ title, subTitle }}
        >
          <Form.Item label="标题" name="title"
            rules={[
              {
                required: true,
                message: '请填写标题!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="副标题" name="subTitle">
            <Input />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  )
}
