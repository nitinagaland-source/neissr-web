import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

const rawApiKey = env.VITE_FIREBASE_API_KEY;
export const isFirebaseConfigured = Boolean(
  rawApiKey &&
  typeof rawApiKey === 'string' &&
  rawApiKey.trim().length > 5 &&
  !rawApiKey.includes('MY_')
);

// Fallback valid format key for preview environment when env variable is unconfigured
const validFallbackKey = 'AIzaSyDemoFirebaseKeyForLocalAppletPreview123';

const firebaseConfig = {
  apiKey: isFirebaseConfigured ? rawApiKey : validFallbackKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'neissr-app.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID || 'neissr-app',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'neissr-app.appspot.com',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId: env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890',
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
} catch (error) {
  console.warn('Firebase initialization error caught:', error);
  app = (getApps().length > 0 ? getApp() : {}) as unknown as FirebaseApp;
  db = {} as unknown as Firestore;
  auth = {} as unknown as Auth;
  storage = {} as unknown as FirebaseStorage;
}

export { app, db, auth, storage };
export default app;

