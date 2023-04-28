import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

const Layout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title ? title + ' - Amazonas' : 'Amazonas'}</title>
        <meta name='description' content='Ecommerce desarrollado en NextJS' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex flex-col justify-between min-h-screen'>
        <header className='flex justify-between items-center shadow-md px-4 h-12'>
          <Link href='/' className='font-bold text-lg'>
            Amazonas
          </Link>
          <div>
            <Link href='/cart' className='p-2'>
              Cart
            </Link>
            <Link href='/login' className='p-2'>
              Login
            </Link>
          </div>
        </header>
        <main className='container mt-4 px-4 m-auto'>{children}</main>
        <footer className='flex justify-center items-center h-10 shadow-inner'>
          Amazonas &copy; 2023. Todos los derechos reservados
        </footer>
      </div>
    </>
  );
};

export default Layout;
