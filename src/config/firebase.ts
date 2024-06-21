// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDVeKLJXwnj1x_lgCgylt9AxBmZacQV6oU",
    authDomain: "helpercareer.firebaseapp.com",
    projectId: "helpercareer",
    storageBucket: "helpercareer.appspot.com",
    messagingSenderId: "665343042795",
    appId: "1:665343042795:web:413514d94ca77f1c238aae",
    measurementId: "G-6CXG3RWBZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);