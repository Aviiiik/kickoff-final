
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import 'firebase/compat/auth'
// Your web app's Firebase configuration
const firebaseConfig =  {
  // Enter your firebase api key
  apiKey: "AIzaSyAHzuZDC6ouAKqRds7jDJVPNOyxlV2TqLQ",
  authDomain: "kickoff-6c523.firebaseapp.com",
  projectId: "kickoff-6c523",
  storageBucket: "kickoff-6c523.firebasestorage.app",
  messagingSenderId: "1043212590204",
  appId: "1:1043212590204:web:d6ff187df70455ed8f7df9",
  measurementId: "G-1M6G8J29HR"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth= getAuth (app)
