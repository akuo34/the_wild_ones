import Head from 'next/head';
import React, { useState } from 'react';
import Router from 'next/router';
import model from '../database/model.js';

export default function Store(props) {

  const [category, setCategory] = useState('Prints');

  const categoryHandler = (e) => {
    let category = e.target.dataset.category;
    setCategory(category);
  }

  // const addCartHandler = (e) => {
  //   e.preventDefault();

  //   const available = selectedItem.quantity;
  //   const quantity = e.target.quantity.value;
  //   const id = selectedItem._id;
  //   const fireBaseUrl = selectedItem.images[0].fireBaseUrl;
  //   const title = selectedItem.title;
  //   const price = selectedItem.price;
  //   const width = selectedItem.width;
  //   const height = selectedItem.height;
  //   const category = selectedItem.category;

  //   let cartCopy = props.cart.slice();
  //   let inCart = false;

  //   cartCopy.forEach(item => {
  //     if (item.itemId === id) {
  //       inCart = true;
  //       if (item.quantity + parseInt(quantity) > available) {
  //         alert('order exceeds inventory')
  //         item.quantity = available;
  //       } else {
  //         item.quantity += parseInt(quantity);
  //       }
  //     }
  //   })

  //   if (!inCart) {
  //     cartCopy.push({ itemId: id, fireBaseUrl, title, price, quantity, width, height, category });
  //   }

  //   Axios
  //     .put('/admin/api/orders', { items: cartCopy })
  //     .then(() => {
  //       props.getCart();
  //     })

  //   document.getElementById('form-add-cart').reset()
  // }
  const toProductDetails = (e) => {
    let _id = e.target.dataset.id;
    Router.push(`/store/${_id}`);
  }

  return (
    <div>
      <Head>
        <title>Store | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <div className="buffer"></div>
      <div className="container-gallery-page">
        <div className="container-category-buttons-client">
          <button className="button-category-client" onClick={categoryHandler} data-category="Prints">Prints</button>
          <button className="button-category-client" onClick={categoryHandler} data-category="Originals">Originals</button>
          <button className="button-category-client" onClick={categoryHandler} data-category="Merchandise">Merchandise</button>
        </div>
        <h2 className="subheader-client-store">{category.toLowerCase()}</h2>
        <div className="container-grid">
          {
            props.items.map((item, key) => {
              if (item.category === category) {
                return (
                  <div key={key} style={{ "marginBottom": "60px" }}>
                    <div className="container-item-store-client">
                      <div className="container-image-store-client">
                        <img
                          className="image-store-client"
                          onClick={toProductDetails}
                          data-id={item._id}
                          src={item.images[0].fireBaseUrl}
                          alt="store-img" />
                      </div>
                      <div className="container-title-price-client">
                        <h3
                          className="header-store-title-client"
                          onClick={toProductDetails}
                          data-id={item._id}
                          style={{ "textAlign": "right" }}>{item.title}</h3>
                        <span className="price">${item.price}</span>
                      </div>
                    </div>
                  </div>
                )
              }
            })
          }
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  let response = await model.getStore();

  return {
    props: {
      items: JSON.parse(JSON.stringify(response))
    },
    revalidate: 10
  }
}