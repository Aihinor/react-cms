import '@wangeditor/editor/dist/css/style.css' // 引入 css
import './less/editor.less'
import React, { useState, useEffect, useRef } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import axios from 'axios'

export default function MyEditor() {
  // editor 实例
  const [editor, setEditor] = useState(null)                   // JS 语法
  // 编辑器内容
  const [html, setHtml] = useState('<p>hello</p>')
  const showMsg = useRef()

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      setHtml('<p>hello world</p>')
    }, 1500)
  }, [])

  // 工具栏配置
  const toolbarConfig = {}                        // JS 语法
  // 编辑器配置
  const editorConfig = {                         // JS 语法
    placeholder: '请输入内容...',
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  const onClick = () => {
    console.log(showMsg.current.innerText)
    const msg = showMsg.current.innerText
    axios({
      method:'post',
      url:'http://127.0.0.1:3007/api/submit',
      body:{
        content:msg
      }
    }).then(res=>{
      console.log(res)
    })

  }

  return (
    <div className='editor'>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={editor => setHtml(editor.getHtml())}
          mode="default"
          style={{ height: '500px', overflowY: 'hidden' }}
        />
      </div>
      <div className='show_box' ref={showMsg}>
        {html}
      </div>
      <button onClick={onClick}>提交新闻详情内容HTML文本</button>
    </div>
  )
}
