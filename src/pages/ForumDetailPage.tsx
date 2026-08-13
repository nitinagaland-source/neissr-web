import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEED_FORUMS } from '../data/seedData';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

interface ForumItem {
  id?: string;
  slug: string;
  name?: string;
  title?: string;
  tagline?: string;
  descriptionHtml?: string;
  description?: string;
  objectiveHtml?: string;
}

export default function ForumDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: forum = SEED_FORUMS[0] as unknown as ForumItem } = useQuery({
    queryKey: ['public-forum-detail', slug],
    queryFn: async () => {
      if (!isFirebaseConfigured) {
        return (SEED_FORUMS as unknown as ForumItem[]).find((f) => f.slug === slug || f.id === slug) || (SEED_FORUMS[0] as unknown as ForumItem);
      }
      const snap = await getDocs(collection(db, 'forums'));
      if (snap.empty) {
        return (SEED_FORUMS as unknown as ForumItem[]).find((f) => f.slug === slug || f.id === slug) || (SEED_FORUMS[0] as unknown as ForumItem);
      }
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ForumItem[];
      const found = items.find((f) => f.slug === slug || f.id === slug);
      return found || (SEED_FORUMS as unknown as ForumItem[]).find((f) => f.slug === slug || f.id === slug) || (SEED_FORUMS[0] as unknown as ForumItem);
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-8">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <Link
          to="/student-life/forums"
          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-[#003DA5] mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Forums
        </Link>

        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Academic Forum</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{forum.title || forum.name}</h1>
          <p className="text-neutral-200 text-sm md:text-base">{forum.tagline || forum.description}</p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
        <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#C8102E] pl-3">
          About {forum.title || forum.name}
        </h2>
        <div className="text-neutral-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: forum.objectiveHtml || forum.descriptionHtml || forum.description || '' }} />
      </section>
    </div>
  );
}
