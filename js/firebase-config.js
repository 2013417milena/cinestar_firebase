import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBoSv5g60Sm9I56ZqXJcupVL7it4kvN18U",
    authDomain: "cinestarjp-468ac.firebaseapp.com",
    projectId: "cinestarjp-468ac",
    storageBucket: "cinestarjp-468ac.firebasestorage.app",
    messagingSenderId: "304535094621",
    appId: "1:304535094621:web:6db2ed028dd1a18e5fd4b4"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, query, where, doc, getDoc };