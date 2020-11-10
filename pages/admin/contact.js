import Head from 'next/head'
import AdminHeader from '../../components/adminHeader.js';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useAuth } from '../../contexts/auth.js';
import DotLoader from 'react-spinners/DotLoader';

export default function ContactManager(props) {

  const [urlList, setUrlList] = useState([]);
  const [allowUpload, setAllowUpload] = useState(false);
  const { admin } = useAuth();

  useEffect(() => {
    getContact();
  }, []);

  const getContact = () => {
    Axios
      .get('/api/contact')
      .then(response => {

        let array = response.data;
        if (!array.length) {
          setAllowUpload(true);
        } else {
          setAllowUpload(false);
        }

        setUrlList(array);
      })
      .catch(err => console.error(err));
  }

  const uploadContact = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const instagram = e.target.instagram.value;

    const request = { name, email, phone, instagram };

    Axios
      .post('/api/contact', request)
      .then(response => {
        getContact();
        setAllowUpload(false);
        console.log(response);
      })
      .catch(err => console.error(err));

    document.getElementById('form-contact').reset();
  };

  const editHandler = (e) => {
    e.preventDefault();

    const _id = e.target.dataset.id;
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const instagram = e.target.instagram.value;

    const request = { name, email, phone, instagram };

    Axios
      .put(`/api/contact/${_id}`, request)
      .then(response => {
        getContact();
        console.log(response)
      })
      .catch(err => console.error(err));

    document.getElementById(_id).reset();
  }

  const deleteHandler = (e) => {
    const _id = e.target.value;

    Axios
      .delete(`/api/contact/${_id}`)
      .then(response => {
        console.log(response)
        getContact();
        setAllowUpload(true);
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <Head>
        <title>Contact Manager | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <AdminHeader
        banner={props.banner}
        returnHome={props.returnHome}
      >
      </AdminHeader>
      { !admin ?
        <div className="container-loader">
          <DotLoader
            size={75}
            color={"#645D45"}
            loading={true}
          />
        </div> :
        <div className="body-gallery">
          <h3>Contact</h3>
          {allowUpload ?
            <form id="form-contact" className="form-gallery" onSubmit={uploadContact}>
              <h4 className="text-gallery-form-header">Create your contact</h4>
              <input className="input-landing" type="text" name="name" placeholder="Name" />
              <input className="input-landing" type="email" name="email" placeholder="Email" />
              <input className="input-landing" type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="Phone XXX-XXX-XXXX" />
              <input className="input-landing" type="url" name="instagram" placeholder="Instagram link" />
              <button className="button-gallery-post" type="submit">Upload to Contact</button>
            </form> : null
          }
          {
            urlList.map(item => {
              return (
                <div className="container-contact-row">
                  <div style={{ "width": "min(400px, 90vw)" }}>
                    <p style={{ "lineHeight": "22px" }}><b>Name:</b> {item.name}</p>
                    <p style={{ "lineHeight": "22px" }}><b>Email:</b> {item.email}</p>
                    <p style={{ "lineHeight": "22px" }}><b>Phone:</b> {item.phone}</p>
                    <p style={{ "lineHeight": "22px" }}><b>Instagram:</b> {item.instagram}</p>
                  </div>
                  <form id={item._id}
                    style={{ "width": "min(400px, 90vw)", "display": "flex", "flexDirection": "column" }}
                    onSubmit={editHandler}
                    data-id={item._id}>
                    <input style={{ "marginBottom": "5px" }} type="text" name="name" placeholder="Name" />
                    <input style={{ "marginBottom": "5px" }} type="email" name="email" placeholder="Email" />
                    <input style={{ "marginBottom": "5px" }} type="tel" name="phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" placeholder="Phone XXX-XXX-XXXX" />
                    <input style={{ "marginBottom": "5px" }} type="url" name="instagram" placeholder="Instagram link" />
                    <div className="container-form-buttons">
                      <button type="submit" style={{ "marginRight": "5px" }}>Edit</button>
                      <button value={item._id} onClick={deleteHandler}>Delete</button>
                    </div>
                  </form>
                </div>
              )
            })
          }
        </div>
      }
    </div>
  )
}