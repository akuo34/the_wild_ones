import Head from 'next/head'
import AdminHeader from '../../components/adminHeader.js';
import React, { useState, useEffect } from 'react';
import { storage } from '../../firebase/firebase';
import Axios from 'axios';
import timezones from '../../components/timezones.js';
import moment from 'moment-timezone';

export default function EventsManager(props) {

  const [imageAsFile, setImageAsFile] = useState('');
  const [urlList, setUrlList] = useState([]);
  const [showEdit, setShowEdit] = useState(null);
  const [indexes, setIndexes] = useState({});

  useEffect(() => {
    Axios
      .get('/api/events')
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
      .get('/api/events')
      .then(response => {

        setUrlList(response.data);
        props.setLoading(false);
      })
      .catch(err => console.error(err));
  }

  const handleFireBaseUpload = (e) => {
    e.preventDefault();

    props.setLoading(true);

    const resource = e.target.description.value;
    const title = e.target.title.value;
    const location = e.target.location.value;
    let startDate = e.target.startDate.value;
    const startTime = e.target.startTime.value;
    const endTime = e.target.endTime.value;
    const allDay = false;
    const timezone = e.target.timezone.value;

    if (startDate === '' || startTime === '' || endTime === '') {
      alert('Please complete required fields');
      return;
    }

    let startYear = startDate.substring(0, 4);
    let startMonth = startDate.substring(5, 7);
    let startDay = startDate.substring(8, 10);
    let endYear = startYear;
    let endMonth = startMonth;
    let endDay = startDay;

    let startHours = startTime.substring(0, 2);
    let startMinutes = startTime.substring(3, 5);
    let endHours = endTime.substring(0, 2);
    let endMinutes = endTime.substring(3, 5);

    let timezoneCode = timezones[timezone];
    let a = moment.tz(`${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}`, timezoneCode);
    let b = moment.tz(`${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}`, timezoneCode);
    let startUTC = a.utc().format();
    let endUTC = b.utc().format();

    if (endUTC < startUTC) {
      alert('Event end time must be later than start time');
      return;
    }

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

    const uploadTask = storage.ref(`/events/${filename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('events').child(filename).getDownloadURL()
        .then(fireBaseUrl => {

          let images = [{ fireBaseUrl, filename }];
          const request = { images, resource, title, location, startDate: startUTC, endDate: endUTC, startTime, endTime, allDay, timezone: timezoneCode };

          Axios
            .post('/api/events', request)
            .then(response => {
              getImages();
              setImageAsFile('');
            })
            .catch(err => console.error(err))
        });
    });

    document.getElementById('form-events').reset();
  };

  const editHandler = (e) => {
    e.preventDefault();

    const _id = e.target.dataset.id;
    const title = e.target.title.value;
    const resource = e.target.description.value;
    const location = e.target.location.value;
    let startDate = e.target.startDate.value;
    let startTime = e.target.startTime.value;
    let endTime = e.target.endTime.value;
    const allDay = false;
    const timezone = e.target.timezone.value;

    let startUTC = '';
    let endUTC = '';
    let timezoneCode = '';

    if (startDate !== '' && startTime !== '' && endTime !== '') {
      let startYear = startDate.substring(0, 4);
      let startMonth = startDate.substring(5, 7);
      let startDay = startDate.substring(8, 10);
      let endYear = startYear;
      let endMonth = startMonth;
      let endDay = startDay;
  
      let startHours = startTime.substring(0, 2);
      let startMinutes = startTime.substring(3, 5);
      let endHours = endTime.substring(0, 2);
      let endMinutes = endTime.substring(3, 5);
  
      timezoneCode = timezones[timezone];
      let a = moment.tz(`${startYear}-${startMonth}-${startDay} ${startHours}:${startMinutes}`, timezoneCode);
      let b = moment.tz(`${endYear}-${endMonth}-${endDay} ${endHours}:${endMinutes}`, timezoneCode);
      startUTC = a.utc().format();
      endUTC = b.utc().format();

      if (startUTC > endUTC) {
        alert('Event end time must be later than start time');
        return;
      }
    } else {
      startTime = '';
      endTime = '';
    }

    Axios
      .put(`/api/events/${_id}`, { title, resource, location, startDate: startUTC, endDate: endUTC, startTime, endTime, allDay, timezone: timezoneCode })
      .then(response => {
        getImages();
      })
      .catch(err => console.error(err));

    document.getElementById(_id).reset();
  }

  const deleteHandler = (e) => {
    const _id = e.target.value;
    let event = urlList.filter(item => item._id === _id)[0];

    Axios
      .delete(`/api/events/${_id}`)
      .then(response => {
        getImages();

        let copy = { ...indexes };
        delete copy[_id];
        setIndexes(copy);

        event.images.forEach(image => {
          storage.ref('events').child(image.filename).delete()
            .then(() => console.log('deleted from firebase'))
            .catch(err => console.error(err));
        })

      })
      .catch(err => console.error(err));
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

    const uploadTask = storage.ref(`/events/${filename}`).put(imageAsFile);

    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot)
    }, (err) => {
      console.log(err);
    }, () => {
      console.log('uploaded to firebase')
      storage.ref('events').child(filename).getDownloadURL()
        .then(fireBaseUrl => {

          let photosArray = urlList.filter(item => item._id === _id);
          let newPhoto = { fireBaseUrl, filename };
          photosArray[0].images.push(newPhoto);

          let result = { images: photosArray[0].images }

          let copy = { ...indexes };
          copy[_id] = photosArray[0].images.length - 1;
          setIndexes(copy);

          Axios
            .put(`/api/events/photo/${_id}`, result)
            .then(response => {
              getImages();
              setImageAsFile('');
            })
            .catch(err => console.error(err));
        });
    });

    document.getElementById('form-events-edit-photo').reset();
  };

  const handleDeletePhoto = (e) => {
    const _id = e.target.value;
    let index = indexes[_id];
    let images = urlList.filter(item => item._id === _id)[0].images;
    const filename = images[index].filename;
    images.splice(index, 1);

    Axios
      .put(`/api/events/photo/${_id}`, { images })
      .then(response => {

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

        storage.ref('events').child(filename).delete();
      })
      .catch(err => console.error(err));
  }

  const nextPhoto = (e) => {
    const _id = e.target.dataset.id;
    let copy = Object.assign({}, indexes);
    copy[_id]++;
    setIndexes(copy);
  }

  const previousPhoto = (e) => {
    const _id = e.target.dataset.id;
    let copy = Object.assign({}, indexes);
    copy[_id]--;
    setIndexes(copy);
  }

  const editToggler = (e) => {
    const _id = e.target.value;
    showEdit === _id ? setShowEdit(null) : setShowEdit(_id);
  }

  const convertTime = (time) => {
    let hours = parseInt(time.substring(0, 2));
    let minutes = time.substring(3, 5);

    return hours > 12 ? (hours - 12).toString() + ':' + minutes + ' PM' : hours.toString() + ':' + minutes + ' AM';
  }

  const localizeDate = (utc, timezone) => {
    let date = new Date(utc);
    return date.toLocaleString('env-US', { timeZone: timezone });
  }

  return (
    <div>
      <Head>
        <title>Events Manager | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <AdminHeader
        banner={props.banner}
        returnHome={props.returnHome}
      >
      </AdminHeader>
      <div className="body-gallery">
        <h3>Events</h3>
        <form id="form-events" className="form-gallery" onSubmit={handleFireBaseUpload}>
          <h4 className="text-gallery-form-header">Post new event</h4>
          <input className="input-landing" type="text" name="title" placeholder="Title" />
          <input className="input-landing" type="text" name="location" placeholder="Location" />
          <textarea className="input-description" name="description" placeholder="Description" />
          <div className="form-1-events-row">
            <label className="label-1-date-time">*Date: </label>
            <input className="input-date-time" type="date" name="startDate" placeholder="YYYY-MM-DD" />
          </div>
          <div className="form-1-events-row">
            <label className="label-1-date-time">*Start:</label>
            <input className="input-date-time" type="time" name="startTime" placeholder="HH:MM" />
          </div>
          <div className="form-1-events-row">
            <label className="label-1-date-time">*End:</label>
            <input className="input-date-time" type="time" name="endTime" placeholder="HH:MM" />
          </div>
          <div className="form-1-events-row">
            <label className="label-1-date-time">*Time Zone:</label>
            <select className="input-date-time" style={{ "height": "24.69px", "fontSize": "15px" }} name="timezone">
              <option value="Pacific">Pacific</option>
              <option value="Mountain">Mountain</option>
              <option value="Central">Central</option>
              <option value="Eastern">Eastern</option>
            </select>
          </div>
          <div className="container-gallery-inputs">
            <input
              className="input-gallery-file"
              type="file"
              onChange={handleImageAsFile}
            />
            <button className="button-gallery-post">Upload to Events</button>
          </div>
          <div className="form-1-events-row" style={{ "marginBottom": "0" }}>
            <label className="label-1-date-time" style={{ "width": "100%", "marginTop": "15px" }}>*Required fields</label>
          </div>
        </form>
        {
          urlList.map((item, key) => {
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
                      <form id="form-events-edit-photo" onSubmit={handleAddPhoto} data-id={item._id}>
                        <div style={{ "display": "flex", "marginBottom": "5px" }}>
                          <div style={{ "justifySelf": "flex-start" }}>Add photo</div>
                          <div style={{ "justifySelf": "flex-end", "margin": "0 0 0 auto" }}>{(indexes[item._id] + 1) + '/' + item.images.length}</div>
                        </div>
                        <div style={{ "display": "flex", "flexWrap": "wrap", "justifySelf": "space-between", "width": "100%" }}>
                          <input
                            type="file"
                            onChange={handleImageAsFile}
                            style={{ "marginBottom": "5px" }}
                          />
                        </div>
                        <button type="submit" style={{ "marginBottom": "5px", "alignSelf": "flex-end" }}>Upload Photo</button>
                      </form>
                      {
                        item.images.length !== 0 ?
                          <button onClick={handleDeletePhoto} value={item._id} style={{ "alignSelf": "flex-end" }}>Delete Photo</button> : null
                      }
                    </div> : null
                  }
                </div>
                <div className="container-events-title-description">
                  <p><b>Title:</b> {item.title}</p>
                  <p><b>Location:</b> {item.location}</p>
                  <p><b>Description:</b> {item.resource}</p>
                  <p><b>Start Date:</b> {localizeDate(item.startDate, item.timezone)}</p>
                  <p><b>End Date:</b> {localizeDate(item.endDate, item.timezone)}</p>
                  <p><b>Number of photos:</b> {item.images.length}</p>
                  <div className="container-form-buttons">
                    <button value={item._id} style={{ "marginRight": "5px" }} onClick={editToggler}>Edit</button>
                    <button value={item._id} onClick={deleteHandler} data-filename={item.filename}>Delete</button>
                  </div>
                  {showEdit === item._id ?
                    <form id={item._id} className="form-gallery-edit" onSubmit={editHandler} data-id={item._id}>
                      <input style={{ "marginBottom": "5px", "marginTop": "5px", "fontSize": "14px" }} type="text" name="title" placeholder="Title" />
                      <input style={{ "marginBottom": "5px", "fontSize": "14px" }} type="text" name="location" placeholder="Location" />
                      <textarea name="description" placeholder="Description" style={{ "height": "50px", "marginBottom": "5px", "fontSize": "14px" }}></textarea>
                      <div className="form-2-events-row">
                        <p className="label-2-date-time">Date: </p>
                        <input className="input-date-time" type="date" name="startDate" placeholder="YYYY-MM-DD" />
                      </div>
                      <div className="form-2-events-row">
                        <p className="label-2-date-time">Start Time: </p>
                        <input className="input-date-time" type="time" name="startTime" placeholder="HH:MM" />
                      </div>
                      <div className="form-2-events-row">
                        <p className="label-2-date-time">End Time: </p>
                        <input className="input-date-time" type="time" name="endTime" placeholder="HH:MM" />
                      </div>
                      <div className="form-2-events-row">
                        <p className="label-2-date-time">Time Zone: </p>
                        <select className="input-date-time" name="timezone" style={{ "height": "24.69px", "fontSize": "15px" }}>
                          <option value="Pacific">Pacific</option>
                          <option value="Mountain">Mountain</option>
                          <option value="Central">Central</option>
                          <option value="Eastern">Eastern</option>
                        </select>
                      </div>
                      <div className="container-form-buttons">
                        <button style={{ "marginRight": "5px" }} type="submit">Submit Changes</button>
                      </div>
                    </form> : null
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}