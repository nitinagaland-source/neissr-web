import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEED_NEWS } from '../data/seedData';
import { formatDate } from '../lib/date';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { NewsArticle } from '../types/neissr';

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: news = SEED_NEWS[0] } = useQuery({
    queryKey: ['public-news-detail', slug],
    queryFn: async () => {
      if (!isFirebaseConfigured) {
        return SEED_NEWS.find((n) => n.slug === slug || n.id === slug) || SEED_NEWS[0];
      }
      const snap = await getDocs(collection(db, 'news'));
      if (snap.empty) {
        return SEED_NEWS.find((n) => n.slug === slug || n.id === slug) || SEED_NEWS[0];
      }
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as NewsArticle[];
      const found = items.find((n) => n.slug === slug || n.id === slug);
      return found || SEED_NEWS.find((n) => n.slug === slug || n.id === slug) || SEED_NEWS[0];
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-8">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <Link
          to="/news"
          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-[#003DA5] mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to News
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-xs">
            <span className="bg-[#003DA5] text-white px-3 py-1 rounded-full font-semibold">
              {news.category}
            </span>
            <span className="text-neutral-500 font-medium">{formatDate(news.publishedAt)}</span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-neutral-900 leading-tight">
            {news.title}
          </h1>

          <div
            className="text-neutral-700 text-sm md:text-base leading-relaxed pt-4 border-t border-neutral-200"
            dangerouslySetInnerHTML={{ __html: news.bodyHtml }}
          />
        </div>
      </section>
    </div>
  );
}
