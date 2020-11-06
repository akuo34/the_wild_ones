import Head from 'next/head'
import AdminHeader from '../../components/adminHeader.js';

export default function EventsManager(props) {
  return (
    <div>
      <Head>
        <title>Events Manager | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <AdminHeader 
        banner={props.banner} 
        returnHome={props.returnHome}
        >
      </AdminHeader>
    </div>
  )
}