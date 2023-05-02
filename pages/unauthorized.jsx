import Layout from '@/components/Layout'
import { useRouter } from 'next/router'
import React from 'react'

const UnauthorizedScreen = () => {
    const router = useRouter()
    const {message} = router.query;
  return (
    <Layout title='Acceso no autorizado'>
        <h1 className='font-bold text-3xl'>Acceso no autorizado</h1>
        {message && <div className='mb-4 text-red-500'>{message}</div>}
    </Layout>
  )
}

export default UnauthorizedScreen