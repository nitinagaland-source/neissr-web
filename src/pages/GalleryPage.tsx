import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Image as ImageIcon } from 'lucide-react';

interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
}

interface GalleryImageItem {
  id: string;
  url: string;
  caption: string;
}

export default function GalleryPage() {
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['galleries'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'galleries'));
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as GalleryCategory[];
    },
  });

  const { data: allImages = [], isLoading: loadingImages } = useQuery({
    queryKey: ['gallery-all-images', categories],
    queryFn: async () => {
      const results: GalleryImageItem[] = [];
      for (const cat of categories) {
        const subSnap = await getDocs(collection(db, 'galleries', cat.id, 'images'));
        subSnap.docs.forEach((imgDoc) => {
          const data = imgDoc.data();
          if (data.url) {
            results.push({
              id: imgDoc.id,
              url: data.url,
              caption: data.caption || cat.name || 'Campus Activity',
            });
          }
        });
      }
      return results;
    },
    enabled: categories.length > 0,
  });

  const isLoading = loadingCategories || loadingImages;

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Photo & Activity Gallery</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            Visual moments capturing student activities, rural camps, and peace initiatives.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-72 bg-neutral-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : allImages.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200/80 p-12 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#003DA5]/10 text-[#003DA5] flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-bold text-xl text-neutral-800">Gallery Coming Soon</h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Official photos and event highlights are being updated in our media archive. Check back after launch.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allImages.map((img) => (
              <div key={img.id} className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm group">
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={img.url}
                    alt={img.caption || 'Gallery photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <div className="font-serif font-bold text-lg text-neutral-900">{img.caption}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
