import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { SEED_CLUBS, SEED_STUDENT_COUNCIL } from '../data/seedData';
import { ArrowRight } from 'lucide-react';

export default function StudentLifePage() {
  const { data: clubsList = SEED_CLUBS } = useQuery({
    queryKey: ['public-clubs'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_CLUBS;
      const snap = await getDocs(collection(db, 'clubs'));
      if (snap.empty) return SEED_CLUBS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
      const published = items.filter((i) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_CLUBS;
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Vibrant Campus Life</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Student Life at NEISSR</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            10 Active Student Clubs, 4 Academic Forums, Student Council, and rich cultural traditions.
          </p>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#C8102E] pl-3">
            Active Student Clubs (10 Clubs)
          </h2>
          <Link to="/student-life/clubs" className="text-xs font-bold text-[#003DA5] hover:underline">
            View All Clubs →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubsList.map((club: any) => (
            <div key={club.slug || club.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-3">
              <h3 className="font-serif font-bold text-xl text-neutral-900">{club.name}</h3>
              <p className="text-xs text-[#C8102E] font-semibold">{club.tagline}</p>
              <div className="text-xs text-neutral-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: club.descriptionHtml }} />
              <Link
                to={`/student-life/clubs/${club.slug || club.id}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#003DA5] hover:underline pt-2"
              >
                Club Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Student Council */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#003DA5] pl-3">
            NEISSR Student Council 2025-26
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-xs">
            {SEED_STUDENT_COUNCIL.map((mem, idx) => (
              <div key={idx} className="p-3 bg-[#FAF9F7] rounded-xl border border-neutral-200 space-y-1 text-center">
                <div className="text-[10px] font-bold text-[#C8102E] uppercase">{mem.role}</div>
                <div className="font-semibold text-neutral-900">{mem.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
