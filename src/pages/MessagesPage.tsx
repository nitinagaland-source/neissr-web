import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export default function MessagesPage() {
  const { data: messagesContent } = useQuery({
    queryKey: ['public-content-messages'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return null;
      const snap = await getDoc(doc(db, 'content', 'messages'));
      return snap.exists() ? snap.data() : null;
    },
  });

  const bishopName = messagesContent?.bishopName || 'Most Rev. Dr. James Thoppil';
  const bishopTitle = messagesContent?.bishopTitle || 'Bishop of Kohima & Chairman, NEISSR';
  const bishopMessage = messagesContent?.bishopMessage || 'Education is the most powerful weapon which you can use to change the world. At NEISSR, we do not merely impart academic knowledge; we instill values of peace, service, and moral courage. North East India requires young leaders who understand community dynamics and are willing to build bridges across divides.';

  const principalName = messagesContent?.principalName || 'Dr. Fr. C.P. Anto';
  const principalTitle = messagesContent?.principalTitle || 'Founder & Principal, NEISSR';
  const principalMessage = messagesContent?.principalMessage || 'Welcome to NEISSR! Since our inception in 2014, our goal has been to redefine social work education by placing peacebuilding and community action at its core. Our trainees learn through immersion in village camps, agency internships, and rigorous academic inquiry. I invite you to join us on this transformative journey.';

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md">
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Leadership Messages</h1>
          <p className="text-neutral-200 text-sm md:text-base mt-2">
            Inspirational words from the Governing Body and Leadership of NEISSR.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
        {/* Bishop Message */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-4 border-b border-neutral-100 pb-4">
            <div className="w-16 h-16 rounded-full bg-[#C8102E] text-white font-serif font-bold text-2xl flex items-center justify-center">
              JT
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-neutral-900">{bishopName}</h2>
              <p className="text-xs text-[#C8102E] font-semibold uppercase">{bishopTitle}</p>
            </div>
          </div>
          <p className="text-neutral-700 text-sm md:text-base leading-relaxed italic">
            &quot;{bishopMessage}&quot;
          </p>
        </div>

        {/* Principal Message */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-4 border-b border-neutral-100 pb-4">
            <div className="w-16 h-16 rounded-full bg-[#003DA5] text-white font-serif font-bold text-2xl flex items-center justify-center">
              CA
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-neutral-900">{principalName}</h2>
              <p className="text-xs text-[#003DA5] font-semibold uppercase">{principalTitle}</p>
            </div>
          </div>
          <p className="text-neutral-700 text-sm md:text-base leading-relaxed italic">
            &quot;{principalMessage}&quot;
          </p>
        </div>
      </section>
    </div>
  );
}
