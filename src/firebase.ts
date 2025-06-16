import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDL4F2GyVHJ6H-lRP5ewiMoKOm1JKRUt-w",
  authDomain: "wili-dashboard.firebaseapp.com",
  projectId: "wili-dashboard",
  storageBucket: "wili-dashboard.firebasestorage.app",
  messagingSenderId: "246658955846",
  appId: "1:246658955846:web:5bf0cad9c0b0ee13956847",
  measurementId: "G-6CME3YF8KS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);