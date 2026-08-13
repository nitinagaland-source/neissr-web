import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import {
  SEED_FACULTY,
  SEED_NEWS,
  SEED_EVENTS,
  SEED_DOCUMENTS,
  SEED_CLUBS,
  SEED_ACHIEVEMENTS,
  SEED_PLACED_STUDENTS,
  SEED_FORUMS
} from '../data/seedData';
import { DEFAULT_CONTENT } from '../admin/pages/ContentEditorPage';
import { DEFAULT_SETTINGS } from '../admin/pages/SiteSettingsPage';

const SEED_GALLERY = [
  {
    id: 'gal-1',
    title: '10th Annual Convocation Ceremony 2023',
    category: 'Convocations',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800',
    caption: 'Graduating MSW students receiving their degrees from Nagaland University officials.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gal-2',
    title: 'Youth Peace Rally - International Day of Peace',
    category: 'Peace Rallies',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    caption: 'NEISSR students leading the peace movement in Chümoukedima town.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gal-3',
    title: 'Rural Fieldwork Practicum in Mon District',
    category: 'Field Visits',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    caption: 'BSW 2nd year students performing community assessment and PRA mapping.',
    createdAt: new Date().toISOString(),
  },
];

export async function seedFirestoreIfEmpty() {
  if (!isFirebaseConfigured) {
    return;
  }

  try {
    // Check if faculty has documents
    const facultySnap = await getDocs(collection(db, 'faculty'));
    if (!facultySnap.empty) {
      console.log('NEISSR: Firestore already initialized');
      return;
    }

    console.log('NEISSR: Starting Firestore seed migration...');

    // 1. Seed Faculty
    for (const item of SEED_FACULTY) {
      const docRef = doc(db, 'faculty', item.id);
      await setDoc(docRef, item, { merge: true });
    }

    // 2. Seed News
    for (const item of SEED_NEWS) {
      const docRef = doc(db, 'news', item.id);
      await setDoc(docRef, item, { merge: true });
    }

    // 3. Seed Events
    for (const item of SEED_EVENTS) {
      const docRef = doc(db, 'events', item.id);
      await setDoc(docRef, item, { merge: true });
    }

    // 4. Seed Documents
    for (const item of SEED_DOCUMENTS) {
      const docRef = doc(db, 'documents', item.id);
      await setDoc(docRef, item, { merge: true });
    }

    // 5. Seed Clubs
    for (const item of SEED_CLUBS) {
      const docRef = doc(db, 'clubs', item.id || item.slug);
      await setDoc(docRef, item, { merge: true });
    }

    // 6. Seed Achievements
    for (const item of SEED_ACHIEVEMENTS) {
      const docRef = doc(db, 'achievements', item.id);
      await setDoc(docRef, item, { merge: true });
    }

    // 7. Seed Gallery
    for (const item of SEED_GALLERY) {
      const docRef = doc(db, 'gallery', item.id);
      await setDoc(docRef, item, { merge: true });
    }

    // 8. Seed Placements
    let pIdx = 1;
    for (const item of SEED_PLACED_STUDENTS) {
      const id = `p-${pIdx++}`;
      const docRef = doc(db, 'placements', id);
      await setDoc(docRef, {
        id,
        fullName: item.name,
        programme: item.name.includes('Ms.') ? 'MSW' : 'BSW',
        batchYear: '2023-24',
        organisation: 'NGO / Social Sector Partner',
        role: 'Social Work Trainee / Coordinator',
        packageLPA: '3.6 - 4.8 LPA',
        status: 'published',
      }, { merge: true });
    }

    // 9. Seed Forums
    for (const item of SEED_FORUMS) {
      const docRef = doc(db, 'forums', item.slug);
      await setDoc(docRef, {
        ...item,
        id: item.slug,
        title: item.name,
        category: 'Youth & Peace',
        author: 'NEISSR Faculty',
        status: 'published',
        publishedAt: new Date().toISOString(),
      }, { merge: true });
    }

    // 10. Seed Page & Content documents
    await setDoc(doc(db, 'pages', 'home'), DEFAULT_CONTENT.home || {}, { merge: true });
    await setDoc(doc(db, 'content', 'about'), DEFAULT_CONTENT.about || {}, { merge: true });
    await setDoc(doc(db, 'content', 'messages'), DEFAULT_CONTENT.messages || {}, { merge: true });
    await setDoc(doc(db, 'content', 'admissions'), DEFAULT_CONTENT.admissions || {}, { merge: true });
    await setDoc(doc(db, 'content', 'placement'), DEFAULT_CONTENT.placement || {}, { merge: true });
    if (DEFAULT_CONTENT.infrastructure) {
      await setDoc(doc(db, 'content', 'infrastructure'), DEFAULT_CONTENT.infrastructure, { merge: true });
    }
    if (DEFAULT_CONTENT.academics) {
      await setDoc(doc(db, 'content', 'academics'), DEFAULT_CONTENT.academics, { merge: true });
    }

    // 11. Seed Settings
    await setDoc(doc(db, 'settings', 'general'), DEFAULT_SETTINGS, { merge: true });

    console.log('NEISSR: Firestore seeded successfully');
  } catch (error) {
    console.warn('NEISSR: Firestore seed migration check failed:', error);
  }
}
