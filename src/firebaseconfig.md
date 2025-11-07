// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZo9ILN9EkDR-6bHoI4TXByeTuxzElocc",
  authDomain: "confirmacion-invitacion.firebaseapp.com",
  projectId: "confirmacion-invitacion",
  storageBucket: "confirmacion-invitacion.firebasestorage.app",
  messagingSenderId: "227921970159",
  appId: "1:227921970159:web:ec6d062c86b54c88766c1a",
  measurementId: "G-ZBB4NQRJQC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);