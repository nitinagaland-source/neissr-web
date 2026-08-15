import React from 'react';
import { Link } from 'react-router-dom';
import { SEED_NEWS } from '../data/seedData';
import { formatDate } from '../lib/date';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { NewsArticle } from '../types/neissr';

interface NewsRecord extends NewsArticle {
  coverImageUrl?: string;
  contentHtml?: string;
}

export default function NewsPage() {
  const { data: newsList = SEED_NEWS as NewsRecord[] } = useQuery({
    queryKey: ['public-news'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_NEWS as NewsRecord[];
      const snap = await getDocs(collection(db, 'news'));
      if (snap.empty) return SEED_NEWS as NewsRecord[];
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as NewsRecord[];
      const published = items.filter((i) => i.status === 'published' || !i.status);
      // Sort by publishedAt desc
      published.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
      return published.length > 0 ? published : (SEED_NEWS as NewsRecord[]);
    },
  });

  const categoryColors: Record<string, string> = {
    events: 'bg-purple-600',
    fieldwork: 'bg-blue-600',
    academic: 'bg-emerald-600',
    'peace-centre': 'bg-pink-600',
    default: 'bg-[#C8102E]',
  };

  const getCategoryColor = (cat: string) =>
    categoryColors[cat.toLowerCase()] || categoryColors.default;

  return (
    <div className="bg-[#FAF9F7] min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#003DA5] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-red-300 uppercase mb-2">
            UPDATES & PRESS
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3">
            News & Announcements
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-2xl">
            Stay updated with press releases, graduation ceremonies, and fieldwork highlights at NEISSR.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {newsList.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No news articles published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsList.map((news) => {
              const cover = news.coverImageUrl;
              const catColor = getCategoryColor(news.category);
              return (
                <Link
                  key={news.id}
                  to={`/news/${news.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
                >
                  {/* Cover Image on Top */}
                  <div className="relative h-48 overflow-hidden bg-neutral-100">
                    {cover ? (
                      <img
                        src={cover}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full ${catColor} flex items-center justify-center`}>
                        <Newspaper className="w-16 h-16 text-white/40" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={`${catColor} text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full`}>
                        {news.category}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 text-neutral-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {formatDate(news.publishedAt)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-serif text-lg font-bold text-neutral-900 group-hover:text-[#003DA5] transition-colors mb-3 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-3 mb-4 flex-1">
                      {news.excerpt}
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C8102E] group-hover:gap-3 transition-all">
                      READ FULL STORY <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
