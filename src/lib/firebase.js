import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey);
}

let app, db, auth;

if (isFirebaseConfigured()) {
  try {
    // Initialize Firebase app (server or client) if not already initialized
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    // Auth should only be instantiated in the browser environment
    if (typeof window !== 'undefined') {
      auth = getAuth(app);
    }
  } catch (error) {
    console.warn('Firebase initialization warning:', error.message);
  }
} else {
  console.warn('Firebase configuration not found. Check .env variables.');
}

export { app, db, auth };
