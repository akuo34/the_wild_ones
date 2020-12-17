import Head from 'next/head'
import AdminHeader from '../../components/adminHeader.js';
import React, { useState, useEffect } from 'react';
import { storage } from '../../firebase/firebase';
import Axios from 'axios';
import { useAuth } from '../../contexts/auth.js';
import DotLoader from 'react-spinners/DotLoader';
import Resizer from 'react-image-file-resizer';

export default function MuralsManager(props) {

  const [imageAsFile, setImageAsFile] = useState('');
  const [smallImageAsFile, setSmallImageAsFile] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [showEdit, setShowEdit] = useState(null);
  const { admin } = useAuth();

  useEffect(() => {
    Axios
      .get('/api/murals')
      .then(response => {
        setUrlList(response.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleImageAsFile = async (e) => {
    const image = e.target.files[0];
    const smallImage = await resizeFile(image);
    setImageAsFile(image)
    setSmallImageAsFile(smallImage);
  };

  const getImages = () => {
    Axios
      .get('/api/murals')
      .then(response => {
        setUrlList(response.data);
        props.setLoading(false);
      })
      .catch(err => console.error(err));
  }

  const resizeFile = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 300, 350, 'JPEG', 100, 0,
    // Resizer.imageFileResizer(file, 250, 150, 'JPEG', 100, 0,
      uri => {
        resolve(uri);
      },
      'blob'
    );
  });

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

    const randomizer = (Math.floor(Math.random() * (1000 - 1)) + 1).toString();
    const split = imageAsFile.name.split('.');
    const filename = split[0] + randomizer + '.' + split[1];
    const smallFilename = 'small-' + filename;
    const index = urlList.length;
    let date = new Date()
    date = date.toDateString();

    const uploadTask = storage.ref(`/murals/${filename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('murals').child(filename).getDownloadURL()
        .then(fireBaseUrl => {

          const uploadTask2 = storage.ref(`/murals/${smallFilename}`).put(smallImageAsFile);

          uploadTask2.on('state_changed', (snapshot) => {
            console.log(snapshot)
          }, (err) => {
            console.log(err);
          }, () => {
            console.log('uploaded to firebase')
            storage.ref('murals').child(smallFilename).getDownloadURL()
              .then(smallFireBaseUrl => {
      
                const request = { fireBaseUrl, description, title, date, filename, index, smallFireBaseUrl, smallFilename };
      
                Axios
                  .post('/api/murals', request)
                  .then(response => {
                    getImages();
                    setImageAsFile('');
                    setSmallImageAsFile('');
                  })
                  .catch(err => console.error(err))
              });
          });
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
    const filename = e.target.dataset.filename;
    const smallFilename = e.target.dataset.smallfilename;

    console.log('start of upload');

    if (imageAsFile === '') {
      console.error(`not an image, the image file is a ${typeof (imageAsFile)}`);
      props.setLoading(false);
      alert('Please select an image to upload');
      return;
    };

    const randomizer = (Math.floor(Math.random() * (1000 - 1)) + 1).toString();
    const split = imageAsFile.name.split('.');
    const filenameNew = split[0] + randomizer + '.' + split[1];
    const smallFilenameNew = 'small-' + filenameNew;

    const uploadTask = storage.ref(`/murals/${filenameNew}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('murals').child(filenameNew).getDownloadURL()
        .then(fireBaseUrl => {

          const uploadTask2 = storage.ref(`/murals/${smallFilenameNew}`).put(smallImageAsFile);

          uploadTask2.on('state_changed', (snapshot) => {
            console.log(snapshot)
          }, (err) => {
            console.log(err);
          }, () => {
            console.log('uploaded to firebase')
            storage.ref('murals').child(smallFilenameNew).getDownloadURL()
              .then(smallFireBaseUrl => {
      
                storage.ref('murals').child(filename).delete()
                  .then(() => console.log('deleted from firebase'))
                  .catch(err => console.error(err));

                storage.ref('murals').child(smallFilename).delete()
                  .then(() => console.log('deleted from firebase'))
                  .catch(err => console.error(err));
      
                const request = { fireBaseUrl, filename: filenameNew, smallFireBaseUrl, smallFilename: smallFilenameNew };
                Axios
                  .put(`/api/murals/photo/${_id}`, request)
                  .then(response => {
                    getImages();
                    setImageAsFile('');
                    setSmallImageAsFile('');
                  })
                  .catch(err => console.error(err))
      
              });
          });
        });
    });

    document.getElementById('form-edit-mural').reset();
  };

  const deleteHandler = (e) => {
    const _id = e.target.value;
    const filename = e.target.dataset.filename;
    const smallFilename = e.target.dataset.smallfilename;
    const index = parseInt(e.target.dataset.index);

    Axios
      .delete(`/api/murals/${_id}`)
      .then(response => {
        getImages();

        storage.ref('murals').child(filename).delete()
          .then(() => console.log('deleted from firebase'))
          .catch(err => console.error(err));

        storage.ref('murals').child(smallFilename).delete()
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

      let element = document.getElementById('image' + swapperId);
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

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

      let element = document.getElementById('image' + swapperId);
      element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });

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
      { !admin ?
        <div className="container-loader">
          <DotLoader
            size={75}
            color={"#645D45"}
            loading={true}
          />
        </div> :
        <div className="body-gallery">
          <h3>Murals</h3>
          <form id="form-murals" className="form-gallery" onSubmit={handleFireBaseUpload}>
            <h4 className="text-gallery-form-header">Upload new photo</h4>
            <input className="input-landing" type="text" name="title" placeholder="Title" />
            <textarea className="input-description" maxLength="475" name="description" placeholder="Description" />
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
            urlList.map((item, key) => {
              return (
                <div key={key} className="container-gallery-row">
                  <div className="container-gallery-img">
                    <img
                      className="img-gallery"
                      src={item.smallFireBaseUrl}
                      alt="gallery img" />
                  </div>
                  <div className="wrapper-arrows-form">
                    <div id={'image' + item._id} className="container-up-down">
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
                        <button value={item._id} onClick={deleteHandler} data-filename={item.filename} data-smallfilename={item.smallFilename} data-index={item.index}>Delete</button>
                      </div>
                      {showEdit === item._id ?
                        <div>
                          <form id="form-edit-mural" onSubmit={handleChangeMural} data-id={item._id} data-filename={item.filename} data-smallfilename={item.smallFilename}>
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
                            <textarea name="description" maxLength="475" placeholder="Description" style={{ "height": "50px", "marginBottom": "5px", "fontSize": "14px" }}></textarea>
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
      }
    </div>
  )
}