// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, onAuthStateChanged, getAuth } from "firebase/auth";
import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAYwK6s-iuUjmmV4E6grB8eTEYE4L4HtdA",
    authDomain: "plantsat-2ca9a.firebaseapp.com",
    databaseURL: "https://plantsat-2ca9a-default-rtdb.firebaseio.com",
    projectId: "plantsat-2ca9a",
    storageBucket: "plantsat-2ca9a.appspot.com",
    messagingSenderId: "421626354059",
    appId: "1:421626354059:web:b5b6bb094fd6f28742378e",
    measurementId: "G-NMMZSJP8V6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

// Export initialized database
const database = getDatabase(app);

export { database, provider };