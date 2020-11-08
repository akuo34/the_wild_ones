import Head from 'next/head';
import Router from 'next/router';
import { useEffect } from 'react';

export default function Admin() {

  useEffect(() => {
    Router.push('/admin/login');
  }, []);

  return (
    <div>
      <Head>
        <title>Admin Console | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
    </div>
  )
}