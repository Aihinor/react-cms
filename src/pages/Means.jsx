import React, { useEffect, useState } from 'react'
import './less/Means.less'
import { Form, Input, Button, Upload, message } from 'antd';
import { GetUserDataApi, ChangeUserDataApi } from '../request/api'
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

// 将图片路径转base64
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

// 限制图片大小
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('你只能上传JPG/PNG格式的图片!');
  }
  const isLt2M = file.size / 1024 / 1024 / 1024 < 200;
  if (!isLt2M) {
    message.error('请上传小于200kB的图!');
  }
  return isJpgOrPng && isLt2M;
}

// const [imageUrl,setImageUrl] = useState()

export default function Means() {

  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [username1, setUsername1] = useState('')
  const [password1, setPassword1] = useState('')
  const navigate = useNavigate()

  // 点击上传图片
  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setLoading(false)
        setImageUrl(imageUrl)
        // 存储图片名称
        localStorage.setItem('avatar',info.file.response.data.filePath)
        window.location.reload() // 强制页面刷新
      }
      );
    }
  };

  useEffect(() => {
    GetUserDataApi().then(res => {
      if (res.errCode === 0) {
        message.success(res.message)
        sessionStorage.setItem('username', res.data.username)
      }
    })
  }, [])

  // 表单提交的事件
  const onFinish = (values) => {
    // 如果表单的username有值 且值不等于初始化拿到的username
    if (values.username !== sessionStorage.getItem('username') && values.password.trim() !== '') {
      // 做表单提交
      ChangeUserDataApi({
        username: values.username,
        password: values.password
      }).then(res => {
        console.log(res)
        if (res.errCode === 0) {
          message.success(res.message)
          setTimeout(() => navigate('/login'), 1000);
        } else {
          message.error(res.message)
        }
      })
    }
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className='means'>
      <Form className='change_box' onFinish={onFinish} initialValues={{ username: username1, password: password1 }}>
        <Form.Item label="修改用户名" name="username">
          <Input placeholder='请输入新用户名' />
        </Form.Item>

        <Form.Item label="修 改 密 码" name="password" >
          <Input.Password placeholder='请输入新密码' />
        </Form.Item>

        <Form.Item className='submit'>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
      <p>点击下方修改头像：</p>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
        headers={{'cms-token':localStorage.getItem('cms-token')}}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </div>
  )
}
