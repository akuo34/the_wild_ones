import firebase from 'firebase/app';
import 'firebase/storage';
// require('dotenv').config();

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "status-kuo-abc87.firebaseapp.com",
  databaseURL: "https://status-kuo-abc87.firebaseio.com",
  projectId: "status-kuo-abc87",
  storageBucket: "status-kuo-abc87.appspot.com",
  messagingSenderId: "111200716918",
  appId: "1:111200716918:web:2bc2bfb30763650773f757",
  measurementId: "G-YF0JN1MXXQ"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const storage = firebase.storage();

export {
  storage, firebase as default
}