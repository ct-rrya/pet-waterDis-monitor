import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Replace with your Firebase project configuration
// Get this from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
  apiKey: "AIzaSyDq55gPMFoaidfde0AM9oAstsCkJdRrb4I",
  authDomain: "water-dispenser-7e6e9.firebaseapp.com",
  databaseURL: "https://water-dispenser-7e6e9-default-rtdb.firebaseio.com",
  projectId: "water-dispenser-7e6e9",
  storageBucket: "water-dispenser-7e6e9.firebasestorage.app",
  messagingSenderId: "137922883737",
  appId: "1:137922883737:web:15887c3511b97b9aa04808"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database
export const database = getDatabase(app);