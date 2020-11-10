import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import Slider from 'react-slick';
// import $ from 'jquery';

export default function Home(props) {

  const [images, setImages] = useState([]);

  useEffect(() => {
    getImages();
  }, []);

  // $('body').on('contextmenu', 'img', (e) => {
  //   return false;
  // })

  const getImages = () => {
    Axios
      .get('/api/gallery')
      .then(response => {
        setImages(response.data);
      })
      .catch(err => console.error(err));
  }

  var settings = {
    arrows: true,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    initialSlide: 0,
  };

  return (
    <div>
      <Head>
        <title>Gallery | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>
      <div>
        <div className="buffer"></div>
        <div className="container-gallery-page">
          <h2 className="subheader-client">art by candy kuo</h2>
          {
            images.length ?
              <Slider className="slider" {...settings}>
                {images.map((image, key) => {
                  return (
                    <div key={key} className="container-image-gallery">
                      <img
                        className="image-gallery"
                        onClick={props.modalHandler}
                        data-url={image.fireBaseUrl}
                        src={image.fireBaseUrl}
                        alt="gallery-image"></img>
                    </div>
                  )
                })}
              </Slider> : null
          }
          <div className="container-grid">
            {images.map((image, key) => {
              return (
                <div key={key} className="container-image-grid">
                  <img
                    className="image-grid"
                    onClick={props.modalHandler}
                    data-url={image.fireBaseUrl}
                    loading="lazy"
                    src={image.fireBaseUrl}
                    alt="gallery-image"></img>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
