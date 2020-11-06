const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);

const schema = require('./schema.js');

mongoose.connect('mongodb://localhost:27017/the_wild_ones', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('The Wild Ones connected'));

const GalleryItem = mongoose.models.GalleryItem || mongoose.model('GalleryItem', schema.gallerySchema);
const MuralItem = mongoose.models.MuralItem || mongoose.model('MuralItem', schema.muralSchema);
const AboutItem = mongoose.models.AboutItem || mongoose.model('AboutItem', schema.aboutSchema);
const EventItem = mongoose.models.EventItem || mongoose.model('EventItem', schema.eventSchema);
const StoreItem = mongoose.models.StoreItem || mongoose.model('StoreItem', schema.storeSchema);
const OrderItem = mongoose.models.OrderItem || mongoose.model('OrderItem', schema.orderSchema);
const ContactItem = mongoose.models.ContactItem || mongoose.model('ContactItem', schema.contactSchema);
// const mailingListItem = mongoose.model('MailingListItem', schema.mailingListSchema);
const AdminItem = mongoose.models.AdminItem || mongoose.model('AdminItem', schema.adminSchema);

module.exports.GalleryItem = GalleryItem;
module.exports.MuralItem = MuralItem;
module.exports.AboutItem = AboutItem;
module.exports.EventItem = EventItem;
module.exports.StoreItem = StoreItem;
module.exports.OrderItem = OrderItem;
module.exports.ContactItem = ContactItem;
// module.exports.mailingListItem = mailingListItem;
module.exports.AdminItem = AdminItem;
