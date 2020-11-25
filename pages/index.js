import Head from 'next/head';
import Slider from 'react-slick';
import model from '../database/model.js';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';

export default function Home(props) {

  const [showDetails, setShowDetails] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);

  var settings = {
    arrows: true,
    lazyLoad: "progressive",
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    initialSlide: 0,
  };

  const mouseEnter = (title, description) => {
    if (title || description && !isMobile) {
      setShowDetails(true);
      setTitle(title);
      setDescription(description);
    }
  }

  const mouseLeave = () => {
    setShowDetails(false);
  }

  return (
    <div>
      <Head>
        <title>Gallery | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
      </Head>
      <div className="buffer"></div>
      <div className="container-gallery-page">
        <h2 className="subheader-client">art by candy kuo</h2>
        <div onMouseEnter={() => mouseEnter(title, description)} onMouseLeave={mouseLeave} className={showDetails ? "image-details active" : "image-details hidden"}>
          <p className="header-details">{title}</p>
          <p className="paragraph-details">{description}</p>
        </div>
        {
          props.images.length ?
            <Slider className="slider" {...settings}>
              {props.images.map((image, key) => {
                return (
                  <div key={key} className="container-image-gallery">
                    <img
                      className="image-gallery"
                      onClick={props.modalHandler}
                      data-url={image.fireBaseUrl}
                      data-title={image.title}
                      data-description={image.description}
                      src={image.fireBaseUrl}
                      onMouseEnter={() => mouseEnter(image.title, image.description)}
                      onMouseLeave={mouseLeave}
                      alt="gallery-carousel-image" />
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
                  data-url={image.fireBaseUrl}
                  data-title={image.title}
                  data-description={image.description}
                  src={image.smallFireBaseUrl}
                  alt="gallery-grid-image" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  let response = await model.getGallery();

  return {
    props: {
      images: JSON.parse(JSON.stringify(response))
    },
    revalidate: 10
  }
}