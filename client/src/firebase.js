// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-cb903.firebaseapp.com",
  projectId: "mern-cb903",
  storageBucket: "mern-cb903.appspot.com",
  messagingSenderId: "170528636310",
  appId: "1:170528636310:web:336ca3b1650858ab8971b7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);