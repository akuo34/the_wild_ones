const { GalleryItem, MuralItem, AboutItem, EventItem, StoreItem, ContactItem, OrderItem, MailingListItem, AdminItem } = require('./');

module.exports = {
  getGallery: async () => GalleryItem.find().sort([['index', 1]]),
  postGallery: (title, description, fireBaseUrl, date, filename, index, smallFireBaseUrl, smallFilename) => GalleryItem.create({ title, description, fireBaseUrl, date, filename, index, smallFireBaseUrl, smallFilename }),
  putGallery: (title, description, _id, index) => {
    let object = { title, description, index };
    for (let key in object) {
      if (object[key] === '') {
        delete object[key];
      }
    }   
    return GalleryItem.findOneAndUpdate({ _id }, object)
  },
  putGalleryPhoto: (fireBaseUrl, filename, _id, smallFireBaseUrl, smallFilename) => GalleryItem.findOneAndUpdate({ _id }, { fireBaseUrl, filename, smallFireBaseUrl, smallFilename }),
  deleteGallery: (_id) => GalleryItem.findByIdAndDelete({ _id }),
  getMural: async () => MuralItem.find().sort([['index', 1]]),
  postMural: (title, description, fireBaseUrl, date, filename, index, smallFireBaseUrl, smallFilename) => MuralItem.create({ title, description, fireBaseUrl, date, filename, index, smallFireBaseUrl, smallFilename }),
  putMural: (title, description, _id, index) => {
    let object = { title, description, index };
    for (let key in object) {
      if (object[key] === '') {
        delete object[key];
      }
    }
    return MuralItem.findOneAndUpdate({ _id }, object)
  },
  putMuralPhoto: (fireBaseUrl, filename, _id, smallFireBaseUrl, smallFilename) => MuralItem.findOneAndUpdate({ _id }, { fireBaseUrl, filename, smallFireBaseUrl, smallFilename }),
  deleteMural: (_id) => MuralItem.findByIdAndDelete({ _id }),
  getAbout: async () => AboutItem.find(),
  postAbout: (portraitFireBaseUrl, bio, portraitFilename, bannerFireBaseUrl, bannerFilename) => AboutItem.create({ portraitFireBaseUrl, bio, portraitFilename, bannerFireBaseUrl, bannerFilename }),
  putAbout: (bio, _id) => AboutItem.findOneAndUpdate({ _id }, { bio }),
  putAboutPortrait: (portraitFireBaseUrl, portraitFilename, _id) => AboutItem.findOneAndUpdate({ _id }, { portraitFireBaseUrl, portraitFilename }),
  putAboutBanner: (bannerFireBaseUrl, bannerFilename, _id) => AboutItem.findOneAndUpdate({ _id }, { bannerFireBaseUrl, bannerFilename }),
  deleteAbout: (_id) => AboutItem.findOneAndDelete({ _id }),
  getEvent: async () => EventItem.find().sort([['startDate', 1]]),
  postEvent: (images, title, resource, location, startDate, endDate, startTime, endTime, allDay, timezone) => EventItem.create({ images, title, resource, location, startDate, endDate, startTime, endTime, allDay, timezone }),
  putEvent: (title, resource, location, startDate, endDate, startTime, endTime, allDay, _id, timezone) => {

    let object = { title, resource, location, startDate, endDate, startTime, endTime, allDay, timezone };
    for (let key in object) {
      if (!object[key]) {
        delete object[key];
      }
    }
    return EventItem.findOneAndUpdate({ _id }, object);
  },
  putEventPhoto: (images, _id) => EventItem.findOneAndUpdate({ _id }, { images }),
  deleteEvent: (_id) => EventItem.findOneAndDelete({ _id }),
  getStore: async () => StoreItem.find().sort([['price', 1]]),
  postStore: (images, title, description, width, height, price, category, quantity) => StoreItem.create({ images, title, description, width, height, price, category, quantity }),
  putStore: (title, description, width, height, price, category, quantity, _id) => {

    let object = { title, description, width, height, price, category, quantity };
    for (let key in object) {
      if (!object[key]) {
        delete object[key];
      }
    }
    return StoreItem.findByIdAndUpdate({ _id }, object);
  },
  getOneItem: (_id) => StoreItem.findOne({ _id }),
  putStorePhoto: (images, _id) => StoreItem.findByIdAndUpdate({ _id }, { images }),
  deleteStore: (_id) => StoreItem.findByIdAndDelete({ _id }),
  getOrder: (sessionId) => OrderItem.findOne({ sessionId }),
  postOrder: (sessionId, items) => OrderItem.create({ sessionId, items }),
  putOrder: (sessionId, items) => OrderItem.findOneAndUpdate({ sessionId }, { items }),
  deleteOrder: (sessionId) => OrderItem.findOneAndDelete({ sessionId }),
  getContact: () => ContactItem.find(),
  postContact: (name, email, phone, instagram) => ContactItem.create({ name, email, phone, instagram }),
  putContact: (name, email, phone, instagram, _id) => {

    let object = { name, email, phone, instagram };
    for (let key in object) {
      if(!object[key]) {
        delete object[key];
      }
    }
    return ContactItem.findByIdAndUpdate({ _id }, object);
  },
  deleteContact: (_id) => ContactItem.findByIdAndDelete({ _id }),
  getAdmin: (username) => AdminItem.findOne({ username }),
  postAdmin: (username, hash, role) => AdminItem.create({ username, hash, role }),
  deleteAllAdmin: () => AdminItem.deleteMany({})
};

