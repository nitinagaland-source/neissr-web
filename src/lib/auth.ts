import { auth, isFirebaseConfigured } from './firebase';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';

type AuthCallback = (user: User | null) => void;
const listeners = new Set<AuthCallback>();

function getStoredDemoUser(): User | null {
  const demoUserJson = localStorage.getItem('neissr_demo_user');
  if (demoUserJson) {
    try {
      const parsed = JSON.parse(demoUserJson);
      return {
        uid: 'demo-admin-id',
        email: parsed.email || 'admin@neissr.ac.in',
        displayName: 'NEISSR Administrator',
        getIdTokenResult: async () => ({
          claims: { admin: true, role: 'administrator' }
        })
      } as unknown as User;
    } catch (e) {
      console.warn('Failed parsing demo user state:', e);
    }
  }
  return null;
}

function notifyListeners(user: User | null) {
  listeners.forEach((cb) => cb(user));
}

// Global listener for Firebase if configured
if (isFirebaseConfigured && auth && auth.app) {
  try {
    firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      const demoUser = getStoredDemoUser();
      notifyListeners(demoUser || firebaseUser);
    });
  } catch (e) {
    console.warn('Firebase listener setup error:', e);
  }
}

export const signIn = async (email: string, password: string) => {
  // Demo admin fallback for preview/testing
  if ((email === 'admin@neissr.ac.in' || email === 'admin@neissr.edu.in') && password === 'admin123') {
    const demoUser = {
      uid: 'demo-admin-id',
      email: 'admin@neissr.ac.in',
      displayName: 'NEISSR Administrator',
      getIdTokenResult: async () => ({
        claims: { admin: true, role: 'administrator' }
      })
    } as unknown as User;
    localStorage.setItem('neissr_demo_user', JSON.stringify({ email: 'admin@neissr.ac.in', admin: true }));
    notifyListeners(demoUser);
    return { user: demoUser };
  }

  if (!isFirebaseConfigured || !auth || !auth.app) {
    throw new Error('Firebase credentials not configured. Use admin@neissr.ac.in / admin123 to log in.');
  }

  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    notifyListeners(result.user);
    return result;
  } catch (err) {
    console.warn('Firebase signIn failed:', err);
    throw err;
  }
};

export const signOut = async () => {
  localStorage.removeItem('neissr_demo_user');
  if (isFirebaseConfigured && auth && auth.app) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('SignOut error caught:', e);
    }
  }
  notifyListeners(null);
};

export const onAuthStateChanged = (cb: AuthCallback) => {
  listeners.add(cb);
  
  const currentUser = getStoredDemoUser() || (auth && auth.currentUser ? auth.currentUser : null);
  cb(currentUser);

  return () => {
    listeners.delete(cb);
  };
};

export interface AdminClaims {
  isAdmin: boolean;
  role: string;
}

export const getAdminClaims = async (user: User): Promise<AdminClaims> => {
  if (!user) return { isAdmin: false, role: '' };

  if (user.uid === 'demo-admin-id') {
    return { isAdmin: true, role: 'administrator' };
  }

  try {
    const result = await user.getIdTokenResult(true);
    return {
      isAdmin: result.claims['admin'] === true || Boolean(user.email?.includes('neissr')),
      role: (result.claims['role'] as string) ?? 'administrator',
    };
  } catch {
    return {
      isAdmin: Boolean(user.email?.includes('neissr')),
      role: 'administrator',
    };
  }
};

export const resetPassword = async (email: string) => {
  if (!isFirebaseConfigured || !auth || !auth.app) {
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (e) {
    console.warn('Reset password error:', e);
    throw e;
  }
};


