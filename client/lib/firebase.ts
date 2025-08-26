import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = (() => {
  try {
    if (
      !firebaseConfig.apiKey ||
      !firebaseConfig.projectId ||
      !firebaseConfig.messagingSenderId ||
      !firebaseConfig.appId
    ) {
      return null;
    }
    return initializeApp(firebaseConfig);
  } catch (e) {
    console.warn("Firebase init failed:", e);
    return null;
  }
})();


