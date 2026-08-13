import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { SEED_FACULTY } from '../data/seedData';
import { ArrowLeft, Mail, BookOpen, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { FacultyMember } from '../types/neissr';

export default function FacultyProfilePage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: member = SEED_FACULTY[0] } = useQuery({
    queryKey: ['faculty-member', slug],
    queryFn: async () => {
      if (!isFirebaseConfigured) {
        return SEED_FACULTY.find((f) => f.slug === slug || f.id === slug) || SEED_FACULTY[0];
      }
      const snap = await getDocs(collection(db, 'faculty'));
      if (snap.empty) {
        return SEED_FACULTY.find((f) => f.slug === slug || f.id === slug) || SEED_FACULTY[0];
      }
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FacultyMember[];
      const found = items.find((f) => f.slug === slug || f.id === slug);
      return found || SEED_FACULTY.find((f) => f.slug === slug || f.id === slug) || SEED_FACULTY[0];
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-8">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <Link
          to="/faculty"
          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-[#003DA5] mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Faculty Directory
        </Link>

        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-neutral-200">
            <div className="w-20 h-20 rounded-full bg-[#003DA5] text-white font-serif font-bold text-3xl flex items-center justify-center border-4 border-[#C9A227]">
              {member.fullName
                .split(' ')
                .filter((n) => !n.includes('.') && n.length > 1)
                .slice(0, 2)
                .map((n) => n[0])
                .join('') || 'FD'}
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900">
                {member.fullName}
              </h1>
              <p className="text-sm font-semibold text-[#C8102E]">{member.designation}</p>
              <p className="text-xs text-neutral-500 mt-0.5">Department: {member.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-700">
            <div className="p-4 bg-[#FAF9F7] rounded-2xl border border-neutral-200 space-y-2">
              <div className="font-bold text-neutral-900 flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-[#003DA5]" /> Qualifications
              </div>
              <p>{member.qualifications.join(' • ')}</p>
            </div>

            <div className="p-4 bg-[#FAF9F7] rounded-2xl border border-neutral-200 space-y-2">
              <div className="font-bold text-neutral-900 flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-[#C8102E]" /> Contact Information
              </div>
              <p>{member.email || 'contact.neissr@gmail.com'}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <h2 className="font-serif text-xl font-bold text-neutral-900">Professional Bio</h2>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {member.fullName} is an integral member of the NEISSR community, contributing to academic instruction, field practicum supervision, student mentoring, and institutional research initiatives in Nagaland.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
