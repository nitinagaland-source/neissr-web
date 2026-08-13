import React from 'react';
import { SEED_PLACED_STUDENTS } from '../data/seedData';
import { Award, Briefcase, CheckCircle, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

interface PlacementRecord {
  id?: string;
  name?: string;
  fullName?: string;
  organisation?: string;
  role?: string;
  batchYear?: string;
  programme?: string;
  status?: string;
}

export default function PlacementPage() {
  const { data: placedStudents = SEED_PLACED_STUDENTS } = useQuery({
    queryKey: ['public-placements'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_PLACED_STUDENTS;
      const snap = await getDocs(collection(db, 'placements'));
      if (snap.empty) return SEED_PLACED_STUDENTS;
      const items = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.fullName || data.name || '',
          organisation: data.organisation || '',
          role: data.role || '',
          batchYear: data.batchYear || '',
          programme: data.programme || '',
          status: data.status,
        };
      }) as PlacementRecord[];
      const published = items.filter((i) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_PLACED_STUDENTS;
    },
  });
  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="relative bg-gradient-to-r from-[#010B1C] via-[#051C42] to-[#010B1C] text-white rounded-3xl p-8 md:p-12 shadow-2xl space-y-3 border border-[#C9A227]/30 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,61,165,0.4)_0%,transparent_60%)]" />
          <div className="relative text-xs uppercase font-bold text-[#E2C044] tracking-[0.2em]">Career Advancement Cell</div>
          <h1 className="relative font-sans font-black text-3xl md:text-5xl text-white tracking-tight">Placements & Career Pathways</h1>
          <p className="relative text-neutral-200 text-sm md:text-base max-w-2xl font-medium">
            Over 75% five-year average placement rate across international NGOs, government flagship schemes, UN agencies, and social enterprises.
          </p>
        </div>
      </section>

      {/* Stats Band */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="relative group bg-white p-8 rounded-3xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,61,165,0.12)] hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-[#C8102E] rounded-t-full opacity-80" />
            <div className="font-sans font-black text-5xl text-[#C8102E] tracking-tight">75%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 mt-3">5-Year Average Placement Rate</div>
          </div>
          <div className="relative group bg-white p-8 rounded-3xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,61,165,0.12)] hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-[#003DA5] rounded-t-full opacity-80" />
            <div className="font-sans font-black text-5xl text-[#003DA5] tracking-tight">80%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 mt-3">Outgoing Batch Placed Prior to Graduation</div>
          </div>
          <div className="relative group bg-white p-8 rounded-3xl border border-neutral-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,61,165,0.12)] hover:-translate-y-1.5 transition-all duration-300">
            <div className="absolute top-0 left-8 right-8 h-[2px] bg-[#C9A227] rounded-t-full opacity-80" />
            <div className="font-sans font-black text-4xl text-[#B38B12] tracking-tight">Rs. 35,000</div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-700 mt-3">Average Monthly Package</div>
          </div>
        </div>
      </section>

      {/* Recruiting Partners */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <h2 className="font-sans font-extrabold text-2xl text-neutral-900 border-l-4 border-[#003DA5] pl-3 tracking-tight">
            Key Recruiters & Field Partners
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-xs font-semibold text-neutral-700">
            <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200 text-center">Peace Channel</div>
            <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200 text-center">Caritas India</div>
            <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200 text-center">Catholic Relief Services</div>
            <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200 text-center">World Vision India</div>
            <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200 text-center">State Rural Livelihoods Mission (NSRLM)</div>
            <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200 text-center">Nagaland State AIDS Control Society</div>
            <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200 text-center">Pratham Education Foundation</div>
            <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200 text-center">Childline India</div>
          </div>
        </div>
      </section>

      {/* Placed Trainees Grid */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#C8102E] pl-3">
            Placed Trainees ({placedStudents.length} Alumni Records)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            {placedStudents.map((st, idx) => (
              <div key={idx} className="p-3 bg-[#FAF9F7] rounded-xl border border-neutral-200 text-center space-y-1">
                <div className="w-10 h-10 mx-auto rounded-full bg-[#003DA5] text-white font-serif font-bold flex items-center justify-center text-xs">
                  {(st.name || 'S').replace(/^(Mr\.|Ms\.)\s*/, '')[0] || 'S'}
                </div>
                <div className="font-semibold text-neutral-900 line-clamp-1">{st.name}</div>
                {st.organisation && (
                  <div className="text-[10px] text-neutral-500 line-clamp-1">{st.organisation}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
