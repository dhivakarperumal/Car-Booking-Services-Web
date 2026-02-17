import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw1-tIWXo3_gNH7Ex1CS-M7mZkNjWmwM4",
  authDomain: "carcare-ee819.firebaseapp.com",
  projectId: "carcare-ee819",
  storageBucket: "carcare-ee819.firebasestorage.app",
  messagingSenderId: "580666545975",
  appId: "1:580666545975:web:f33218d0b3b9d564b96cb2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
