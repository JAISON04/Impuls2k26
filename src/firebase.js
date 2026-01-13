import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyA9eP7H2Ncm-tF23XhsoCQ3Nfu6Gmw6qw0",
    authDomain: "impulse-2e7c8.firebaseapp.com",
    projectId: "impulse-2e7c8",
    storageBucket: "impulse-2e7c8.firebasestorage.app",
    messagingSenderId: "773961069722",
    appId: "1:773961069722:web:f3d3e9505362db4182db23",
    measurementId: "G-FT4RPZ7E5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics };
