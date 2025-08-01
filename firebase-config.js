// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getStorage} from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsE521zAklYziftwHPUhtqSJbbg2_R5c0",
  authDomain: "social-media-webapp-8e2dd.firebaseapp.com",
  projectId: "social-media-webapp-8e2dd",
  storageBucket: "social-media-webapp-8e2dd.appspot.com",
  messagingSenderId: "883738314206",
  appId: "1:883738314206:web:38eb15bb70f86d3bc5494f",
  measurementId: "G-CNLF0QB4F6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export {app, analytics, storage};
