import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function logActivity(
  action: string,
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    await addDoc(collection(db, 'activity-log'), {
      action,
      collection: collectionName,
      docId,
      adminEmail: auth.currentUser?.email ?? 'unknown',
      timestamp: serverTimestamp(),
    });
  } catch {
    // Never block user action for a log failure
  }
}
