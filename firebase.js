// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe1dUYz7V1dS4pWq2DkA0bpmrck3twbX4",
  authDomain: "notebook-c9848.firebaseapp.com",
  projectId: "notebook-c9848",
  storageBucket: "notebook-c9848.appspot.com",
  messagingSenderId: "182554938102",
  appId: "1:182554938102:web:48b095646b330eda3ebad7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getFirestore(app)

export {app, database} 