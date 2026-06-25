import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAUW3MMVfMedfFaUhe6b0FfDImzgZfx0E",
  authDomain: "gen-lang-client-0198465035.firebaseapp.com",
  projectId: "gen-lang-client-0198465035",
  storageBucket: "gen-lang-client-0198465035.firebasestorage.app",
  messagingSenderId: "247771765226",
  appId: "1:247771765226:web:5ab7a1a9d9387eac08ba93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
