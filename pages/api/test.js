// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Minio = require('minio')

const minioClient = new Minio.Client({
  endPoint: 's3.naizi.fun',
  port: 200,
  useSSL: true,
  accessKey: 'fuming',
  secretKey: 'fuming123',
})
export default function handler(req, res) {
  // minioClient.listBuckets(function (err, buckets) {
  //   if (err) return console.log(err)
  // })
  var data = []
  var stream = minioClient.listObjects('test', '', true)
  stream.on('data', function (obj) {
    data.push(obj)
  })
  stream.on('end', function (obj) {
    // console.log(data)
    res.status(200).json(data)
  })
  stream.on('error', function (err) {
    console.log(err)
  })
}
