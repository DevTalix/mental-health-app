// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRdYx2fIQtv_95Pzgvkor4nRRLZeAP5j4",
  authDomain: "safemind-429c4.firebaseapp.com",
  projectId: "safemind-429c4",
  storageBucket: "safemind-429c4.firebasestorage.app",
  messagingSenderId: "346579127369",
  appId: "1:346579127369:web:6d811b862058f6e43b8398",
  measurementId: "G-0EP2XK5Y4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);