const { galleryItem, muralItem, aboutItem, eventItem, storeItem, contactItem, orderItem, mailingListItem } = require('./');

module.exports = {
  getGallery: () => galleryItem.find().sort([['index', 1]]),
  postGallery: (title, description, fireBaseUrl, date, filename, index) => galleryItem.create({ title, description, fireBaseUrl, date, filename, index }),
  putGallery: (title, description, _id, index) => {
    let object = { title, description, index };
    for (let key in object) {
      if (object[key] === '') {
        delete object[key];
      }
    }   
    return galleryItem.findOneAndUpdate({ _id }, object)
  },
  putGalleryPhoto: (fireBaseUrl, filename, _id) => galleryItem.findOneAndUpdate({ _id }, { fireBaseUrl, filename }),
  deleteGallery: (_id) => galleryItem.findByIdAndDelete({ _id }),
  getMural: () => muralItem.find().sort([['index', 1]]),
  postMural: (title, description, fireBaseUrl, date, filename, index) => muralItem.create({ title, description, fireBaseUrl, date, filename, index }),
  putMural: (title, description, _id, index) => {
    let object = { title, description, index };
    for (let key in object) {
      if (object[key] === '') {
        delete object[key];
      }
    }
    return muralItem.findOneAndUpdate({ _id }, object)
  },
  putMuralPhoto: (fireBaseUrl, filename, _id) => muralItem.findOneAndUpdate({ _id }, { fireBaseUrl, filename }),
  deleteMural: (_id) => muralItem.findByIdAndDelete({ _id }),
  getAbout: () => aboutItem.find(),
  postAbout: (portraitFireBaseUrl, bio, portraitFilename, bannerFireBaseUrl, bannerFilename) => aboutItem.create({ portraitFireBaseUrl, bio, portraitFilename, bannerFireBaseUrl, bannerFilename }),
  putAbout: (bio, _id) => aboutItem.findOneAndUpdate({ _id }, { bio }),
  putAboutPortrait: (portraitFireBaseUrl, portraitFilename, _id) => aboutItem.findOneAndUpdate({ _id }, { portraitFireBaseUrl, portraitFilename }),
  putAboutBanner: (bannerFireBaseUrl, bannerFilename, _id) => aboutItem.findOneAndUpdate({ _id }, { bannerFireBaseUrl, bannerFilename }),
  deleteAbout: (_id) => aboutItem.findOneAndDelete({ _id }),
  getEvent: () => eventItem.find().sort([['startDate', 1]]),
  postEvent: (images, title, resource, location, startDate, endDate, startTime, endTime, allDay) => eventItem.create({ images, title, resource, location, startDate, endDate, startTime, endTime, allDay }),
  putEvent: (title, resource, location, startDate, endDate, startTime, endTime, allDay, _id) => {

    let object = { title, resource, location, startDate, endDate, startTime, endTime, allDay };
    for (let key in object) {
      if (!object[key]) {
        delete object[key];
      }
    }
    return eventItem.findOneAndUpdate({ _id }, object);
  },
  putEventPhoto: (images, _id) => eventItem.findOneAndUpdate({ _id }, { images }),
  deleteEvent: (_id) => eventItem.findOneAndDelete({ _id }),
  getStore: () => storeItem.find(),
  postStore: (images, title, description, width, height, price, category, quantity) => storeItem.create({ images, title, description, width, height, price, category, quantity }),
  putStore: (title, description, width, height, price, category, quantity, _id) => {

    let object = { title, description, width, height, price, category, quantity };
    for (let key in object) {
      if (!object[key]) {
        delete object[key];
      }
    }
    return storeItem.findByIdAndUpdate({ _id }, object);
  },
  putStorePhoto: (images, _id) => storeItem.findByIdAndUpdate({ _id }, { images }),
  deleteStore: (_id) => storeItem.findByIdAndDelete({ _id }),
  getOrder: (sessionId) => orderItem.findOne({ sessionId }),
  postOrder: (sessionId, items) => orderItem.create({ sessionId, items }),
  putOrder: (sessionId, items) => orderItem.findOneAndUpdate({ sessionId }, { items }),
  deleteOrder: (sessionId) => orderItem.findOneAndDelete({ sessionId }),
  getContact: () => contactItem.find(),
  postContact: (name, email, phone, instagram) => contactItem.create({ name, email, phone, instagram }),
  putContact: (name, email, phone, instagram, _id) => {

    let object = { name, email, phone, instagram };
    for (let key in object) {
      if(!object[key]) {
        delete object[key];
      }
    }
    return contactItem.findByIdAndUpdate({ _id }, object);
  },
  deleteContact: (_id) => contactItem.findByIdAndDelete({ _id }),
  getAdmin: (username) => AdminItem.findOne({ username }),
  postAdmin: (username, hash, role) => AdminItem.create({ username, hash, role }),
  deleteAllAdmin: () => AdminItem.deleteMany({})
};

