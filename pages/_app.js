import '../styles/globals.css';
import '../styles/horizontal.css';
import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect } from 'react';
import Axios from 'axios';
import { AuthProvider } from '../contexts/auth.js';
import DotLoader from 'react-spinners/DotLoader';

function MyApp({ Component, pageProps }) {

  const [showClientToolBar, setShowClientToolBar] = useState(false);
  const [banner, setBanner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [animation, setAnimation] = useState('hidden');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // getCart();
    // getStore();

    Axios
      .get('/api/about')
      .then(response => setBanner(response.data[0].bannerFireBaseUrl))
      .catch(err => console.error(err));
  }, [])

  const toolBarHandler = () => {
    showClientToolBar ? setShowClientToolBar(false) : setShowClientToolBar(true)
  }

  const modalHandler = (e) => {
    const url = e.target.dataset.url;
    setCurrentUrl(url);

    if (showModal) {
      setShowModal(false);
      setAnimation('fadeout');
      setAnimation('hidden');
      setCurrentUrl(null);
      document.body.style.overflow = "auto";
    } else {
      setShowModal(true);
      setAnimation('active');
      document.body.style.overflow = "hidden";
    }
  }

  const returnHome = () => {
    Router.push('/');
  }

  return (
    <div>
      <div className="container-client-header">
        <div className={showClientToolBar ? "wrapper-nav-client" : "wrapper-nav-client-hidden"} onClick={toolBarHandler}>
          <div id={showClientToolBar ? "nav-client" : "nav-client-hidden"}>
            <ul>
              <li>
                <Link onClick={toolBarHandler} href="/">
                  <a className="link">gallery</a>
                </Link>
              </li>
              <li>
                <Link onClick={toolBarHandler} href="/about">
                  <a className="link">about</a>
                </Link>
              </li>
              <li>
                <Link onClick={toolBarHandler} href="/events">
                  <a className="link">events</a>
                </Link>
              </li>
              <li>
                <Link onClick={toolBarHandler} href="/murals">
                  <a className="link">murals</a>
                </Link>
              </li>
              <li>
                <Link onClick={toolBarHandler} href="/store">
                  <a className="link">store</a>
                </Link>
              </li>
              <li>
                <Link onClick={toolBarHandler} href="/contact">
                  <a className="link">contact</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="container-main-header">
          <img className="banner" src={banner}></img>
          <div className="container-logo-home">
            <div className="logo-home" onClick={returnHome}></div>
          </div>
          <div className="container-logo">
            <img className="logo" src="/white_logo.jpg"></img>
          </div>
          <div className='container-h1'>
            <h1>the wild ones</h1>
          </div>
          <div className="container-icons">
            <div style={{ "display": "flex" }}>
              {/* {
                cart && totalCart() > 0 ?
                  <span style={{ "alignSelf": "flexStart", "marginRight": "5px", "color": "rgb(204,0,0)", "fontSize": "calc(12px + 0.2vw)", "fontFamily": "typewriter" }}>{totalCart()}</span> : null
              } */}
              <img
                className="button-cart"
                // onClick={toCheckout}
                src={cart && cart.length ? "/shopping_cart_red.svg" : "/shopping_cart_light_grey.svg"}></img>
            </div>
            <img className="button-hamburger" src="/hamburger_light_grey.svg" onClick={toolBarHandler}></img>
          </div>
        </div>
        <div className={animation === "active" ? "modal-image-zoom zoom-active" : `modal-image-zoom ${animation}`} onClick={modalHandler}>
        </div>
        <div
          className={`container-modal-image ${animation}`}
          onClick={modalHandler}>
          {currentUrl !== null ?
            <img
              className={`modal-image ${animation}`}
              src={currentUrl}
            /> : null
          }
        </div>
        <div className={loading ? "container-loader" : "container-loader-hidden"}>
          <DotLoader
            size={75}
            color={"#645D45"}
            loading={loading}
          />
        </div>
      </div>
      <AuthProvider>
        <Component {...pageProps}
          banner={banner}
          returnHome={returnHome}
          setLoading={setLoading}
          modalHandler={modalHandler}
        />
      </AuthProvider>
    </div>
  )
}

export default MyApp
