import Head from 'next/head';
import Slider from 'react-slick';
import model from '../database/model.js';
import { useState } from 'react';

export default function Murals(props) {

  const [showDetails, setShowDetails] = useState(false);

  var settings = {
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    initialSlide: 0
  };

  const mouseEnter = () => {
    setShowDetails(true);
  }

  const mouseLeave = () => {
    setShowDetails(false);
  }

  return (
    <div>
      <Head>
        <title>Murals | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>
      <div className="buffer"></div>
      <div className="container-gallery-page">
        <h2 className="subheader-client">murals</h2>
        {
          props.images.length ?
            <Slider className="slider" {...settings}>
              {props.images.map((image, key) => {
                return (
                  <div key={key} className="container-image-gallery">
                    {
                      image.title || image.description ?
                        <div className={showDetails ? "image-details active" : "image-details hidden"}>
                          <p className="header-details">{image.title}</p>
                          <p style={{ "fontSize": "16px", "lineHeight": "20px" }}>{image.description}</p>
                        </div> : null
                    }
                    <img
                      className="image-gallery"
                      onClick={props.modalHandler}
                      data-url={image.fireBaseUrl}
                      src={image.fireBaseUrl}
                      onMouseEnter={mouseEnter}
                      onMouseLeave={mouseLeave}
                      alt="gallery-image"></img>
                  </div>
                )
              })}
            </Slider> : null
        }
        <div className="container-grid">
          {props.images.map((image, key) => {
            return (
              <div key={key} className="container-image-grid">
                <img
                  className="image-grid"
                  onClick={props.modalHandler}
                  loading="lazy"
                  data-url={image.fireBaseUrl}
                  src={image.fireBaseUrl}
                  alt="gallery-image"></img>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  let response = await model.getMural();

  return {
    props: {
      images: JSON.parse(JSON.stringify(response))
    },
    revalidate: 10
  }
}