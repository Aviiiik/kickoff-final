
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import 'firebase/compat/auth'
// Your web app's Firebase configuration
const firebaseConfig =  {
  // Enter your firebase api key
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth= getAuth (app)
