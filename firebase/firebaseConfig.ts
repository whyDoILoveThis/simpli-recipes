// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_CV7g2foQR1-KtnOEt9-kx8hM2SLG3JA",
  authDomain: "simpli-recipies.firebaseapp.com",
  projectId: "simpli-recipies",
  storageBucket: "simpli-recipies.appspot.com",
  messagingSenderId: "863863105036",
  appId: "1:863863105036:web:745205b0b3fb0b37dd7029"
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
