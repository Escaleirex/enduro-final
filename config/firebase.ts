import { initializeApp } from "firebase/app";
import { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_URL, FIREBASE_PROJECT_ID, FIREBASE_STORAGEBUCKET, FIREBASE_MESSAGING_SENDER_ID } from "@env";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxeokWLkw_-4LMB1jLUxOLqn5pdflYujM",
  authDomain: "enduro-5d39e.firebaseapp.com",
  projectId: "enduro-5d39e",
  storageBucket: "enduro-5d39e-please.appspot.com",
  messagingSenderId: "638113930327",
  appId: "1:638113930327:web:36a05693b2e46d081a5712",
  measurementId: "G-81ZX1XGNRH"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true })

export { db, auth };