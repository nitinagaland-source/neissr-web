import React from 'react';
import { Building, BookOpen, Shield, Wifi } from 'lucide-react';
import ReferenceCard from '../components/ui/ReferenceCard';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export default function InfrastructurePage() {
  const { data: infraContent } = useQuery({
    queryKey: ['public-content-infrastructure'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return null;
      const snap = await getDoc(doc(db, 'content', 'infrastructure'));
      return snap.exists() ? snap.data() : null;
    },
  });

  const heading = infraContent?.infraHeading || "Campus Infrastructure & Facilities";
  const description = infraContent?.infraDescription || "Modern educational facilities at the Peace Centre designed for academic excellence, peace studies, and community action.";

  const facilities = [
    {
      title: 'Peace Centre Campus',
      subtitle: 'Bishop Abraham Hall',
      icon: <Building className="w-8 h-8" />,
      description: infraContent?.campusOverview || 'State-of-the-art campus featuring multi-purpose auditorium, seminar halls, and smart audio-visual conference suites.',
      gradient: 'blue' as const
    },
    {
      title: 'Peace Library',
      subtitle: 'Digital Research Lab',
      icon: <BookOpen className="w-8 h-8" />,
      description: infraContent?.libraryDescription || 'Houses thousands of social work reference volumes, journals, UGC INFLIBNET access, and high-speed internet work terminals.',
      gradient: 'purple' as const
    },
    {
      title: 'Hostels & Accommodation',
      subtitle: 'Counseling & Practicum Unit',
      icon: <Shield className="w-8 h-8" />,
      description: infraContent?.hostelInfo || 'Dedicated residential hostels with security, study halls, mess facilities, and peer-support spaces.',
      gradient: 'pink' as const
    },
    {
      title: 'Campus Wi-Fi & IT Lab',
      subtitle: 'Fiber-Optic Connectivity',
      icon: <Wifi className="w-8 h-8" />,
      description: infraContent?.labDescription || 'Fiber-optic Wi-Fi network enabling research databases, virtual international guest lectures, and hybrid workshops.',
      gradient: 'emerald' as const
    }
  ];

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">7th Mile Chümoukedima</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{heading}</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            {description}
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {facilities.map((fac, idx) => (
          <ReferenceCard
            key={idx}
            title={fac.title}
            subtitle={fac.subtitle}
            gradient={fac.gradient}
            icon={fac.icon}
            buttonText="Learn More"
            buttonLink="/about"
          >
            <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">
              {fac.description}
            </p>
          </ReferenceCard>
        ))}
      </section>
    </div>
  );
}
