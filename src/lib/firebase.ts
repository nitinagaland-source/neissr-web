import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const rawApiKey = env.VITE_FIREBASE_API_KEY;
export const isFirebaseConfigured = Boolean(rawApiKey && typeof rawApiKey === 'string' && rawApiKey.trim().length > 5 && !rawApiKey.includes('MY_'));
const firebaseConfig = { apiKey: isFirebaseConfigured ? rawApiKey : 'AIzaSyDemoFirebaseKeyForLocalAppletPreview123', authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || 'neissr-app.firebaseapp.com', projectId: env.VITE_FIREBASE_PROJECT_ID || 'neissr-app', storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || 'neissr-app.appspot.com', messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012', appId: env.VITE_FIREBASE_APP_ID || '1:123456789012:web:abcdef1234567890' };
let app: any, db: any, auth: any;
try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  setPersistence(auth, browserSessionPersistence).catch((e: any) => console.warn('persistence error:', e));
} catch (error) {
  console.warn('Firebase init error:', error);
  app = getApps().length > 0 ? getApp() : {};
  db = {}; auth = {};
}
export { app, db, auth };
export default app;
