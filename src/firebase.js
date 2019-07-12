import firebase from 'firebase/app'
require("firebase/auth");
require("firebase/firestore");
require("firebase/functions");
require("firebase/storage");

var firebaseConfig = {
//Aquí va tu confing
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()
const functions = firebase.functions()

export {
  firebase,
  auth,
  db,
  storage,
  functions
}