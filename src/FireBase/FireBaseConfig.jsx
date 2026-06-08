// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyAnvO3qVUsd5ajz4pVT5y9kP42cbCzhaHY",
  authDomain: "hydroplus-international.firebaseapp.com",
  projectId: "hydroplus-international",
  storageBucket: "hydroplus-international.firebasestorage.app",
  messagingSenderId: "500113573355",
  appId: "1:500113573355:web:efeefb432c20ca69eec5ae",
  measurementId: "G-3F5JRJ5NX3",
  databaseURL:"https://hydroplus-international-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app);

export { fireDB, auth }