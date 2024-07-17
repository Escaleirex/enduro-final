import { initializeApp, getApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAxeokWLkw_-4LMB1jLUxOLqn5pdflYujM",
  authDomain: "enduro-5d39e.firebaseapp.com",
  projectId: "enduro-5d39e",
  storageBucket: "enduro-5d39e.appspot.com",
  messagingSenderId: "638113930327",
  appId: "1:638113930327:web:36a05693b2e46d081a5712",
  measurementId: "G-81ZX1XGNRH"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = initializeFirestore(app, {experimentalForceLongPolling: true, useFetchStreams: false,});

export { db, auth };