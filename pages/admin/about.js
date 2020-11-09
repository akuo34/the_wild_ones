import Head from 'next/head'
import AdminHeader from '../../components/adminHeader.js';
import React, { useState, useEffect } from 'react';
import { storage } from '../../firebase/firebase.js';
import Axios from 'axios';

export default function AboutManager(props) {

  const [imageAsFile, setImageAsFile] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [allowUpload, setAllowUpload] = useState(false);

  useEffect(() => {
    Axios
      .get('/api/about')
      .then(response => {

        if (!response.data.length) {
          setAllowUpload(true);
        }
        setUrlList(response.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(imageFile => image)
  };

  const getBio = () => {
    Axios
      .get('/api/about')
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

    const bio = e.target.bio.value;

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

    const uploadTask = storage.ref(`/about/${filename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('about').child(filename).getDownloadURL()
        .then(portraitFireBaseUrl => {

          let portraitFilename = filename;
          let bannerFireBaseUrl = '';
          let bannerFilename = '';

          const request = { portraitFireBaseUrl, bio, portraitFilename, bannerFireBaseUrl, bannerFilename };

          Axios
            .post('/api/about', request)
            .then(response => {
              getBio();
              setAllowUpload(false);
              setImageAsFile('');
            })
            .catch(err => console.error(err))
        });
    });

    document.getElementById('form-about').reset();
  };

  const handleChangePortrait = (e) => {
    e.preventDefault();

    props.setLoading(true);

    const _id = e.target.dataset.id;
    let portraitFilename = e.target.dataset.filename;

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

    const uploadTask = storage.ref(`/about/${filename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('about').child(filename).getDownloadURL()
        .then(portraitFireBaseUrl => {

          storage.ref('about').child(portraitFilename).delete()
            .then(() => console.log('deleted from firebase'))
            .catch(err => console.error(err));

          const request = { portraitFireBaseUrl, portraitFilename: filename };
          Axios
            .put(`/api/about/portrait/${_id}`, request)
            .then(response => {
              getBio();
              setImageAsFile('');
            })
            .catch(err => console.error(err))

        });
    });

    document.getElementById('form-edit-portrait').reset();
  };

  const handleChangeBanner = (e) => {
    e.preventDefault();

    props.setLoading(true);

    const _id = e.target.dataset.id;
    let oldBannerFilename = e.target.dataset.filename;

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

    const uploadTask = storage.ref(`/about/${filename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('about').child(filename).getDownloadURL()
        .then(bannerFireBaseUrl => {

          if (oldBannerFilename) {
            storage.ref('about').child(oldBannerFilename).delete()
              .then(() => console.log('deleted from firebase'))
              .catch(err => console.error(err));
          }

          const request = { bannerFireBaseUrl, bannerFilename: filename };

          Axios
            .put(`/api/about/banner/${_id}`, request)
            .then(response => {
              getBio();
              props.setLoading(false);
              window.location.reload();
              setImageAsFile('');
            })
            .catch(err => console.error(err))
        });
    });

    document.getElementById('form-edit-banner').reset();
  };

  const editHandler = (e) => {
    e.preventDefault();

    const _id = e.target.dataset.id;
    const bio = e.target.bio.value;

    Axios
      .put(`/api/about/${_id}`, { bio })
      .then(response => {
        getBio();
      })
      .catch(err => console.error(err));

    document.getElementById(_id).reset();
  }

  const deleteHandler = (e) => {
    const _id = e.target.value;
    const portraitFilename = e.target.dataset.portraitfilename;
    const bannerFilename = e.target.dataset.bannerfilename;

    Axios
      .delete(`/api/about/${_id}`)
      .then(response => {
        getBio();
        window.location.reload();

        storage.ref('about').child(portraitFilename).delete()
          .then(() => console.log('deleted from firebase'))
          .catch(err => console.error(err));

        storage.ref('about').child(bannerFilename).delete()
          .then(() => console.log('deleted from firebase'))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }

  return (
    <div>
      <Head>
        <title>About Manager | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <AdminHeader
        banner={props.banner}
        returnHome={props.returnHome}
      >
      </AdminHeader>
      <div className="body-gallery">
        <h3>About</h3>
        {
          allowUpload ?
            <form id="form-about" className="form-gallery" onSubmit={handleFireBaseUpload}>
              <h4 className="text-gallery-form-header">Create your bio</h4>
              <textarea className="input-landing" name="bio" placeholder="About me" style={{ "height": "90px", "fontSize": "14px" }} />
              <div className="container-gallery-inputs">
                <input
                  className="input-gallery-file"
                  type="file"
                  onChange={handleImageAsFile}
                />
                <button className="button-gallery-post">Upload to About</button>
              </div>
            </form> : null
        }
        {
          urlList.map((item, key) => {
            return (
              <div key={key} className="container-about-render">
                <div className="container-gallery-row">
                  <div className="container-gallery-img">
                    <img className="img-gallery" src={item.portraitFireBaseUrl} alt="gallery img" />
                  </div>
                  <div className="container-gallery-title-description">
                    <form id="form-edit-portrait" onSubmit={handleChangePortrait} data-id={item._id} data-filename={item.portraitFilename}>
                      <div style={{ "marginBottom": "5px" }}>Change portrait</div>
                      <div style={{ "marginBottom": "20px" }}>
                        <input
                          type="file"
                          onChange={handleImageAsFile}
                          style={{ "marginBottom": "5px" }}
                        />
                        <button>Upload portrait</button>
                      </div>
                    </form>
                    <form id="form-edit-banner" onSubmit={handleChangeBanner} data-id={item._id} data-filename={item.bannerFilename}>
                      <div style={{ "marginBottom": "5px" }}>Change banner</div>
                      <div style={{ "marginBottom": "20px" }}>
                        <input
                          type="file"
                          onChange={handleImageAsFile}
                          style={{ "marginBottom": "5px" }}
                        />
                        <button>Upload banner</button>
                      </div>
                    </form>
                    <form id={item._id} className="form-gallery-edit" onSubmit={editHandler} data-id={item._id}>
                      <textarea name="bio" placeholder="Bio" style={{ "height": "80px", "marginBottom": "5px" }}></textarea>
                      <div className="container-form-buttons">
                        <button type="submit" style={{ "marginRight": "5px" }}>Edit</button>
                        <button value={item._id} onClick={deleteHandler} data-bannerfilename={item.bannerFilename} data-portraitfilename={item.portraitFilename}>Delete</button>
                      </div>
                    </form>
                  </div>
                </div>
                <p style={{ "width": "min(1000px, 90vw)", "marginBottom": "40px", "lineHeight": "28px" }}><b>Bio:</b> {item.bio}</p>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}