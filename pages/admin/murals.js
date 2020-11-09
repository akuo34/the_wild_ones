import Head from 'next/head'
import AdminHeader from '../../components/adminHeader.js';
import React, { useState, useEffect } from 'react';
import { storage } from '../../firebase/firebase';
import Axios from 'axios';

export default function MuralsManager(props) {

  const [imageAsFile, setImageAsFile] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [showEdit, setShowEdit] = useState(null);

  useEffect(() => {
    Axios
      .get('/api/murals')
      .then(response => {

        setUrlList(response.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(imageFile => image)
  };

  const getImages = () => {
    Axios
      .get('/api/murals')
      .then(response => {

        let array = response.data;

        setUrlList(array);
        props.setLoading(false);
      })
      .catch(err => console.error(err));
  }

  const handleFireBaseUpload = (e) => {
    e.preventDefault();

    props.setLoading(true);

    const description = e.target.description.value;
    const title = e.target.title.value;

    console.log('start of upload');

    if (imageAsFile === '') {
      console.error(`not an image, the image file is a ${typeof (imageAsFile)}`);
      props.setLoading(false);
      alert('Please select an image to upload');
      return;
    };

    let randomizer = (Math.floor(Math.random() * (1000 - 1)) + 1).toString();
    let split = imageAsFile.name.split('.');
    const filename = split[0] + randomizer + '.' + split[1];

    const uploadTask = storage.ref(`/murals/${filename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('murals').child(filename).getDownloadURL()
        .then(fireBaseUrl => {

          let date = new Date()
          date = date.toDateString();
          let index = urlList.length;

          const request = { fireBaseUrl, description, title, date, filename, index };

          Axios
            .post('/api/murals', request)
            .then(response => {
              getImages();
              setImageAsFile('');
            })
            .catch(err => console.error(err))
        });
    });

    document.getElementById('form-murals').reset();
  };

  const editHandler = (e) => {
    e.preventDefault();

    const _id = e.target.dataset.id;
    const title = e.target.title.value;
    const description = e.target.description.value;

    Axios
      .put(`/api/murals/${_id}`, { title, description, index: '' })
      .then(response => {
        getImages();
      })
      .catch(err => console.error(err));

    document.getElementById(_id).reset();
  }

  const handleChangeMural = (e) => {
    e.preventDefault();

    props.setLoading(true);

    const _id = e.target.dataset.id;
    let filename = e.target.dataset.filename;

    console.log('start of upload');

    if (imageAsFile === '') {
      console.error(`not an image, the image file is a ${typeof (imageAsFile)}`);
      props.setLoading(false);
      alert('Please select an image to upload');
      return;
    };

    let randomizer = (Math.floor(Math.random() * (1000 - 1)) + 1).toString();
    let split = imageAsFile.name.split('.');
    const newfilename = split[0] + randomizer + '.' + split[1];

    const uploadTask = storage.ref(`/murals/${newfilename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('murals').child(newfilename).getDownloadURL()
        .then(fireBaseUrl => {

          storage.ref('murals').child(filename).delete()
            .then(() => console.log('deleted from firebase'))
            .catch(err => console.error(err));

          filename = newfilename;

          const request = { fireBaseUrl, filename };
          Axios
            .put(`/api/murals/photo/${_id}`, request)
            .then(response => {
              getImages();
              setImageAsFile('');
            })
            .catch(err => console.error(err))

        });
    });

    document.getElementById('form-edit-mural').reset();
  };

  const deleteHandler = (e) => {
    const _id = e.target.value;
    const filename = e.target.dataset.filename;
    const index = parseInt(e.target.dataset.index);

    Axios
      .delete(`/api/murals/${_id}`)
      .then(response => {
        getImages();

        storage.ref('murals').child(filename).delete()
          .then(() => console.log('deleted from firebase'))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));

    for (let i = index + 1; i < urlList.length; i++) {
      let _id = urlList[i]._id;
      let newIndex = i - 1;
      let request = { title: '', description: '', index: newIndex };

      Axios
        .put(`/api/murals/${_id}`, request)
        .then(response => console.log(response))
        .catch(err => console.error(err));
    }
  }

  const editToggler = (e) => {
    const _id = e.target.value;
    showEdit === _id ? setShowEdit(null) : setShowEdit(_id);
  }

  const moveUpHandler = (e) => {
    const originalIndex = parseInt(e.target.dataset.index);
    const _id = e.target.dataset.id;

    if (originalIndex > 0) {
      let index = originalIndex - 1;
      let swapperId = urlList[index]._id;

      Axios
        .put(`/api/murals/${_id}`, { index, title: '', description: '' })
        .then(response => {

          Axios
            .put(`/api/murals/${swapperId}`, { index: originalIndex, title: '', description: '' })
            .then(response => {
              getImages();
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    }
  }

  const moveDownHandler = (e) => {
    const originalIndex = parseInt(e.target.dataset.index);
    const _id = e.target.dataset.id;

    if (originalIndex < urlList.length - 1) {
      let index = originalIndex + 1;
      let swapperId = urlList[index]._id;

      Axios
        .put(`/api/murals/${_id}`, { index, title: '', description: '' })
        .then(response => {

          Axios
            .put(`/api/murals/${swapperId}`, { index: originalIndex, title: '', description: '' })
            .then(response => {
              getImages();
            })
            .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    }
  }

  return (
    <div>
      <Head>
        <title>Murals Manager | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <AdminHeader
        banner={props.banner}
        returnHome={props.returnHome}
      >
      </AdminHeader>
      <div className="body-gallery">
        <h3>Murals</h3>
        <form id="form-murals" className="form-gallery" onSubmit={handleFireBaseUpload}>
          <h4 className="text-gallery-form-header">Upload new photo</h4>
          <input className="input-landing" type="text" name="title" placeholder="Title" />
          <textarea className="input-description" name="description" placeholder="Description" />
          <div className="container-gallery-inputs">
            <input
              className="input-gallery-file"
              type="file"
              onChange={handleImageAsFile}
            />
            <button className="button-gallery-post">Upload to Murals</button>
          </div>
        </form>
        {
          urlList.map(item => {
            return (
              <div className="container-gallery-row">
                <div className="container-gallery-img">
                  <img
                    className="img-gallery"
                    loading="lazy"
                    src={item.fireBaseUrl}
                    alt="gallery img" />
                </div>
                <div className="wrapper-arrows-form">
                  <div className="container-up-down">
                    <img className="arrow-up"
                      onClick={moveUpHandler}
                      data-id={item._id}
                      data-index={item.index}
                      src="https://calendar-trips.s3-us-west-1.amazonaws.com/up_arrow.png"
                      alt="up arrow" />
                    <img className="arrow-down"
                      onClick={moveDownHandler}
                      data-id={item._id}
                      data-index={item.index}
                      src="https://calendar-trips.s3-us-west-1.amazonaws.com/down_arrow.png"
                      alt="down arrow" />
                  </div>
                  <div className="container-gallery-title-description">
                    <p><b>Title:</b> {item.title}</p>
                    <p><b>Description:</b> {item.description}</p>
                    <p><b>Date uploaded:</b> {item.date}</p>
                    <div className="container-form-buttons">
                      <button value={item._id} type="submit" onClick={editToggler} style={{ "marginRight": "5px" }}>Edit</button>
                      <button value={item._id} onClick={deleteHandler} data-filename={item.filename} data-index={item.index}>Delete</button>
                    </div>
                    {showEdit === item._id ?
                      <div>
                        <form id="form-edit-mural" onSubmit={handleChangeMural} data-id={item._id} data-filename={item.filename}>
                          <div style={{ "marginBottom": "5px", "marginTop": "20px" }}>Change photo</div>
                          <div style={{ "marginBottom": "20px" }}>
                            <input
                              type="file"
                              onChange={handleImageAsFile}
                              style={{ "marginBottom": "5px" }}
                            />
                            <button>Upload photo</button>
                          </div>
                        </form>
                        <form id={item._id} className="form-gallery-edit" onSubmit={editHandler} data-id={item._id}>
                          <input type="text" name="title" placeholder="Title" style={{ "marginBottom": "5px", "marginTop": "5px", "fontSize": "14px" }}></input>
                          <textarea name="description" placeholder="Description" style={{ "height": "50px", "marginBottom": "5px", "fontSize": "14px" }}></textarea>
                          <div className="container-form-buttons">
                            <button type="submit">Submit Changes</button>
                          </div>
                        </form>
                      </div> : null
                    }
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}