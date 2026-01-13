import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDpo4EKqi8Krqr2y-dF3YrPrvU2vaVE8g",
  authDomain: "impulse2k26-58257.firebaseapp.com",
  projectId: "impulse2k26-58257",
  storageBucket: "impulse2k26-58257.firebasestorage.app",
  messagingSenderId: "852317779422",
  appId: "1:852317779422:web:8c586b2ade72be5537d94f",
  measurementId: "G-VRDMG0NZF7"
};

import { getFunctions } from "firebase/functions";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app);
const googleProvider = new GoogleAuthProvider();

export { db, analytics, auth, googleProvider, signInWithPopup, signOut, functions };
