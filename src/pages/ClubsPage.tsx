import React from 'react';
import { SEED_CLUBS } from '../data/seedData';
import { Users } from 'lucide-react';
import ReferenceCard from '../components/ui/ReferenceCard';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Club } from '../types/neissr';

export default function ClubsPage() {
  const { data: clubsList = SEED_CLUBS } = useQuery({
    queryKey: ['public-clubs'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_CLUBS;
      const snap = await getDocs(collection(db, 'clubs'));
      if (snap.empty) return SEED_CLUBS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Club[];
      const published = items.filter((i) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_CLUBS;
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{clubsList.length} Active Student Clubs</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            Providing extracurricular learning, leadership development, community service, and youth engagement.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clubsList.map((club, idx) => {
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
              key={club.slug}
              title={club.name}
              subtitle={club.tagline}
              gradient={gradient}
              icon={<Users className="w-8 h-8" />}
              buttonText="Explore Club"
              buttonLink={`/student-life/clubs/${club.slug}`}
            >
              <div className="space-y-3">
                <div
                  className="text-neutral-600 text-xs leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: club.descriptionHtml }}
                />
                <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 font-medium">
                  {club.officeBearers[0]?.role}: {club.officeBearers[0]?.name}
                </div>
              </div>
            </ReferenceCard>
          );
        })}
      </section>
    </div>
  );
}
