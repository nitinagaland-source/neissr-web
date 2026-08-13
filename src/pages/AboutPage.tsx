import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Award, Target, Eye, BookOpen } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

export default function AboutPage() {
  const { data: aboutContent } = useQuery({
    queryKey: ['public-content-about'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return null;
      const snap = await getDoc(doc(db, 'content', 'about'));
      return snap.exists() ? snap.data() : null;
    },
  });

  const heading = aboutContent?.aboutHeading || "North East Institute of Social Sciences and Research";
  const subheading = aboutContent?.aboutSubheading || "Nagaland's first dedicated Social Work institution, fostering research, peacebuilding, and professional social action since 2014.";
  const historyP1 = aboutContent?.historyP1 || "The North East Institute of Social Sciences and Research (NEISSR) was established in 2014 as a premier postgraduate institution affiliated to Nagaland University. Managed under the aegis of the Catholic Diocese of Kohima, NEISSR was founded to fulfill a critical void in specialized professional social work education and conflict resolution in North East India.";
  const historyP2 = aboutContent?.historyP2 || "In 2022, the institution expanded into its state-of-the-art Peace Centre campus at 7th Mile, Chümoukedima, Nagaland. In the same year, NEISSR launched its undergraduate Bachelor of Social Work (BSW) programme, offering an integrated 3-year academic pathway alongside its renowned MSW specialisations.";
  const vision = aboutContent?.vision || "To build a just, peaceful, and inclusive society through quality social work education, research, and transformative action in North East India.";
  const mission = aboutContent?.mission || "To nurture ethical social work professionals equipped with critical analysis, field exposure, peacebuilding skills, and community commitment.";
  return (
    <div className="py-12 bg-[#FAF9F7] space-y-16">
      {/* Banner */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-16 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10 space-y-4">
            <div className="inline-block bg-[#C8102E] text-white px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
              About NEISSR
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold">
              {heading}
            </h1>
            <p className="text-lg text-neutral-200 leading-relaxed font-light">
              {subheading}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Story */}
          <div className="lg:col-span-2 space-y-8 bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm">
            <div className="space-y-4">
              <h2 className="font-serif text-3xl font-bold text-neutral-900 border-l-4 border-[#C8102E] pl-4">
                Institutional History & Heritage
              </h2>
              <p className="text-neutral-700 leading-relaxed text-base">
                {historyP1}
              </p>
              <p className="text-neutral-700 leading-relaxed text-base">
                {historyP2}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-[#FAF9F7] rounded-2xl border border-neutral-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#003DA5] text-white flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-xl text-neutral-900">Our Vision</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {vision}
                </p>
              </div>

              <div className="p-6 bg-[#FAF9F7] rounded-2xl border border-neutral-200 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#C8102E] text-white flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-xl text-neutral-900">Our Mission</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {mission}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <h3 className="font-serif text-2xl font-bold text-neutral-900">Core Values</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C8102E]" /> Excellence in Knowledge & Action
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C8102E]" /> Compassion & Human Dignity
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C8102E]" /> Peacebuilding & Reconciliation
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#C8102E]" /> Inclusivity & Indigenous Pride
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-neutral-900 border-b border-neutral-200 pb-3">
                Key Institutional Facts
              </h3>
              <div className="space-y-3 text-xs text-neutral-700">
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Established</span>
                  <span className="font-semibold text-neutral-900">2014</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">Affiliation</span>
                  <span className="font-semibold text-neutral-900">Nagaland University</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">UGC Status</span>
                  <span className="font-semibold text-neutral-900">Section 2(f) Recognized</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">NAAC Rating</span>
                  <span className="font-semibold text-[#C8102E]">Grade B++ (2.98 CGPA)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-100">
                  <span className="text-neutral-500">AISHE Code</span>
                  <span className="font-semibold text-neutral-900">C-54342</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Location</span>
                  <span className="font-semibold text-neutral-900">Chümoukedima, Nagaland</span>
                </div>
              </div>
            </div>

            <div className="bg-[#003DA5] text-white p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#C9A227]">Leadership Messages</h3>
              <p className="text-xs text-neutral-200 leading-relaxed">
                Read inspirational messages from our Chairman, Most Rev. Dr. James Thoppil, and Principal, Dr. Fr. C.P. Anto.
              </p>
              <Link
                to="/about/messages"
                className="inline-block bg-white text-[#003DA5] px-5 py-2 rounded-full font-bold text-xs hover:bg-[#C9A227] hover:text-white transition-colors"
              >
                Read Messages →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
