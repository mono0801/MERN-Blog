// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: "mern-blog-2b313.firebaseapp.com",
    projectId: "mern-blog-2b313",
    storageBucket: "mern-blog-2b313.appspot.com",
    messagingSenderId: "871998363277",
    appId: "1:871998363277:web:950724340cb7fe9824b4c4",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
