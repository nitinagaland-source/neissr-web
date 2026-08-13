import React from 'react';
import { BookOpen, Award, CheckCircle } from 'lucide-react';
import ReferenceCard from '../components/ui/ReferenceCard';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export default function AcademicsPage() {
  const { data: academicsContent } = useQuery({
    queryKey: ['public-content-academics'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return null;
      const snap = await getDoc(doc(db, 'content', 'academics'));
      return snap.exists() ? snap.data() : null;
    },
  });

  const heading = academicsContent?.academicsHeading || "Academic Programmes";
  const bswHighlight = academicsContent?.bswDescription || "Launched in 2022 under Nagaland University. Formats students through core social work theory, human development, tribal social issues, concurrent fieldwork, and 10-day rural orientation camps.";
  const mswHighlight = academicsContent?.mswDescription || "Pioneering MSW degree established in 2014. Offers 4 specialized streams aligned with modern development challenges in North East India and beyond.";
  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md">
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{heading}</h1>
          <p className="text-neutral-200 text-sm md:text-base mt-2">
            Professional Social Work Degrees Affiliated to Nagaland University & Recognized by UGC 2(f).
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* BSW Box */}
        <ReferenceCard
          title="Bachelor of Social Work (BSW)"
          subtitle="3-Year Undergraduate Degree"
          badge="50 Seats"
          gradient="crimson"
          icon={<BookOpen className="w-8 h-8" />}
          buttonText="Explore BSW"
          buttonLink="/academics/bsw"
        >
          <div className="space-y-4 text-left">
            <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">
              {bswHighlight}
            </p>
            <ul className="space-y-2 text-xs text-neutral-700 pt-2 border-t border-neutral-100">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C8102E] shrink-0" /> Sanctioned Intake: 50 Seats
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C8102E] shrink-0" /> Eligibility: 10+2 / HSSLC passed in any stream
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#C8102E] shrink-0" /> Fieldwork: 2 Days per week concurrent placement
              </li>
            </ul>
          </div>
        </ReferenceCard>

        {/* MSW Box */}
        <ReferenceCard
          title="Master of Social Work (MSW)"
          subtitle="2-Year Postgraduate Degree"
          badge="4 Streams"
          gradient="navy"
          icon={<Award className="w-8 h-8" />}
          buttonText="Explore MSW"
          buttonLink="/academics/msw"
        >
          <div className="space-y-4 text-left">
            <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">
              {mswHighlight}
            </p>
            <div className="space-y-2 text-xs text-neutral-700 pt-2 border-t border-neutral-100">
              <div className="font-bold text-neutral-900">4 Specialisations Offered:</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 text-center font-medium">Community Development</div>
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 text-center font-medium">Youth Development</div>
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 text-center font-medium">Social Entrepreneurship</div>
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 text-center font-medium">Peace & Conflict</div>
              </div>
            </div>
          </div>
        </ReferenceCard>
      </section>
    </div>
  );
}
