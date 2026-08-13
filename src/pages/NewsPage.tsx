import React from 'react';
import { SEED_NEWS } from '../data/seedData';
import { formatDate } from '../lib/date';
import { Sparkles } from 'lucide-react';
import ReferenceCard from '../components/ui/ReferenceCard';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { NewsArticle } from '../types/neissr';

export default function NewsPage() {
  const { data: newsList = SEED_NEWS } = useQuery({
    queryKey: ['public-news'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_NEWS;
      const snap = await getDocs(collection(db, 'news'));
      if (snap.empty) return SEED_NEWS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as NewsArticle[];
      const published = items.filter((i) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_NEWS;
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <h1 className="font-serif text-3xl md:text-5xl font-bold">News & Announcements</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            Stay updated with press releases, graduation ceremonies, and fieldwork highlights at NEISSR.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {newsList.map((news, idx) => {
          const gradients: Array<'blue' | 'purple' | 'pink' | 'emerald' | 'amber' | 'indigo'> = [
            'blue',
            'purple',
            'pink',
            'emerald',
            'amber',
            'indigo'
          ];
          const gradient = gradients[idx % gradients.length];

          return (
            <ReferenceCard
              key={news.id}
              title={news.title}
              badge={news.category}
              date={formatDate(news.publishedAt)}
              gradient={gradient}
              icon={<Sparkles className="w-8 h-8" />}
              buttonText="Read Full Story"
              buttonLink={`/news/${news.slug}`}
            >
              <p className="text-neutral-600 text-xs md:text-sm line-clamp-3 leading-relaxed">
                {news.excerpt}
              </p>
            </ReferenceCard>
          );
        })}
      </section>
    </div>
  );
}
