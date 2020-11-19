const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  fireBaseUrl: String,
  title: String,
  description: String,
  date: String,
  filename: String,
  index: Number,
  smallFireBaseUrl: String,
  smallFilename: String
});

const muralSchema = new mongoose.Schema({
  fireBaseUrl: String,
  title: String,
  description: String,
  date: String,
  filename: String,
  index: Number,
  smallFireBaseUrl: String,
  smallFilename: String
});

const aboutSchema = new mongoose.Schema({
  portraitFireBaseUrl: String,
  bio: String,
  portraitFilename: String,
  bannerFireBaseUrl: String,
  bannerFilename: String
});

const eventSchema = new mongoose.Schema({
  images: [{
    fireBaseUrl: String,
    filename: String,
  }],
  title: String,
  location: String,
  startDate: Date,
  endDate: Date,
  startTime: String,
  endTime: String,
  allDay: Boolean,
  resource: String,
  timezone: String
});

const storeSchema = new mongoose.Schema({
  images: [{
    fireBaseUrl: String,
    filename: String,
  }],
  filename: String,
  title: String,
  description: String,
  width: Number,
  height: Number,
  price: Number,
  category: String,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  sessionId: String,
  items: [{
    itemId: String,
    fireBaseUrl: String,
    title: String,
    price: Number,
    quantity: Number,
    width: Number,
    height: Number,
    category: String
  }]
});

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  instagram: String,
});

const mailingListSchema = new mongoose.Schema({
  name: String,
  email: String
});

const adminSchema = new mongoose.Schema({
  username: String,
  hash: String,
  role: String,
});

module.exports.gallerySchema = gallerySchema;
module.exports.muralSchema = muralSchema;
module.exports.aboutSchema = aboutSchema;
module.exports.eventSchema = eventSchema;
module.exports.storeSchema = storeSchema;
module.exports.orderSchema = orderSchema;
module.exports.contactSchema = contactSchema;
module.exports.mailingListSchema = mailingListSchema;
module.exports.adminSchema = adminSchema;
