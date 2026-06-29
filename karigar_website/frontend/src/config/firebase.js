import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC51gNAg04-fQwZw8i1cEqI-TAotkoDOyA",
  authDomain: "karigarpk.firebaseapp.com",
  projectId: "karigarpk",
  storageBucket: "karigarpk.firebasestorage.app",
  messagingSenderId: "44244070222",
  appId: "1:44244070222:web:24e537bef2df8576e2781f",
  measurementId: "G-G1LB8T0GC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
