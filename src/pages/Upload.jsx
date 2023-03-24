import React, { useState, useEffect, useRef } from 'react'
import './less/upload.less'
import 'quill/dist/quill.snow.css';
import { Upload } from 'antd'
import axios from 'axios';

export default function UploadPhoto() {

  const [token, setToken] = useState()
  const test = useRef()
  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:3007/api/getToken',
    }).then(res => {
      console.log(res.data.data)
      const uploadToken = res.data.data
      setToken(uploadToken)
    })
    // const ref = document.querySelector('test')
    console.log(test.current)

  })

  const beforeUpload = (file) => {
    return new Promise(resolve => {
      // 图片压缩      
      let reader = new FileReader(), img = new Image();
      reader.readAsDataURL(file);
      let imgFile = null
      //reader读完之后执行onload
      reader.onload = function (e) {
        img.src = e.target.result;
      }
      //img加载完成之后
      img.onload = function () {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        if (img.width <= 350) {
          resolve(file);
        }
        else {
          //若上传图片宽度超过屏幕宽度
          console.log("图片尺寸" + this.width + "," + this.height)
          let originWidth = 350;
          let originHeight = (350 / this.width) * this.height; //等比例缩放高度

          //将图片利用canvas.drawImage进行绘制
          canvas.width = originWidth;
          canvas.height = originHeight;
          context.clearRect(0, 0, originWidth, originHeight);
          context.drawImage(img, 0, 0, originWidth, originHeight);

          //绘制后调用toBlob方法转化为blob对象并压缩，最后通过new File()将blob对象转化为文件对象并上传
          canvas.toBlob((blob) => {//此处的blob就是压缩后的blob对象
            imgFile = new File([blob], file.name, { type: file.type }); // 将blob对象转化为图片文件
            console.log("压缩后的图片尺寸" + imgFile.size)
            resolve(imgFile);
          }, file.type, 1); // file压缩的图片类型
        }
      }
    }
    )
  }

  // 获取回传的文件地址
  const handleUploadChange = info => {
    if (info.file.status === 'done') {
      const imageKey = info.file.response.key
      const uploadUrl = "http://rloiasngj.hn-bkt.clouddn.com/" + imageKey;//这个http://xxx.com/是你的七牛云的
      console.log(uploadUrl);
    }
  }

  return (
    <div className='upload'>
      {/* 上传图片 */}
      <Upload
        name='file'//上传类型为file，若填image可能会报错
        action='http://upload-z2.qiniu.com'//七牛云提供的post统一接口
        data={
          {
            'token': token,//uploadToken为从后端获得的token
            'fileKey': Date.now() + Math.floor(Math.random() * (999999 - 100000) + 100000) + 1
            //fileKey为上传到图床为该图片设的名字,这里给图片随机生成一个名
          }
        }
        beforeUpload={beforeUpload.bind(this)}//上传图片之前的操作，具体见2.4
        onChange={handleUploadChange}//当上传一个文件后要执行的操作，具体见2.4
        showUploadList={false}//隐藏上传列表。为true时上传会转圈圈
      >
        <button>
          Click to Upload
        </button>
        {/* //这个button作为Upload的“扳机”，将富文本编辑器上的上传图片按钮和这个按钮绑定，点击上传图片按钮就会出发Upload组件 */}
      </Upload>
      <div className='test' ref={test}>jsaijsjijasi</div>
      <>
        <div>dsajdi</div>
      </>
    </div>
  )
}
