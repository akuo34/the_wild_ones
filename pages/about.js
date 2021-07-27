import Head from 'next/head';
import model from '../database/model.js';

export default function About(props) {

  return (
    <div>
      <Head>
        <title>About the Artist | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <div className="buffer"></div>
      <div className="container-gallery-page">
        <h2 className="subheader-client">about the artist</h2>
        {props.images.length ?
          <div className="container-image-about">
            <img className="image-about" src={props.images[0].portraitFireBaseUrl} alt="about-image" />
            <p className="container-bio">{props.images[0].bio}</p>
          </div> : null
        }
        <h2 className="subheader-client">CV</h2>
        {props.images.length &&
          <iframe className="embed-cv" height="300px" width="200px" src={`${props.images[0].cvFireBaseUrl}`}></iframe>
        }
      </div>
    </div>
  )
}

export async function getStaticProps() {
  let response = await model.getAbout();
  
  return {
    props: {
      images: JSON.parse(JSON.stringify(response))
    },
    revalidate: 10
  }
}