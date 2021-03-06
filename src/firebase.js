import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCmU7R6v_aTOsLp5aYyJClrFhfKBpJ8doY",
  authDomain: "whatsapp-clone-raks.firebaseapp.com",
  databaseURL: "https://whatsapp-clone-raks.firebaseio.com",
  projectId: "whatsapp-clone-raks",
  storageBucket: "whatsapp-clone-raks.appspot.com",
  messagingSenderId: "429998600720",
  appId: "1:429998600720:web:c17220062b9ed7a2785095",
  measurementId: "G-2B2YLMWYKN",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { firebaseApp, auth, provider };
export default db;
