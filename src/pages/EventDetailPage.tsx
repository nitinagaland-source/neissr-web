import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEED_EVENTS } from '../data/seedData';
import { formatDate } from '../lib/date';
import { ArrowLeft, MapPin, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { EventItem } from '../types/neissr';

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: event = SEED_EVENTS[0] } = useQuery({
    queryKey: ['public-event-detail', slug],
    queryFn: async () => {
      if (!isFirebaseConfigured) {
        return SEED_EVENTS.find((e) => e.slug === slug || e.id === slug) || SEED_EVENTS[0];
      }
      const snap = await getDocs(collection(db, 'events'));
      if (snap.empty) {
        return SEED_EVENTS.find((e) => e.slug === slug || e.id === slug) || SEED_EVENTS[0];
      }
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as EventItem[];
      const found = items.find((e) => e.slug === slug || e.id === slug);
      return found || SEED_EVENTS.find((e) => e.slug === slug || e.id === slug) || SEED_EVENTS[0];
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-8">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <Link
          to="/events"
          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-[#003DA5] mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#003DA5]">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-[#C8102E]" /> {formatDate(event.startAt)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#C8102E]" /> {event.venue}
            </span>
          </div>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-neutral-900">
            {event.title}
          </h1>

          <div
            className="text-neutral-700 text-sm leading-relaxed pt-4 border-t border-neutral-200"
            dangerouslySetInnerHTML={{ __html: event.descriptionHtml }}
          />
        </div>
      </section>
    </div>
  );
}
