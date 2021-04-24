import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'

let firebaseConfig = {
  apiKey: "AIzaSyCg-8NaMpWSkpBqVJlsaUYNQ3V2N0LT7yM",
  authDomain: "tem-web-master.firebaseapp.com",
  projectId: "tem-web-master",
  storageBucket: "tem-web-master.appspot.com",
  messagingSenderId: "864830673353",
  appId: "1:864830673353:web:80ef266f7acd04b7339818",
  measurementId: "G-K29ZSLM1G3"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
};

export default firebase;