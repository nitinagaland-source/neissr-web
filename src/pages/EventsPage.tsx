import React from 'react';
import { SEED_EVENTS } from '../data/seedData';
import { Calendar } from 'lucide-react';
import ReferenceCard from '../components/ui/ReferenceCard';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { EventItem } from '../types/neissr';

export default function EventsPage() {
  const { data: eventsList = SEED_EVENTS } = useQuery({
    queryKey: ['public-events'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_EVENTS;
      const snap = await getDocs(collection(db, 'events'));
      if (snap.empty) return SEED_EVENTS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as EventItem[];
      const published = items.filter((i) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_EVENTS;
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Events & Academic Calendar</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            Conferences, national conventions, peace knit festivals, and annual sports meets.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {eventsList.map((event, idx) => {
          const gradients: Array<'blue' | 'purple' | 'pink' | 'emerald' | 'amber' | 'indigo'> = [
            'indigo',
            'purple',
            'emerald',
            'blue',
            'pink',
            'amber'
          ];
          const gradient = gradients[idx % gradients.length];
          const eventDateStr = `${new Date(event.startAt).getDate()} ${new Date(event.startAt).toLocaleString('default', { month: 'short' })} ${new Date(event.startAt).getFullYear()}`;

          return (
            <ReferenceCard
              key={event.id}
              title={event.title}
              badge={event.venue}
              date={eventDateStr}
              gradient={gradient}
              icon={<Calendar className="w-8 h-8" />}
              buttonText="Event Details"
              buttonLink={`/events/${event.slug}`}
            >
              <div
                className="text-neutral-600 text-xs md:text-sm line-clamp-3 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: event.descriptionHtml }}
              />
            </ReferenceCard>
          );
        })}
      </section>
    </div>
  );
}
