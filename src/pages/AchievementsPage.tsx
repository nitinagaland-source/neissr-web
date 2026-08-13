import React from 'react';
import { SEED_ACHIEVEMENTS } from '../data/seedData';
import { Trophy } from 'lucide-react';
import ReferenceCard from '../components/ui/ReferenceCard';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Achievement } from '../types/neissr';

export default function AchievementsPage() {
  const { data: achievementsList = SEED_ACHIEVEMENTS } = useQuery({
    queryKey: ['public-achievements'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_ACHIEVEMENTS;
      const snap = await getDocs(collection(db, 'achievements'));
      if (snap.empty) return SEED_ACHIEVEMENTS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Achievement[];
      const published = items.filter((i) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_ACHIEVEMENTS;
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#C8102E] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Pride of NEISSR</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Student Achievements & Awards</h1>
          <p className="text-neutral-100 text-sm md:text-base max-w-2xl">
            Celebrating excellence across state pageants, sports tournaments, and social impact innovations.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {achievementsList.map((ach, idx) => {
          const gradients: Array<'blue' | 'purple' | 'pink' | 'emerald' | 'amber' | 'indigo' | 'crimson' | 'navy'> = [
            'amber',
            'crimson',
            'purple',
            'emerald',
            'blue',
            'indigo'
          ];
          const gradient = gradients[idx % gradients.length];

          return (
            <ReferenceCard
              key={ach.id}
              title={ach.title}
              subtitle={`Achiever: ${ach.achieverName}`}
              badge={`${ach.category} (${ach.year})`}
              gradient={gradient}
              icon={<Trophy className="w-8 h-8" />}
              buttonText="View Achievement"
              buttonLink="/student-life/achievements"
            >
              <div
                className="text-neutral-600 text-xs md:text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: ach.descriptionHtml }}
              />
            </ReferenceCard>
          );
        })}
      </section>
    </div>
  );
}
