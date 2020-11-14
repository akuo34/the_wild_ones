const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config();

// var transporter = nodemailer.createTransport(smtpTransport({
var transporter = nodemailer.createTransport({
  // host: 'smtp.gmail.com',
  // port: 465,
  service: 'Yahoo',
  // secure: true,
  // host: 'smtp.gmail.com',
  // port: 587,
  auth: {
    user: `${process.env.EMAILER_ACCOUNT}`, // your email address to send email from
    pass: `${process.env.EMAILER_PASSWORD}` // your gmail account password
  }
// }));
});

module.exports = transporter;