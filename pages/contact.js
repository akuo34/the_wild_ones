import Head from 'next/head'
import Image from 'next/image';
import model from '../database/model.js';
import Axios from 'axios';
import { useState } from 'react';

export default function Contact(props) {

  const [response, setResponse] = useState(null);
  const [animation, setAnimation] = useState('hidden');

  const submitForm = (e) => {
    e.preventDefault();

    let name = e.target.name.value;
    let email = e.target.email.value;
    let subject = e.target.subject.value;
    let message = e.target.message.value;

    Axios
      .post('/api/contact/email', { name, email, subject, message })
      .then(response => {
        setResponse(response.data);
        setAnimation('active');
        setTimeout(() => {
          setAnimation('hidden');

          setTimeout(() => {
            setResponse(null);
          }, 500)
        }, 2000);
      })
      .catch(err => setResponse(response.data));

    document.getElementById('form-contact-client').reset();
  }

  return (
    <div>
      <Head>
        <title>Contact | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <div className="buffer"></div>
      <div className="container-gallery-page">
        <h2 className="subheader-client">contact</h2>
        <div style={{ "display": "flex", "flexWrap": "wrap", "width": "100%", "justifyContent": "space-between" }}>
          {
            props.contacts.length ?
            <div className="column" style={{ "margin": "0 auto", "maxWidth": "90vw" }}>
              {
                props.contacts[0].phone ?
                  <div className="row-contact">
                    <a href={`tel:+1-${props.contacts[0].phone}`}>
                      <Image style={{ "height": "calc(25px + 1.75vw)", "marginRight": "calc(10px + 1vw)" }} src="/phone_icon.svg" alt="phone-icon" />
                    </a>
                    <h3 style={{ "margin": "auto 0" }}>
                      <a style={{ "textDecoration": "none", "color": "inherit" }} href={`tel:+1-${props.contacts[0].phone}`}>
                        {props.contacts[0].phone}
                      </a>
                    </h3>
                  </div> : null
              }
              {
                props.contacts[0].email ?
                  <div className="row-contact">
                    <a href={`mailto:${props.contacts[0].email}`}>
                      <Image style={{ "height": "calc(25px + 1.75vw)", "marginRight": "calc(10px + 1vw)" }} src="/email_icon.svg" alt="email-icon"></Image>
                    </a>
                    <h3 style={{ "margin": "auto 0" }}>
                      <a style={{ "textDecoration": "none", "color": "inherit" }} href={`mailto:${props.contacts[0].email}`}>
                        {props.contacts[0].email}
                      </a>
                    </h3>
                  </div> : null
              }
              {
                props.contacts[0].instagram ?
                  <div className="row-contact">
                    <a style={{ "textDecoration": "none", "color": "inherit" }} href={props.contacts[0].instagram}>
                      <Image style={{ "height": "calc(25px + 1.75vw)", "opacity": "75%", "marginRight": "calc(10px + 1vw)" }} src="/instagram.svg" alt="instagram-icon"></Image>
                    </a>
                    <h3 style={{ "margin": "auto 0" }}>
                      <a style={{ "textDecoration": "none", "color": "inherit" }} href={props.contacts[0].instagram}>
                        {'@' + props.contacts[0].instagram.split('instagram.com/').pop()}
                      </a>
                    </h3>
                  </div> : null
              }
            </div> : null
          }
          <div style={{ "margin": "0 auto", "display": "flex", "flexDirection": "column" }}>
            <form id="form-contact-client" className="form-gallery" style={{ "margin": "0 auto" }} onSubmit={submitForm}>
              <h4 className="text-gallery-form-header">Send an email</h4>
              <input required className="input-landing" name="name" placeholder="Name"></input>
              <input required className="input-landing" name="email" type="email" placeholder="Email"></input>
              <input required className="input-landing" name="subject" placeholder="Subject"></input>
              <textarea required className="input-description" name="message" placeholder="Your message"></textarea>
              <button className="button-gallery-post" type="submit">Send message</button>
            </form>
            <p className={`response-email ${animation}`}>{response}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  let response = await model.getContact();

  return {
    props: {
      contacts: JSON.parse(JSON.stringify(response))
    },
    revalidate: 10
  }
}