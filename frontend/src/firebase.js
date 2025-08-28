// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDkPhYGNEdBtRdEeWwHCWfCFtLWqmGBTO8",
  authDomain: "hackathon-8b0e1.firebaseapp.com",
  projectId: "hackathon-8b0e1",
  storageBucket: "hackathon-8b0e1.firebasestorage.app",
  messagingSenderId: "523976123580",
  appId: "1:523976123580:web:1f781a5403c7aa6540dcb9",
  measurementId: "G-GQHD2SXYJ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in the browser and when measurementId exists
let analytics;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (_) {
    // ignore analytics init errors in unsupported environments
  }
}

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export { signInWithEmailAndPassword };

export default app;


