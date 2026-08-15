import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { FileText, ChevronRight, Download } from 'lucide-react';

const SECTIONS = [
  { id: 'about', label: 'About IQAC' },
  { id: 'policy', label: 'Quality Policy' },
  { id: 'functions', label: 'Functions' },
  { id: 'composition', label: 'Composition' },
  { id: 'activities', label: 'Major Activities' },
  { id: 'meeting-minutes', label: 'Meeting Minutes' },
  { id: 'naac', label: 'NAAC Compliance' },
  { id: 'nirf', label: 'NIRF Reports' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'mandatory-disclosures', label: 'Mandatory Disclosures' },
  { id: 'feedback', label: 'Feedback' },
];

const SEED_DATA: Record<string, { 
  title: string; 
  contentHtml: string; 
  heroImageUrl?: string;
  documents: { name: string; url: string; size?: string }[] 
}> = {
  about: {
    title: 'About IQAC',
    heroImageUrl: 'https://res.cloudinary.com/qqfx65pe/image/upload/v1/placeholder-iqac-about',
    contentHtml: `<p>The Internal Quality Assurance Cell (IQAC) of NEISSR was established to ensure quality enhancement and sustenance in all academic and administrative activities of the institution.</p>
<h3>Mission</h3>
<p>To develop a system for conscious, consistent and catalytic improvement in the overall performance of the institution through quality culture institutionalization.</p>`,
    documents: [],
  },
  policy: {
    title: 'Quality Policy',
    contentHtml: `<p>NEISSR is committed to strenuous endeavour for enlightenment through a holistic educational process, grounded in spiritual values, monitored and enriched through self-evaluation and continuous improvement.</p>`,
    documents: [],
  },
  functions: {
    title: 'Functions',
    contentHtml: `<ul><li>Development and application of quality benchmarks</li><li>Creation of learner-centric environment</li><li>Feedback collection and analysis</li><li>Organization of workshops and seminars</li><li>Documentation and academic audit</li></ul>`,
    documents: [],
  },
  composition: { title: 'Composition', contentHtml: '<p>Members of IQAC comprise faculty, administration, students, and external stakeholders.</p>', documents: [] },
  activities: { title: 'Major Activities', contentHtml: '<p>IQAC conducts various quality enhancement activities throughout the academic year.</p>', documents: [] },
  'meeting-minutes': { title: 'Meeting Minutes', contentHtml: '<p>Minutes of IQAC meetings are available below.</p>', documents: [] },
  naac: { title: 'NAAC Compliance', contentHtml: '<p>NEISSR maintains compliance with NAAC accreditation standards.</p>', documents: [] },
  nirf: { title: 'NIRF Reports', contentHtml: '<p>Annual NIRF submissions and reports are documented here.</p>', documents: [] },
  'best-practices': { title: 'Best Practices', contentHtml: '<p>NEISSR has institutionalized several best practices in education and research.</p>', documents: [] },
  'mandatory-disclosures': { title: 'Mandatory Disclosures', contentHtml: '<p>As per UGC norms, the following information is disclosed to all stakeholders.</p>', documents: [] },
  feedback: { title: 'Feedback', contentHtml: '<p>NEISSR values feedback from all stakeholders. Please contact us with your suggestions.</p>', documents: [] },
};

interface SectionData {
  title: string;
  contentHtml: string;
  heroImageUrl?: string;
  documents: { name: string; url: string; size?: string }[];
}

export default function IQACPage() {
  const { section = 'about' } = useParams<{ section?: string }>();
  const navigate = useNavigate();

  const { data: content, isLoading } = useQuery<SectionData>({
    queryKey: ['iqac-section', section],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_DATA[section] || SEED_DATA.about;
      const snap = await getDoc(doc(db, 'iqac_sections', section));
      if (snap.exists()) return snap.data() as SectionData;
      return SEED_DATA[section] || SEED_DATA.about;
    },
  });

  const current = SECTIONS.find((s) => s.id === section) || SECTIONS[0];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Banner */}
      {content?.heroImageUrl && (
        <div className="w-full h-64 md:h-80 bg-gradient-to-r from-[#003DA5] to-[#0052CC] overflow-hidden relative">
          <img
            src={content.heroImageUrl}
            alt="IQAC"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003DA5]/80 to-transparent" />
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-neutral-600">
          <Link to="/" className="hover:text-[#003DA5] font-medium">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/iqac" className="hover:text-[#003DA5] font-medium">IQAC</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-800 font-semibold">{current.label}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex gap-8">
        {/* Sidebar */}
        <aside className="w-80 shrink-0 hidden md:block">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden sticky top-24">
            <div className="bg-[#003DA5] text-white px-6 py-4 font-serif">
              <h2 className="text-lg font-bold">IQAC</h2>
              <p className="text-xs text-blue-100 mt-1">Internal Quality Assurance Cell</p>
            </div>
            <nav className="divide-y divide-neutral-100">
              {SECTIONS.map((s) => (
                <Link
                  key={s.id}
                  to={`/iqac/${s.id}`}
                  className={`block px-6 py-3.5 text-sm font-medium transition-all ${
                    section === s.id
                      ? 'bg-blue-50 text-[#003DA5] border-l-4 border-[#003DA5]'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-[#003DA5]'
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-[#003DA5] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-lg p-8 md:p-12">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#003DA5] mb-2">
                {content?.title}
              </h1>
              <div className="w-16 h-1 bg-[#C8102E] rounded mb-8" />

              <div
                className="prose prose-base max-w-none text-neutral-700 leading-relaxed
                  prose-headings:text-[#003DA5] prose-headings:font-serif prose-headings:font-bold
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:mb-5 prose-ul:my-5 prose-li:text-neutral-700"
                dangerouslySetInnerHTML={{ __html: content?.contentHtml || '' }}
              />

              {content?.documents && content.documents.length > 0 && (
                <div className="mt-12 pt-8 border-t border-neutral-200">
                  <h3 className="text-lg font-serif font-bold text-[#003DA5] mb-6">Downloads</h3>
                  <div className="grid gap-3">
                    {content.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-[#003DA5] hover:bg-blue-50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-[#C8102E] shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-neutral-800 group-hover:text-[#003DA5]">
                              {doc.name}
                            </p>
                            {doc.size && <p className="text-xs text-neutral-500">{doc.size}</p>}
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-[#003DA5] group-hover:scale-110 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
