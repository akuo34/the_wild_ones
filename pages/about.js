import Head from 'next/head';
import Image from 'next/image';
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
            <Image className="image-about" src={props.images[0].portraitFireBaseUrl} alt="about-image"></Image>
            <p className="container-bio">{props.images[0].bio}</p>
          </div> : null
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