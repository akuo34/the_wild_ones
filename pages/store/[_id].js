import Head from 'next/head';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Slider from 'react-slick';

export default function ProductDetails() {

  const [product, setProduct] = useState(null);
  const [animation, setAnimation] = useState('hidden');
  const [modalItem, setModalItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState(null);

  useEffect(() => {
    let _id = window.location.pathname.split('/').pop();
    setId(_id);

    Axios
      .get(`/api/store/${_id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(err => console.error(err));
  }, []);

  const modalHandler = () => {
    setModalItem(product);

    if (showModal) {
      setShowModal(false);
      setAnimation('fadeout');
      setAnimation('hidden');
      setModalItem(null);
      document.body.style.overflow = "auto";
    } else {
      setShowModal(true);
      setAnimation('active');
      document.body.style.overflow = "hidden";
    }
  }

  var settings = {
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    initialSlide: 0,
  };

  return (
    <div>
      <Head>
        <title>Product Details | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>
      <div className="buffer"></div>
      <div className={animation === "active" ? "modal-image-zoom zoom-active" : `modal-image-zoom ${animation}`} onClick={modalHandler}>
      </div>
      <div
        className={`container-modal-image ${animation}`}>
        {modalItem !== null ?
          <Slider className="slider-store" {...settings}>
            {modalItem.images.map(image => {
              return (
                <div
                  className="container-image-slider-store"
                  onClick={modalHandler}>
                  <Image
                    className="image-slider-store"
                    onClick={modalHandler}
                    src={image.fireBaseUrl}
                    alt="product-details-modal-image"
                    layout="fill" />
                </div>
              )
            })}
          </Slider> : null
        }
      </div>
      { product ?
        <div className="container-gallery-page">
          <h2 className="subheader-client">{product.title.toLowerCase()}</h2>
          <div className="container-image-about">
            <img
              className="image-store-item"
              data-id={id}
              onClick={modalHandler}
              src={product.images[0].fireBaseUrl}
              alt="product-details-image" />
            <div style={{ "margin": "0 10px" }}>
              <p className="container-bio">{product.description}</p>
              {product.width && product.height ? <p className="container-bio" style={{ "marginBottom": "10px" }}>{product.width} &#10005; {product.height} (inches)</p> : null}
              <p className="container-bio" style={{ "marginBottom": "15px", "fontSize": "25px", "textAlign": "right" }}>${product.price}</p>
              <p className="container-bio" style={{ "marginBottom": "10px", "textAlign": "right" }}>{product.quantity} left in stock.</p>
              <div className="container-bio" style={{ "display": "flex", "justifyContent": "flexEnd" }}>
                <form id="form-add-cart"
                  style={{ "marginLeft": "auto" }}
                // onSubmit={addCartHandler}
                >
                  <label style={{ "fontFamily": "typewriter" }}>Quantity: </label>
                  <input type="number" min="1" name="quantity" max={product.quantity} required style={{ "width": "40px", "fontSize": "16px" }}></input>
                  <button
                    className="button-add-cart-client"
                    style={{ "marginLeft": "10px" }}
                  >Add to cart</button>
                </form>
              </div>
            </div>
          </div>
        </div> : null
      }
    </div>
  )
}