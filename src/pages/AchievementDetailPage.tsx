import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { SEED_ACHIEVEMENTS } from '../data/seedData';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function AchievementDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: ach, isLoading } = useQuery({
    queryKey: ['achievement', id],
    queryFn: async () => {
      if (!isFirebaseConfigured || !id) {
        return SEED_ACHIEVEMENTS.find((a) => a.id === id) || null;
      }
      const snap = await getDoc(doc(db, 'achievements', id));
      if (snap.exists()) return { id: snap.id, ...snap.data() };
      return SEED_ACHIEVEMENTS.find((a) => a.id === id) || null;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ach) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">Achievement not found.</p>
        <Link to="/achievements" className="text-[#C8102E] font-semibold hover:underline">Back to Achievements</Link>
      </div>
    );
  }

  const a = ach as any;
  const name = a.recipientName || a.achieverName || 'NEISSR Student';
  const image = a.imageUrl || a.photoUrl || '';
  const description = a.descriptionHtml || a.description || '';
  const category = a.category || 'Student';
  const year = a.year || (a.date || '').slice(0, 4) || '';

  return (
    <div className="py-12 bg-[#FAF9F7]">
      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-8">
        <Link to="/achievements" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-[#C8102E] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Achievements
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-neutral-100">
          {image && (
            <div className="w-full h-64 md:h-80 overflow-hidden">
              <img src={image} alt={a.title} className="w-full h-full object-cover" />
            </div>
          )}

          {!image && (
            <div className="w-full h-48 bg-gradient-to-br from-[#C8102E] to-[#F43F5E] flex items-center justify-center">
              <Trophy className="w-16 h-16 text-white/60" />
            </div>
          )}

          <div className="p-8 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider bg-[#C8102E]/10 text-[#C8102E] px-3 py-1 rounded-full">
                {category}
              </span>
              {year && (
                <span className="text-xs font-medium text-neutral-400">{year}</span>
              )}
            </div>

            <h1 className="font-serif font-bold text-2xl md:text-3xl text-neutral-900">{a.title}</h1>
            <p className="text-sm font-semibold text-[#003DA5]">Achiever: {name}</p>

            {description && (
              <div
                className="text-neutral-600 text-sm leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}