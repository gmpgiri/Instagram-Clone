import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAtyD-u7upbK9atXRwsPGFF5bxmjhsBsv0",
  authDomain: "instagram-gmp.firebaseapp.com",
  databaseURL: "https://instagram-gmp.firebaseio.com",
  projectId: "instagram-gmp",
  storageBucket: "instagram-gmp.appspot.com",
  messagingSenderId: "337602388594",
  appId: "1:337602388594:web:a8a8a133c6bff6ad2dd8eb",
  measurementId: "G-95MVWSF137"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export default db;



