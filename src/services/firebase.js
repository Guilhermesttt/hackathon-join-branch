// Enhanced Firebase configuration with all services
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

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

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Analytics only in browser
let analytics;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Development emulators (uncomment for local development)
// if (import.meta.env.DEV) {
//   connectFirestoreEmulator(db, 'localhost', 8080);
//   connectStorageEmulator(storage, 'localhost', 9199);
//   connectFunctionsEmulator(functions, 'localhost', 5001);
// }

export { analytics };
export default app;