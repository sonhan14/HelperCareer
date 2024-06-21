// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCNaIv-Qi_5rSIv-qQOlthUR78HR7_WkJk",
    authDomain: "vmafinalproject.firebaseapp.com",
    projectId: "vmafinalproject",
    storageBucket: "vmafinalproject.appspot.com",
    messagingSenderId: "494392345854",
    appId: "1:494392345854:web:9f69608de6f5bf47d711af",
    measurementId: "G-ELGV6Q1GM6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);