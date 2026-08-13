import React from 'react';
import { SEED_FORUMS } from '../data/seedData';
import { Award } from 'lucide-react';
import ReferenceCard from '../components/ui/ReferenceCard';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

interface ForumItem {
  id: string;
  slug: string;
  name?: string;
  title?: string;
  tagline?: string;
  descriptionHtml?: string;
  description?: string;
  status?: string;
}

export default function ForumsPage() {
  const { data: forumsList = SEED_FORUMS } = useQuery({
    queryKey: ['public-forums'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_FORUMS;
      const snap = await getDocs(collection(db, 'forums'));
      if (snap.empty) return SEED_FORUMS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ForumItem[];
      const published = items.filter((i) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_FORUMS;
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{forumsList.length} Academic & Action Forums</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            Co-curricular platforms for research, peace action, social enterprise incubation, and community mobilization.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {forumsList.map((forum, idx) => {
          const gradients: Array<'blue' | 'purple' | 'pink' | 'emerald'> = [
            'blue',
            'purple',
            'pink',
            'emerald'
          ];
          const gradient = gradients[idx % gradients.length];

          return (
            <ReferenceCard
              key={forum.slug || forum.id}
              title={forum.title || forum.name || ''}
              subtitle={forum.tagline || ''}
              gradient={gradient}
              icon={<Award className="w-8 h-8" />}
              buttonText="Forum Details"
              buttonLink={`/student-life/forums/${forum.slug || forum.id}`}
            >
              <div
                className="text-neutral-600 text-xs md:text-sm leading-relaxed line-clamp-4"
                dangerouslySetInnerHTML={{ __html: forum.descriptionHtml || forum.description || '' }}
              />
            </ReferenceCard>
          );
        })}
      </section>
    </div>
  );
}
