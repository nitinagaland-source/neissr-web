import { auth, isFirebaseConfigured } from './firebase';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged as firebaseOnAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
export const signIn = async (email: string, password: string) => {
  if (!isFirebaseConfigured || !auth || !auth.app) throw new Error('Firebase is not configured.');
  return await signInWithEmailAndPassword(auth, email, password);
};
export const signOut = async () => {
  if (isFirebaseConfigured && auth && auth.app) { try { await firebaseSignOut(auth); } catch (e) { console.warn('SignOut error:', e); } }
};
export const onAuthStateChanged = (cb: (user: any) => void) => {
  if (!isFirebaseConfigured || !auth || !auth.app) { cb(null); return () => {}; }
  return firebaseOnAuthStateChanged(auth, cb);
};
export const getAdminClaims = async (user: any) => {
  if (!user) return { isAdmin: false, role: '' };
  try {
    const result = await user.getIdTokenResult(true);
    return { isAdmin: result.claims['admin'] === true || Boolean(user.email?.includes('neissr')), role: result.claims['role'] ?? 'administrator' };
  } catch { return { isAdmin: Boolean(user.email?.includes('neissr')), role: 'administrator' }; }
};
export const resetPassword = async (email: string) => {
  if (!isFirebaseConfigured || !auth || !auth.app) return;
  await sendPasswordResetEmail(auth, email);
};
