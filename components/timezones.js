// const moment = require('moment-timezone');
// let a = moment.tz('2020-08-08 16:00', 'America/Chicago');
// let utc = a.utc().format();
// console.log(utc);

// let date = new Date(utc);

// console.log(date.toLocaleString('env-US', { timeZone: 'America/Chicago' }));

module.exports = {
  Pacific: 'America/Los_Angeles',
  Mountain: 'America/Denver',
  Central: 'America/Chicago',
  Eastern: 'America/New_York'
}