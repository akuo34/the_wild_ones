import Link from 'next/link'
import { useState } from 'react';
import DotLoader from 'react-spinners/DotLoader';
import { useAuth } from '../contexts/auth.js';

const AdminHeader = (props) => {

  const { admin, logout } = useAuth();
  const [showAdminToolBar, setShowAdminToolBar] = useState(false);

  const toolBarHandler = () => {
    showAdminToolBar ? setShowAdminToolBar(false) : setShowAdminToolBar(true)
  }

  return (
    <div>
      <div className="container-admin-header">
        <img className="banner" src={props.banner ? props.banner : null}></img>
        <div className="container-logo-home">
          <div className="logo-home" onClick={props.returnHome}></div>
        </div>
        <div className="container-logo">
          <img className="logo" src="/white_logo.jpg"></img>
        </div>
        <div className="container-h1">
          <h1>the wild ones</h1>
        </div>
        <div className={admin ? "container-icons" : "container-icons hidden"}>
          <img className="button-hamburger" src="/hamburger_light_grey.svg" data-admin="true" onClick={toolBarHandler}></img>
        </div>
      </div>
      <div className="buffer"></div>
      <div className="container-page">
        <div className={showAdminToolBar ? "wrapper-nav-client" : "wrapper-nav-client-hidden"} onClick={toolBarHandler}>
          <div id={showAdminToolBar ? "nav-admin" : "nav-admin-hidden"}>
            <nav>
              <ul style={{ "display": "flex", "flexDirection": "column" }}>
                <li>
                  <Link onClick={toolBarHandler} href="/admin/gallery">
                    <a className="link">gallery</a>
                  </Link>
                </li>
                <li>
                  <Link onClick={toolBarHandler} href="/admin/about">
                    <a className="link">about</a>
                  </Link>
                </li>
                <li>
                  <Link onClick={toolBarHandler} href="/admin/events">
                    <a className="link">events</a>
                  </Link>
                </li>
                <li>
                  <Link onClick={toolBarHandler} href="/admin/murals">
                    <a className="link">murals</a>
                  </Link>
                </li>
                <li>
                  <Link onClick={toolBarHandler} href="/admin/store">
                    <a className="link">store</a>
                  </Link>
                </li>
                <li>
                  <Link onClick={toolBarHandler} href="/admin/contact">
                    <a className="link">contact</a>
                  </Link>
                </li>
                <button style={{ "width": "70px", "fontSize": "15px", "alignSelf": "center", "marginTop": "10px" }} onClick={logout}>log out</button>
              </ul>
            </nav>
          </div>
        </div>
        <div className="container-scroll">
          <h2 className="subheader-client">admin console</h2>
        </div>
        {/* <div className={props.loading ? "container-loader" : "container-loader-hidden"}>
          <DotLoader
            size={75}
            color={"#645D45"}
            loading={props.loading}
          />
        </div> */}
      </div>
    </div>
  )
}

export default AdminHeader;