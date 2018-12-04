import firebase from "firebase";
import firestore from "firebase/firestore";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBcwEG_zKnU7gHuVtC_M-TxSQ72uoqb8gA",
  authDomain: "diglife-coop.firebaseapp.com",
  databaseURL: "https://diglife-coop.firebaseio.com",
  projectId: "diglife-coop",
  storageBucket: "diglife-coop.appspot.com",
  messagingSenderId: "811117156004"
};
const firebaseApp = firebase.initializeApp(config);
firebaseApp.firestore().settings({ timestampsInSnapshots: true });

export default firebaseApp;
