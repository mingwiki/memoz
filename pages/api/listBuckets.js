// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Minio = require('minio')
export default function handler(req, res) {
  if (req.method === 'POST') {
    const { s3url, accessKey, secretKey } = JSON.parse(req.body)
    const { protocol, hostname, port } = new URL(s3url)
    const useSSL = protocol === 'https:'
    const minioClient = new Minio.Client({
      endPoint: hostname,
      port: parseInt(port) || (useSSL ? 443 : 80),
      useSSL,
      accessKey,
      secretKey,
    })
    minioClient.listBuckets(function (err, buckets) {
      if (err) return res.status(500).json(err)
      res.status(200).json({ code: 200, data: buckets })
    })
    // const data = []
    // const stream = minioClient.listObjects('test', '', true)
    // stream.on('data', function (obj) {
    //   data.push(obj)
    // })
    // stream.on('end', function (obj) {
    //   res.status(200).json(data)
    // })
    // stream.on('error', function (err) {
    //   res.status(500).json(err)
    // })
  } else {
    res.status(200).json('use POST method')
  }
}
