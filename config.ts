import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB_nvwg_o9beKR5-478iQJJyOPxleQpTQ0",
  authDomain: "waste-mismanagement.firebaseapp.com",
  projectId: "waste-mismanagement",
  storageBucket: "waste-mismanagement.appspot.com",
  messagingSenderId: "50473215579",
  appId: "1:50473215579:web:35743ddd2c7aec5030c17e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;