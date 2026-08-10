import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // دقت کن که s کوچک نباشد
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBX_WbEiZlaSUZvlv5XwoDkq9AFS6mOwVM",
  authDomain: "english21-7386f.firebaseapp.com",
  projectId: "english21-7386f",
  storageBucket: "english21-7386f.firebasestorage.app",
  messagingSenderId: "586685580688",
  appId: "1:586685580688:web:c9e9db6a68524abd875f15",
  measurementId: "G-3XHTVJLE3Z"
};

// مقداردهی اولیه فایربیس
const app = initializeApp(firebaseConfig);

// خروجی گرفتن برای استفاده در کل پروژه
export const db = getFirestore(app); 
export const auth = getAuth(app);