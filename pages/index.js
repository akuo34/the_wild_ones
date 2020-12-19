import Head from 'next/head';
import model from '../database/model.js';
import { useState, useEffect } from 'react';
import Slider from 'react-slick';

export default function Home(props) {

  const [showDetails, setShowDetails] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [mobileOnly, setMobileOnly] = useState(true);
  const [mobile, setMobile] = useState(false);

  var settings = {
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    initialSlide: 0,
  };

  const mouseEnter = (title, description) => {
    if ((title && title !== " ") || (description && description !== " ") && !mobile) {
      setShowDetails(true);
      setTitle(title);
      setDescription(description);
    }
  }

  const mouseLeave = () => {
    setShowDetails(false);
  }

  useEffect(() => {
    const { isMobile, isMobileOnly } = require('react-device-detect');
    setMobileOnly(isMobileOnly);
    setMobile(isMobile);
  }, [])

  return (
    <div>
      <Head>
        <title>Gallery | The Wild Ones</title>
        <meta name="Description" content="Candy yu-yen kuo is a visual artist based out of Austin, Texas. Born in Taipei and raised in South Texas, she often blends references to these cultural roots into her work. With a background in fashion and illustration, her portraits often portray female characters set against nature with all her creatures. Her color palettes are bright and colorful, explosive like the fiery women she tries to capture in her worlds." />
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
        <div>
          {
            !mobileOnly && props.images.length ?
              <Slider className="slider" {...settings}>
                {
                  props.images.map((image, key) => {
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
        </div>
        <div className="container-grid">
          {props.images.map((image, key) => {
            return (
              <div key={key} className="container-image-grid" style={{ "display": "flex", "flexDirection": "column" }}>
                <img
                  className="image-grid"
                  onClick={props.modalHandler}
                  data-url={image.fireBaseUrl}
                  data-title={image.title}
                  data-description={image.description}
                  src={image.smallFireBaseUrl}
                  alt="gallery-grid-image" />
                <i style={{ "textAlign": "center", "marginTop": "10px", "marginBottom": "20px", "height": "30px", "color": "rgb(100, 93, 69)", "fontSize": "12px" }}>{mobile ? image.title : null} {mobile && image.title && image.description && image.title !== ' ' && image.description !== ' ' ? '-' : null} {mobile ? image.description : null}</i>
              </div>
            )
          })}
        </div>
        <img src="/positivessl_trust_seal_md_167x42.png" alt="SSL_seal" style={{ "marginBottom": "20px" }}></img>
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