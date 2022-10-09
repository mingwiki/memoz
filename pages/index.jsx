import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import useSWR from 'swr'
export default function Home() {
  const fetcher = (url) => fetch(url).then((res) => res.text())
  const { data, error } = useSWR('/api/test', fetcher)

  //Handle the error state
  if (error) return <div>Failed to load</div>
  //Handle the loading state
  if (!data) return <div>Loading...</div>
  return (
    <div className={styles.container}>
      <Head>
        <title>memoZ</title>
        <meta name='description' content='Upload files for S3 Storage.' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>{data}</main>
    </div>
  )
}
