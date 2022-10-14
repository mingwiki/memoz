// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Minio = require('minio')
const formidable = require('formidable')
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const data = await new Promise((resolve, reject) => {
      const form = formidable({ multiples: true })

      form.parse(req, (err, fields, files) => {
        if (err) reject({ err })
        resolve({ err, fields, files })
      })
    })
    if (data) {
      const { err, fields, files } = data
      if (err) res.status(500).json({ err })
      const {
        values: { s3url, accessKey, secretKey },
        bucket,
        folderPath,
        objectName,
      } = JSON.parse(fields.data)
      const uploadFile = files.files
      const { protocol, hostname, port } = new URL(s3url)
      const useSSL = protocol === 'https:'
      const minioClient = new Minio.Client({
        endPoint: hostname,
        port: parseInt(port) || (useSSL ? 443 : 80),
        useSSL,
        accessKey,
        secretKey,
      })
      const metaData = {
        'Content-Type': uploadFile.mimetype,
      }
      minioClient.fPutObject(
        bucket,
        `${folderPath}/${objectName}`,
        uploadFile.filepath,
        metaData,
        function (err, objInfo) {
          if (err) {
            res.status(500).json({ err })
          }
          minioClient.presignedUrl(
            'GET',
            bucket,
            `${folderPath}/${objectName}`,
            24 * 60 * 60,
            function (err, presignedUrl) {
              if (err) return console.log(err)
              res.status(200).json({
                code: 200,
                data: {
                  url: presignedUrl.split('?')[0],
                  name: `${folderPath}/${objectName}`,
                },
              })
            },
          )
        },
      )
    }
  } else {
    res.status(200).json('use POST method')
  }
}
