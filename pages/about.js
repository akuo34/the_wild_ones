import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';

export default function About() {

  const [images, setImages] = useState([]);

  useEffect(() => {
    getImages();
  }, []);

  const getImages = () => {
    Axios
      .get('/api/about')
      .then(response => {
        setImages(response.data);
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <Head>
        <title>About the Artist | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <div className="buffer"></div>
      <div className="container-gallery-page">
        <h2 className="subheader-client">about the artist</h2>
        {images.length ?
          <div className="container-image-about">
            <img className="image-about" src={images[0].portraitFireBaseUrl} alt="about-image"></img>
            <p className="container-bio">{images[0].bio}</p>
          </div> : null
        }
      </div>
    </div>
  )
}