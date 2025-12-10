// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB7Kxxk-j1G0LmcOslRb-6mk3Uw9K9WHPw",
  authDomain: "leomi-599f5.firebaseapp.com",
  projectId: "leomi-599f5",
  storageBucket: "leomi-599f5.firebasestorage.app",
  messagingSenderId: "721040681146",
  appId: "1:721040681146:web:7b98e903b73c5c7fa37a83",
  measurementId: "G-NPYBRB23MK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
