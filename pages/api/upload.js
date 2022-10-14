// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Minio = require('minio')
const multiparty = require('multiparty')
const fs = require('fs')
export default function handler(req, res) {
  if (req.method === 'POST') {
    console.log(req.body)
    // let form = new multiparty.Form()
    // form.parse(req, (err, fields, files) => {
    //   console.log(fields)
    //   console.log(files)
    // })
    res.json({
      url: 'http://www.baidu.com',
    })
    // const {
    //   values: { s3url, accessKey, secretKey },
    //   bucket,
    //   folderPath,
    //   objectName,
    //   stream,
    // } = req.body
    return
    const { protocol, hostname, port } = new URL(s3url)
    const useSSL = protocol === 'https:'
    const minioClient = new Minio.Client({
      endPoint: hostname,
      port: parseInt(port) || (useSSL ? 443 : 80),
      useSSL,
      accessKey,
      secretKey,
    })
    minioClient.putObject(bucket, objectName, stream, function (err, etag) {
      return console.log(err, etag) // err should be null
    })
    // const data = []
    // const stream = minioClient.listObjects(bucket, folderPath || '', true)
    // stream.on('data', function (obj) {
    //   data.push(obj)
    // })
    // stream.on('end', function (obj) {
    //   res.status(200).json({ code: 200, data: { ...data, bucket, folderPath } })
    // })
    // stream.on('error', function (err) {
    //   res.status(500).json({ code: 500, data: err })
    // })
  } else {
    res.status(200).json('use POST method')
  }
}
