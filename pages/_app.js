import '../styles/globals.css';
import '../styles/horizontal.css';
import '../styles/react-big-calendar.css';
import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { useEffect } from 'react';
import Axios from 'axios';
import { AuthProvider } from '../contexts/auth.js';
import DotLoader from 'react-spinners/DotLoader';
import { isMobile } from 'react-device-detect';

function MyApp({ Component, pageProps }) {

  const [showClientToolBar, setShowClientToolBar] = useState(false);
  const [banner, setBanner] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(null);
  const [animation, setAnimation] = useState('hidden');
  const [cart, setCart] = useState([]);
  const [items, setItems] = useState([]);
  const [stock, setStock] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    // getCart();
    getStore();

    Axios
      .get('/api/about')
      .then(response => setBanner(response.data[0].bannerFireBaseUrl))
      .catch(err => console.error(err));
  }, [])

  useEffect(() => {
    let copy = {};
    items.forEach(item => {
      copy[item._id] = item.quantity;
    })
    setStock(copy);
  }, [items]);

  // const getCart = () => {
  //   Axios
  //     .get('/api/orders')
  //     .then(response => {
  //       setCart(response.data.items);
  //     })
  //     .catch(err => console.error(err));
  // }

  const getStore = () => {
    Axios
      .get('/api/store')
      .then(response => {
        setItems(response.data);
      })
      .catch(err => console.error(err));
  }

  const totalCart = () => {
    let sum = 0;
    cart.forEach(item => {
      sum += item.quantity;
    });
    return sum;
  }

  const toolBarHandler = () => {
    showClientToolBar ? setShowClientToolBar(false) : setShowClientToolBar(true)
  }

  const modalHandler = (e) => {
    const url = e.target.dataset.url;
    const title = e.target.dataset.title;
    const description = e.target.dataset.description;
    setCurrentUrl(url);
    setTitle(title);
    setDescription(description);

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

  const toCheckout = () => {
    Router.push('/checkout');
  }

  const mouseEnter = () => {
    if (!isMobile) {
      setShowDetails(true);
    }
  }

  const mouseLeave = () => {
    setShowDetails(false);
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
          <img className="banner" src={banner} alt="banner" />
          <div className="container-logo-home">
            <div className="logo-home" onClick={returnHome}></div>
          </div>
          <div className="container-logo">
            <img className="logo" src="/white_logo.jpg" alt="logo" />
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
                onClick={toCheckout}
                src={cart && cart.length ? "/shopping_cart_red.svg" : "/shopping_cart_light_grey.svg"}
                alt="cart-icon" />
            </div>
            <img className="button-hamburger" src="/hamburger_light_grey.svg" alt="menu-icon" onClick={toolBarHandler} />
          </div>
        </div>
        <div className={animation === "active" ? "modal-image-zoom zoom-active" : `modal-image-zoom ${animation}`} onClick={modalHandler}>
        </div>
        <div
          className={`container-modal-image ${animation}`}
          onClick={modalHandler}>
          {
            title || description ?
              <div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} className={showDetails ? "modal-details active" : "modal-details hidden"}>
                <p className="header-details">{title}</p>
                <p className="paragraph-details">{description}</p>
              </div> : null
          }
          {
            currentUrl !== null ?
              <img
                className={`modal-image ${animation}`}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                src={currentUrl}
                alt="modal-image"
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
