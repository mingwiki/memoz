import { useState } from 'react'
import './App.scss'
import 'antd/dist/antd.css'
import { Layout, message, Upload, Modal } from 'antd'
const { Header, Footer, Sider, Content } = Layout
import { InboxOutlined } from '@ant-design/icons'
const { Dragger } = Upload
import * as minio from 'minio'
function App() {
  const props = {
    name: 'file',
    multiple: true,
    customRequest: ({ file }) => {
      console.log(file)
      const minioClient = new minio.Client({
        endPoint: 's3.naizi.fun',
        port: 200,
        useSSL: true,
        accessKey: 'fuming',
        secretKey: 'fuming123',
      })
      minioClient.listBuckets(function (err, buckets) {
        if (err) return console.log(err)
        console.log('buckets :', buckets)
      })
    },
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }
  return (
    <div className='App'>
      <Content className='container'>
        <Dragger {...props}>
          <p className='ant-upload-drag-icon'>
            <InboxOutlined />
          </p>
          <p className='ant-upload-text'>
            Click or drag file to this area to upload
          </p>
          <p className='ant-upload-hint'>
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger>
      </Content>
      <Footer>Footer</Footer>
    </div>
  )
}

export default App
