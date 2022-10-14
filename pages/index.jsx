import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import { cloneElement, useEffect, useState } from 'react'
import {
  Button,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Checkbox,
  TextField,
  Select,
  MenuItem,
  OutlinedInput,
  InputLabel,
  FormControl,
  ButtonGroup,
} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
// import OutlinedInput from '@mui/material/OutlinedInput'
import { useImmer } from 'use-immer'
function Home(props) {
  const [values, setValues] = useImmer({
    s3url: 'https://s3.amazonaws.com',
    accessKey: '',
    secretKey: '',
  })
  const [errors, setErrors] = useImmer({
    s3url: false,
    accessKey: false,
    secretKey: false,
  })
  const [buckets, setBuckets] = useImmer([])
  const [objects, setObjects] = useImmer([])
  const [currentBuckets, setCurrentBuckets] = useImmer([])
  const [folderPath, setFolderPath] = useImmer({})
  const [disableConnection, setDisableConnection] = useImmer(false)
  const handleConnect = async () => {
    const res = await fetch('/api/listBuckets', {
      method: 'POST',
      body: JSON.stringify(values),
    }).then((res) => res.json())
    if (res.code === 200) {
      setDisableConnection(true)
      setBuckets(res.data.map((i) => i.name))
    }
  }
  const handleUpload = async (files, idx) => {
    Array.from(files).forEach(async (file, i) => {
      const data = new FormData()
      data.append('files', file, {
        type: 'undefined',
      })
      data.append(
        'data',
        JSON.stringify({
          values,
          bucket: currentBuckets[idx],
          folderPath: folderPath[currentBuckets[idx]] || '',
          objectName: file.name,
        }),
      )
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      }).then((res) => res.json())
      if (res.code === 200) {
        setObjects((objects) => [...objects, res.data])
      }
    })
  }
  const handleChange = (label, value) => {
    setValues((values) => {
      values[label] = value
    })
    if (label === 's3url') {
      if (
        new RegExp(
          '^https?://([^:]*(:[^@]*)?@)?([^:]+|\\[[:0-9a-fA-F]+\\])(:\\d+)?/?$|^$',
        ).test(value)
      ) {
        setErrors((errors) => {
          errors[label] = false
        })
      } else {
        setErrors((errors) => {
          errors[label] = true
        })
      }
    } else {
      if (value) {
        setErrors((errors) => {
          errors[label] = false
        })
      } else {
        setErrors((errors) => {
          errors[label] = true
        })
      }
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>memoZ</title>
        <meta name='description' content='Upload files for S3 Storage.' />
        <link rel='shortcut icon' href='/favicon.png' />
      </Head>

      <main className={styles.main}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 30,
          }}>
          <Box
            component='form'
            sx={{
              display: 'flex',
              gap: 2,
            }}
            noValidate
            autoComplete='off'>
            <TextField
              label='S3 URL'
              variant='outlined'
              sx={{ width: '30rem' }}
              value={values['s3url']}
              error={errors['s3url']}
              helperText={errors['s3url'] && 'Please enter a (http/https) URL'}
              onChange={(e) => handleChange('s3url', e.target.value)}
              disabled={disableConnection}
            />
            <TextField
              label='Access Key'
              autoComplete='current-username'
              variant='outlined'
              sx={{ width: '15rem' }}
              value={values['accessKey']}
              error={errors['accessKey']}
              helperText={errors['accessKey'] && ''}
              onChange={(e) => handleChange('accessKey', e.target.value)}
              disabled={disableConnection}
            />
            <TextField
              label='Secret Key'
              type='password'
              autoComplete='current-password'
              variant='outlined'
              sx={{ width: '15rem' }}
              value={values['secretKey']}
              error={errors['secretKey']}
              helperText={errors['secretKey'] && ''}
              onChange={(e) => handleChange('secretKey', e.target.value)}
              disabled={disableConnection}
            />
            <Button
              variant='contained'
              onClick={handleConnect}
              disabled={disableConnection}>
              {disableConnection ? 'connected' : 'connect'}
            </Button>
          </Box>
          <FormControl sx={{ width: '100%' }}>
            <InputLabel>Buckets</InputLabel>
            <Select
              multiple
              value={currentBuckets}
              onChange={(e) => setCurrentBuckets(e.target.value)}
              input={<OutlinedInput label='buckets' />}>
              {buckets.map((bucket) => (
                <MenuItem key={bucket} value={bucket}>
                  {bucket}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {currentBuckets.map((bucket, idx) => (
            <Box
              key={idx}
              component='form'
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
              noValidate
              autoComplete='off'>
              <TextField
                label={`${bucket.toUpperCase()} Upload Folder Path`}
                variant='outlined'
                sx={{ flex: 1 }}
                value={folderPath[bucket]}
                onChange={(e) =>
                  setFolderPath((folderPath) => {
                    folderPath[bucket] = e.target.value || ''
                    return folderPath
                  })
                }
              />
              <Button variant='contained' component='label'>
                Upload
                <input
                  hidden
                  accept='*'
                  multiple
                  type='file'
                  onChange={(e) => handleUpload(e.target.files, idx)}
                />
              </Button>
            </Box>
          ))}

          <List dense={objects.length > 10}>
            {objects.map((obj, idx) => {
              const markdownURL = `![](${obj.url})`
              return (
                <ListItem key={idx} sx={{ padding: 0 }}>
                  <ListItemIcon>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={obj.name}
                    secondary={obj.url}
                    onClick={() => window.open(obj.url)}
                    sx={{
                      ':hover': {
                        cursor: 'pointer',
                        backgroundColor: '#ffff9b',
                        color: '#fd0808',
                      },
                    }}
                  />
                  <ButtonGroup
                    variant='outlined'
                    aria-label='outlined button group'>
                    <Button
                      onClick={() => navigator.clipboard.writeText(obj.url)}>
                      Copy URL
                    </Button>
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(markdownURL)
                      }>
                      Copy Markdown
                    </Button>
                  </ButtonGroup>
                </ListItem>
              )
            })}
          </List>
        </div>
      </main>
    </div>
  )
}

export default Home
