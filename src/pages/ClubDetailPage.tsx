import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEED_CLUBS } from '../data/seedData';
import { ArrowLeft, Users, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { Club } from '../types/neissr';

export default function ClubDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: club = SEED_CLUBS[0] } = useQuery({
    queryKey: ['public-club-detail', slug],
    queryFn: async () => {
      if (!isFirebaseConfigured) {
        return SEED_CLUBS.find((c) => c.slug === slug || c.id === slug) || SEED_CLUBS[0];
      }
      const snap = await getDocs(collection(db, 'clubs'));
      if (snap.empty) {
        return SEED_CLUBS.find((c) => c.slug === slug || c.id === slug) || SEED_CLUBS[0];
      }
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Club[];
      const found = items.find((c) => c.slug === slug || c.id === slug);
      return found || SEED_CLUBS.find((c) => c.slug === slug || c.id === slug) || SEED_CLUBS[0];
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-8">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <Link
          to="/student-life/clubs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-[#003DA5] mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Clubs
        </Link>

        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">NEISSR Student Club</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{club.name}</h1>
          <p className="text-neutral-200 text-sm md:text-base">{club.tagline}</p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#C8102E] pl-3">
            About {club.name}
          </h2>
          <div className="text-neutral-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: club.descriptionHtml }} />
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-neutral-900 border-b border-neutral-100 pb-2">
              Office Bearers
            </h3>
            <div className="space-y-2 text-xs">
              {(club.officeBearers ?? []).map((ob, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">{ob.role}</span>
                  <span className="font-semibold text-neutral-900">{ob.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

