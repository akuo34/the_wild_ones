import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import model from '../database/model.js';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer

export default function Events(props) {

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({});
  const [pastEvents, setPastEvents] = useState([]);
  const [indexes, setIndexes] = useState({});

  useEffect(() => {
    let today = new Date();
    let index = 0;
    let copy = { ...indexes };

    let events = [];

    props.events.forEach(item => {
      copy[item._id] = 0;

      let start = new Date(item.startDate);
      let end = new Date(item.endDate);
      if (end < today) {
        index++;
      }
      // localize the UTC and push into events array
      let localizedStart = moment(start).tz(item.timezone);
      let localizedEnd = moment(end).tz(item.timezone);
      item.startDate = localizedStart;
      item.endDate = localizedEnd;
      events.push(item);
    })
    setIndexes(copy);
    setUpcomingEvents(events.slice(index));

    let reversedPast = events.slice(0, index).reverse();
    setPastEvents(reversedPast);
  }, []);

  const convertDate = (ISOdate) => {
    let date = new Date(ISOdate);
    let result = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    return result;
  }

  const convertTime = (time) => {
    let hours = parseInt(time.substring(0, 2));
    let minutes = time.substring(3, 5);

    return hours > 12 ? (hours - 12).toString() + ':' + minutes + ' PM' : hours.toString() + ':' + minutes + ' AM';
  }

  const selectEventHandler = (e) => {
    setCurrentEvent(e);
  }

  const nextPhoto = (e) => {
    const _id = e.target.dataset.id;
    let copy = Object.assign({}, indexes);
    copy[_id]++;

    // let type = e.target.dataset.type === "special" ? "special" : "event";

    // document.getElementById(`${type}-${_id}`).className = 'image-events fadeout';
    // setTimeout(() => {
      setIndexes(copy);
    // }, 230)
    // setTimeout(() => {
      // document.getElementById(`${type}-${_id}`).className = 'image-events';
    // }, 700)
  }

  const previousPhoto = (e) => {
    const _id = e.target.dataset.id;
    let copy = Object.assign({}, indexes);
    copy[_id]--;

    // let type = e.target.dataset.type === "special" ? "special" : "event";

    // document.getElementById(`${type}-${_id}`).className = 'image-events fadeout';
    // setTimeout(() => {
      setIndexes(copy);
    // }, 230)
    // setTimeout(() => {
      // document.getElementById(`${type}-${_id}`).className = 'image-events';
    // }, 700)
  }

  return (
    <div>
      <Head>
        <title>Events | The Wild Ones</title>
        <link rel="icon" href="/white_logo.jpg" />
      </Head>
      <div className="buffer"></div>
      <div className="container-gallery-page">
        <h2 className="subheader-client">events</h2>
        <div className="container-calendar">
          <Calendar
            onSelectEvent={selectEventHandler}
            localizer={localizer}
            events={upcomingEvents}
            views={['month', 'agenda']}
            startAccessor="startDate"
            endAccessor="endDate"
          />
          {Object.keys(currentEvent).length ?
            <div className="container-image-events">
              <h3 style={{ "marginTop": "0", "marginRight": "auto", "marginLeft": "auto", "marginBottom": "calc(10px + 2vw)", "maxWidth": "60vw", "textAlign": "center" }}>Selected Event: {currentEvent.title}</h3>
              {
                currentEvent.images.length ?
                  <div className="wrapper-image-buttons-events" style={{ "marginTop": "0", "marginRight": "auto", "marginLeft": "auto", "marginBottom": "calc(10px + 2vw)" }}>
                    <div style={{ "display": "flex", "justifyContent": "center", "alignItems": "center", "width": "100%", "marginBottom": "20px" }}>
                      <img
                        className={indexes[currentEvent._id] > 0 ? "button-carousel" : "button-carousel hidden"}
                        onClick={previousPhoto}
                        data-id={currentEvent._id}
                        data-type="special"
                        src={'/black_left_arrow.svg'}
                        alt="left-button" />
                      <div style={{ "width": "90%", "textAlign": "center", "overflow": "hidden", "display": "flex", "justifyContent": "center" }}>
                        <img
                          id={`special-${currentEvent._id}`}
                          className="image-events"
                          onClick={props.modalHandler}
                          data-url={currentEvent.images[indexes[currentEvent._id]].fireBaseUrl}
                          src={currentEvent.images[indexes[currentEvent._id]].smallFireBaseUrl}
                          alt="events-image" />
                      </div>
                      <img
                        className={indexes[currentEvent._id] < currentEvent.images.length - 1 ? "button-carousel" : "button-carousel hidden"}
                        onClick={nextPhoto}
                        data-id={currentEvent._id}
                        data-type="special"
                        src={'/black_right_arrow.svg'}
                        alt="right-button" />
                    </div>
                  </div> : null
              }
              <div className="container-client-events pink">
                {/* <div className="container-client-events pink" style={{ "marginTop": "20px" }}> */}
                <p style={{ "marginBottom": "20px" }}>{currentEvent.resource}</p>
                <p style={{ "marginBottom": "20px" }}>Where: {currentEvent.location}</p>
                <p>When: {convertDate(currentEvent.startDate)} from {convertTime(currentEvent.startTime)} to {convertTime(currentEvent.endTime)}</p>
              </div>
            </div>
            : upcomingEvents.length ?
              <div className="container-image-events">
                <h3 style={{ "marginTop": "0", "marginRight": "auto", "marginLeft": "auto", "marginBottom": "calc(10px + 2vw)", "maxWidth": "60vw", "textAlign": "center" }}>Next Event: {upcomingEvents[0].title}</h3>
                {
                  upcomingEvents[0].images.length ?
                    <div className="wrapper-image-buttons-events" style={{ "marginTop": "0", "marginRight": "auto", "marginLeft": "auto", "marginBottom": "calc(10px + 2vw)" }}>
                      <div style={{ "display": "flex", "justifyContent": "center", "alignItems": "center", "width": "100%", "marginBottom": "20px" }}>
                        <img
                          className={indexes[upcomingEvents[0]._id] > 0 ? "button-carousel" : "button-carousel hidden"}
                          onClick={previousPhoto}
                          data-id={upcomingEvents[0]._id}
                          data-type="special"
                          src={'/black_left_arrow.svg'}
                          alt="left-button" />
                        <div style={{ "width": "90%", "textAlign": "center", "overflow": "hidden", "display": "flex", "justifyContent": "center" }}>
                          <img
                            id={`special-${upcomingEvents[0]._id}`}
                            className="image-events"
                            onClick={props.modalHandler}
                            data-url={upcomingEvents[0].images[indexes[upcomingEvents[0]._id]].fireBaseUrl}
                            src={upcomingEvents[0].images[indexes[upcomingEvents[0]._id]].smallFireBaseUrl}
                            alt="events-image" />
                        </div>
                        <img
                          className={indexes[upcomingEvents[0]._id] < upcomingEvents[0].images.length - 1 ? "button-carousel" : "button-carousel hidden"}
                          onClick={nextPhoto}
                          data-id={upcomingEvents[0]._id}
                          data-type="special"
                          src={'/black_right_arrow.svg'}
                          alt="right-button" />
                      </div>
                    </div> : null
                }
                <div className="container-client-events pink">
                  <p style={{ "marginBottom": "20px" }}>{upcomingEvents[0].resource}</p>
                  <p style={{ "marginBottom": "20px" }}>Where: {upcomingEvents[0].location}</p>
                  <p>When: {convertDate(upcomingEvents[0].startDate)} from {convertTime(upcomingEvents[0].startTime)} to {convertTime(upcomingEvents[0].endTime)}</p>
                </div>
              </div> : 
              <div className="container-client-events" style={{ "border": "none", "boxShadow": "none", "textAlign": "center" }}>
                <h3>No upcoming events</h3>
              </div>
          }
        </div>
        {upcomingEvents.length ?
          // <h3 className="subheader-client" style={{ "marginBottom": "40px" }}>Upcoming Events</h3>
          <div className="pink column" style={{ "width": "100vw", "alignItems": "center" }}>
            <div style={{ "width": "90vw", "margin": "0 auto" }}>
              <h3 className="subheader-client" style={{ "margin-left": "auto", "margin-right": "auto", "textAlign": "center" }}>Upcoming Events</h3>
              {upcomingEvents.map((image, index) => {
                return (
                  <div className="container-calendar pink" key={index}>
                    {
                      image.images.length ?
                        <div className="wrapper-image-buttons-events">
                          <div style={{ "display": "flex", "justifyContent": "center", "width": "100%", "alignItems": "center", "marginBottom": "40px" }}>
                            <img
                              className={indexes[image._id] > 0 ? "button-carousel" : "button-carousel hidden"}
                              onClick={previousPhoto}
                              data-id={image._id}
                              src={'/black_left_arrow.svg'}
                              alt="left-button" />
                            <div style={{ "width": "90%", "textAlign": "center", "overflow": "hidden", "display": "flex", "justifyContent": "center" }}>
                              <img
                                id={`event-${image._id}`}
                                className="image-events"
                                onClick={props.modalHandler}
                                data-url={image.images[indexes[image._id]].fireBaseUrl}
                                src={image.images[indexes[image._id]].smallFireBaseUrl}
                                alt="events-image" />
                            </div>
                            <img
                              className={indexes[image._id] < image.images.length - 1 ? "button-carousel" : "button-carousel hidden"}
                              onClick={nextPhoto}
                              data-id={image._id}
                              src={'/black_right_arrow.svg'}
                              alt="right-button" />
                          </div>
                        </div> : null
                    }
                    <div className="container-client-events">
                      <h4 style={{ "marginBottom": "20px" }}>{image.title}</h4>
                      <p style={{ "marginBottom": "20px" }}>{image.resource}</p>
                      <p style={{ "marginBottom": "20px" }}>Where: {image.location}</p>
                      <p>When: {convertDate(image.startDate)} from {convertTime(image.startTime)} to {convertTime(image.endTime)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          : null
        }
        {pastEvents.length ?
          <h3 className="subheader-client">Past Events</h3>
          : null
        }
        {pastEvents.map((image, index) => {
          return (
            <div className="container-calendar" key={index}>
              {
                image.images.length ?
                  <div className="wrapper-image-buttons-events">
                    <div style={{ "display": "flex", "justifyContent": "center", "alignItems": "center", "marginBottom": "40px", "width": "100%" }}>
                      <img
                        className={indexes[image._id] > 0 ? "button-carousel" : "button-carousel hidden"}
                        onClick={previousPhoto}
                        data-id={image._id}
                        src={'/black_left_arrow.svg'}
                        alt="left-button" />
                      <div style={{ "width": "90%", "textAlign": "center", "overflow": "hidden", "display": "flex", "justifyContent": "center" }}>
                        <img
                          id={`event-${image._id}`}
                          className="image-events"
                          onClick={props.modalHandler}
                          data-url={image.images[indexes[image._id]].fireBaseUrl}
                          src={image.images[indexes[image._id]].smallFireBaseUrl}
                          alt="events-image" />
                      </div>
                      <img
                        className={indexes[image._id] < image.images.length - 1 ? "button-carousel" : "button-carousel hidden"}
                        onClick={nextPhoto}
                        data-id={image._id}
                        src={'/black_right_arrow.svg'}
                        alt="right-button" />
                    </div>
                  </div> : null
              }
              <div className="container-client-events pink">
                <h4 style={{ "marginBottom": "20px" }}>{image.title}</h4>
                <p style={{ "marginBottom": "20px" }}>{image.resource}</p>
                <p style={{ "marginBottom": "20px" }}>Where: {image.location}</p>
                <p>When: {convertDate(image.startDate)} from {convertTime(image.startTime)} to {convertTime(image.endTime)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  let response = await model.getEvent();

  return {
    props: {
      events: JSON.parse(JSON.stringify(response))
    },
    revalidate: 10
  }
}