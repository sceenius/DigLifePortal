import firebase from "firebase/app";
import "firebase/database";

//import firestore from "firebase/firestore";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBcwEG_zKnU7gHuVtC_M-TxSQ72uoqb8gA",
  authDomain: "diglife-coop.firebaseapp.com",
  databaseURL: "https://diglife-coop.firebaseio.com",
  projectId: "diglife-coop",
  storageBucket: "diglife-coop.appspot.com",
  messagingSenderId: "811117156004"
};

// https://github.com/zeit/next.js/issues/1999
export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());
