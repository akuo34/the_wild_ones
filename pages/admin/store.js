import Head from 'next/head'
import AdminHeader from '../../components/adminHeader.js';
import React, { useState, useEffect } from 'react';
import { storage } from '../../firebase/firebase';
import Axios from 'axios';

export default function StoreManager(props) {

  const [imageAsFile, setImageAsFile] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [category, setCategory] = useState('Prints');
  const [indexes, setIndexes] = useState({});
  const [showEdit, setShowEdit] = useState(null);

  useEffect(() => {
    Axios
      .get('/api/store')
      .then(response => {

        let copy = { ...indexes };
        response.data.forEach(item => {
          copy[item._id] = 0;
        })

        setIndexes(copy);
        setUrlList(response.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let copy = { ...indexes };
    urlList.forEach(item => {
      if (copy[item._id] === undefined) {
        copy[item._id] = 0;
      }
    });
    setIndexes(copy);
  }, [urlList]);

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile(imageFile => image)
  };

  const getImages = () => {
    Axios
      .get('/api/store')
      .then(response => {

        let array = response.data;
        setUrlList(array);
        props.setLoading(false);
      })
      .catch(err => console.error(err));
  }

  const handleFireBaseUpload = (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const description = e.target.description.value;
    const width = e.target.width.value;
    const height = e.target.height.value;
    const price = e.target.price.value;
    let category = e.target.category.value;
    if (category === "") {
      alert("Please enter a category");
      return;
    }
    const quantity = e.target.quantity.value;

    props.setLoading(true);

    console.log('start of upload');

    if (imageAsFile === '') {
      props.setLoading(false);
      alert('Please select an image to upload');
      console.error(`not an image, the image file is a ${typeof (imageAsFile)}`);
      return;
    };

    let randomizer = (Math.floor(Math.random() * (1000 - 1)) + 1).toString();
    let split = imageAsFile.name.split('.');
    const filename = split[0] + randomizer + '.' + split[1];

    const uploadTask = storage.ref(`/store/${filename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('store').child(filename).getDownloadURL()
        .then(fireBaseUrl => {

          let images = [{ filename, fireBaseUrl }]
          let request = { images, title, description, width, height, price, category, quantity };

          Axios
            .post('/api/store', request)
            .then(response => {
              getImages();
              console.log(response)
              setImageAsFile('');
            })
            .catch(err => console.error(err))
        });
    });

    document.getElementById('form-store').reset();
  };

  const editHandler = (e) => {
    e.preventDefault();

    const _id = e.target.dataset.id;
    const title = e.target.title.value;
    const description = e.target.description.value;
    const width = e.target.width.value;
    const height = e.target.height.value;
    const price = e.target.price.value;
    const category = e.target.category.value;
    const quantity = e.target.quantity.value;

    Axios
      .put(`/api/store/${_id}`, { title, description, width, height, price, category, quantity })
      .then(response => {
        getImages();
        console.log(response)
      })
      .catch(err => console.error(err));

    document.getElementById(_id).reset();
  }

  const deleteHandler = (e) => {
    const _id = e.target.value;

    const itemToDelete = urlList.filter(each => each._id === _id)[0];

    itemToDelete.images.forEach(image => {
      storage.ref('store').child(image.filename).delete()
        .then(() => console.log('deleted from firebase'))
        .catch(err => console.error(err));
    })

    Axios
      .delete(`/api/store/${_id}`)
      .then(response => {
        console.log(response);
        getImages();

      })
      .catch(err => console.error(err));
  }

  const categorySelector = (e) => {
    setCategory(e.target.value);
  }

  const handleAddPhoto = (e) => {
    e.preventDefault();

    props.setLoading(true);

    const _id = e.target.dataset.id;

    console.log('start of upload');

    if (imageAsFile === '') {
      props.setLoading(false);
      alert('Please select an image to upload');
      console.error(`not an image, the image file is a ${typeof (imageAsFile)}`);
      return;
    };

    let randomizer = (Math.floor(Math.random() * (1000 - 1)) + 1).toString();
    let split = imageAsFile.name.split('.');
    const filename = split[0] + randomizer + '.' + split[1];

    const uploadTask = storage.ref(`/store/${filename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('store').child(filename).getDownloadURL()
        .then(fireBaseUrl => {

          let photosArray = urlList.filter(item => item._id === _id);
          let newPhoto = { fireBaseUrl, filename };
          photosArray[0].images.push(newPhoto);

          let result = { images: photosArray[0].images }

          let copy = { ...indexes };
          copy[_id] = photosArray[0].images.length - 1;
          setIndexes(copy);

          Axios
            .put(`/api/store/photo/${_id}`, result)
            .then(response => {
              getImages();
              console.log(response);
              setImageAsFile('');
            })
            .catch(err => console.error(err));
        });
    });

    document.getElementById('form-store-edit-photo').reset();
  };

  const handleDeletePhoto = (e) => {
    const _id = e.target.value;
    let index = indexes[_id];
    let images = urlList.filter(item => item._id === _id)[0].images;
    const filename = images[index].filename;
    images.splice(index, 1);

    Axios
      .put(`/api/store/photo/${_id}`, { images })
      .then(response => {
        console.log(response);

        if (!images[index]) {
          index--;
          let target = {};
          let copy = Object.assign(target, indexes);

          if (index < 0) {
            delete copy[_id];
          } else {
            copy[_id] = index;
          }
          setIndexes(copy)
        }
        getImages();

        storage.ref('store').child(filename).delete();
      })
      .catch(err => console.error(err));
  }

  const nextPhoto = (e) => {
    const _id = e.target.dataset.id;

    let target = {};
    let copy = Object.assign(target, indexes);
    copy[_id]++;
    setIndexes(copy);
  }

  const previousPhoto = (e) => {
    const _id = e.target.dataset.id;

    let target = {};
    let copy = Object.assign(target, indexes);
    copy[_id]--;
    setIndexes(copy);
  }

  const editToggler = (e) => {
    const _id = e.target.value;
    showEdit === _id ? setShowEdit(null) : setShowEdit(_id);
  }

  return (
    <div>
      <Head>
        <title>Store Manager | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <AdminHeader
        banner={props.banner}
        returnHome={props.returnHome}
      >
      </AdminHeader>
      <div className="body-gallery">
        <h3>Store</h3>
        <form id="form-store" className="form-gallery" onSubmit={handleFireBaseUpload}>
          <h4 className="text-gallery-form-header">Create new item</h4>
          <input className="input-landing" type="text" name="title" placeholder="Title" />
          <textarea className="input-description" name="description" placeholder="Description" />
          <div className="container-store-form-row">
            <div className="container-store-form-column">
              <input type="number" name="quantity" min="0" placeholder="Quantity" style={{ "height": "24.69px", "fontSize": "14px", "boxSizing": "border-box" }} />
              <input type="number" name="price" min="0" placeholder="Price" style={{ "height": "24.69px", "fontSize": "14px", "boxSizing": "border-box" }} />
            </div>
            <div className="container-store-form-column">
              <input type="number" name="width" min="0" placeholder="Width (in)" style={{ "height": "24.69px", "fontSize": "14px", "boxSizing": "border-box" }} />
              <input type="number" name="height" min="0" placeholder="Height (in)" style={{ "height": "24.69px", "fontSize": "14px", "boxSizing": "border-box" }} />
            </div>
            <select style={{ "height": "24.69px", "marginBottom": "calc(12px + 0.7vw)", "boxSizing": "border-box" }} name="category">
              <option value="">Select category</option>
              <option value="Prints">Prints</option>
              <option value="Originals">Originals</option>
              <option value="Merchandise">Merchandise</option>
            </select>
          </div>
          <div className="container-gallery-inputs">
            <input
              className="input-gallery-file"
              type="file"
              onChange={handleImageAsFile}
            />
            <button className="button-gallery-post">Upload to Store</button>
          </div>
        </form>
        <div className="container-category-buttons-client">
          <button className="button-category-client" onClick={categorySelector} value="Prints">Prints</button>
          <button className="button-category-client" onClick={categorySelector} value="Originals">Originals</button>
          <button className="button-category-client" onClick={categorySelector} value="Merchandise">Merchandise</button>
        </div>
        <h3 style={{ "marginTop": "0px", "marginBottom": "40px" }}>{category}</h3>
        {
          urlList.map((item, key) => {
            if (item.category === category) {
              return (
                <div key={key} className="container-gallery-row">
                  <div className="container-store-column">
                    <div style={{ "display": "flex", "alignItems": "center", "marginBottom": "40px" }}>
                      <img className={indexes[item._id] > 0 ? "button-carousel" : "button-carousel hidden"} onClick={previousPhoto} data-id={item._id} src={'https://calendar-trips.s3-us-west-1.amazonaws.com/left_button.png'}></img>
                      <div className="container-store-img">
                        <img className="img-store" src={item.images.length === 0 ? "https://calendar-trips.s3-us-west-1.amazonaws.com/unnamed.png" : indexes[item._id] !== undefined ? item.images[indexes[item._id]].fireBaseUrl : item.images[0].fireBaseUrl} alt="gallery img" />
                      </div>
                      <img className={indexes[item._id] < item.images.length - 1 ? "button-carousel" : "button-carousel hidden"} onClick={nextPhoto} data-id={item._id} src={'https://calendar-trips.s3-us-west-1.amazonaws.com/right_button.png'}></img>
                    </div>
                    {showEdit === item._id ?
                      <div style={{ "display": "flex", "flexDirection": "column", "marginBottom": "20px" }}>
                        <form id="form-store-edit-photo" onSubmit={handleAddPhoto} data-id={item._id}>
                          <div style={{ "display": "flex", "marginBottom": "5px" }}>
                            <div style={{ "justifySelf": "flex-start" }}>Add photo</div>
                            <div style={{ "justifySelf": "flex-end", "margin": "0 0 0 auto" }}>{item.images.length ? (indexes[item._id] + 1) + '/' + item.images.length : null}</div>
                          </div>
                          <div style={{ "display": "flex", "flexWrap": "wrap", "justifySelf": "space-between", "width": "100%" }}>
                            <input
                              type="file"
                              onChange={handleImageAsFile}
                              style={{ "marginBottom": "5px" }}
                            />
                          </div>
                          <button style={{ "marginBottom": "5px", "alignSelf": "flex-end" }}>Upload Photo</button>
                        </form>
                        {
                          item.images.length !== 0 ?
                            <button onClick={handleDeletePhoto} value={item._id} style={{ "alignSelf": "flex-end" }}>Delete Photo</button> : null
                        }
                      </div> : null
                    }
                  </div>
                  <div className="container-gallery-title-description">
                    <p><b>Title:</b> {item.title}</p>
                    <p><b>Description:</b> {item.description}</p>
                    <p><b>Quantity:</b> {item.quantity}</p>
                    <p><b>Price:</b> ${item.price} USD</p>
                    <p><b>Size:</b> {item.width && item.height ? item.width + ' x ' + item.height + ' (inches)' : 'N/A'}</p>
                    <p><b>Category:</b> {item.category}</p>
                    <p><b>Number of photos</b> {item.images.length}</p>
                    <div className="container-form-buttons">
                      <button value={item._id} type="submit" style={{ "marginRight": "5px" }} onClick={editToggler}>Edit</button>
                      <button value={item._id} onClick={deleteHandler}>Delete</button>
                    </div>
                    {showEdit === item._id ?
                      <form id={item._id} className="form-gallery-edit" onSubmit={editHandler} data-id={item._id}>
                        <input style={{ "marginBottom": "5px", "marginTop": "5px" }} type="text" name="title" placeholder="Title"></input>
                        <textarea name="description" placeholder="Description" style={{ "height": "50px", "marginBottom": "5px" }}></textarea>
                        <input style={{ "marginBottom": "5px" }} type="number" name="quantity" min="0" placeholder="Quantity" />
                        <input style={{ "marginBottom": "5px" }} type="number" name="price" min="0" placeholder="Price" />
                        <input style={{ "marginBottom": "5px" }} type="number" name="width" min="0" placeholder="Width (in)" />
                        <input style={{ "marginBottom": "5px" }} type="number" name="height" min="0" placeholder="Height (in)" />
                        <select style={{ "marginBottom": "5px" }} name="category">
                          <option value="">Select category</option>
                          <option value="Prints">Prints</option>
                          <option value="Originals">Originals</option>
                          <option value="Merchandise">Merchandise</option>
                        </select>
                        <div className="container-form-buttons">
                          <button type="submit" style={{ "marginRight": "5px" }}>Submit Changes</button>
                        </div>
                      </form> : null
                    }
                  </div>
                </div>
              )
            }
          })
        }
      </div>
    </div>
  )
}