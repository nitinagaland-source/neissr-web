import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { FileText, ChevronRight, Loader2, Mail } from 'lucide-react';

const SECTIONS = [
  { id: 'about', label: 'About IQAC' },
  { id: 'policy', label: 'Internal Quality Assurance Policy' },
  { id: 'financial-support', label: 'Policy on Financial Support' },
  { id: 'functions', label: 'Functions' },
  { id: 'composition', label: 'Composition' },
  { id: 'activities', label: 'Major Activities' },
  { id: 'meeting-minutes', label: 'Meeting Minutes' },
  { id: 'naac', label: 'NAAC Compliance' },
  { id: 'autonomous', label: 'Autonomous Undertaking' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'institutional-distinctiveness', label: 'Institutional Distinctiveness' },
  { id: 'feedback', label: 'Feedback from Stakeholders' },
  { id: 'program-outcomes', label: 'Program and Course Outcomes' },
  { id: 'ethics-manual', label: 'Human Values & Professional Ethics Manual' },
  { id: 'sss-poster', label: 'Information Poster on SSS' },
  { id: 'affiliation', label: 'Affiliation' },
  { id: 'aqar', label: 'AQAR' },
  { id: 'nirf', label: 'NIRF Reports' },
  { id: 'academic-calendar', label: 'Academic Calendar' },
  { id: 'annual-reports', label: 'College Annual Reports' },
  { id: 'mandatory-disclosures', label: 'Mandatory Disclosures' },
];

const BORDER_COLORS: Record<string, string> = {
  green: 'border-l-green-500 bg-green-50',
  orange: 'border-l-orange-500 bg-orange-50',
  blue: 'border-l-blue-500 bg-blue-50',
  red: 'border-l-red-500 bg-red-50',
  purple: 'border-l-purple-500 bg-purple-50',
  amber: 'border-l-amber-500 bg-amber-50',
};

const HEADER_COLORS: Record<string, string> = {
  green: 'text-green-700',
  orange: 'text-orange-700',
  blue: 'text-blue-700',
  red: 'text-red-700',
  purple: 'text-purple-700',
  amber: 'text-amber-700',
};

interface DocumentItem {
  name: string;
  url: string;
  size?: string;
}

interface Block {
  title: string;
  color: string;
  items: DocumentItem[];
}

interface SectionData {
  title: string;
  introHtml?: string;
  blocks: Block[];
  contactEmail?: string;
}

const SEED_DATA: Record<string, SectionData> = {
  about: {
    title: 'About IQAC',
    introHtml: `<p>The Internal Quality Assurance Cell (IQAC) of NEISSR was established to ensure quality enhancement and sustenance in all academic and administrative activities of the institution.</p>
<p>The IQAC channelizes efforts and measures of the institution towards academic excellence through systematic and structured quality enhancement strategies, guided by the norms of the National Assessment and Accreditation Council (NAAC).</p>`,
    blocks: [],
    contactEmail: 'iqac.neissr@gmail.com',
  },
  policy: {
    title: 'Internal Quality Assurance Policy',
    introHtml: '<p>NEISSR is committed to strenuous endeavour for enlightenment through a holistic educational process, grounded in spiritual values, monitored and enriched through self-evaluation and continuous improvement.</p>',
    blocks: [{ title: 'POLICY DOCUMENTS', color: 'green', items: [] }],
  },
  'financial-support': {
    title: 'Policy on Financial Support',
    introHtml: '<p>NEISSR provides various forms of financial support to students and faculty to encourage academic and research excellence.</p>',
    blocks: [{ title: 'POLICY DOCUMENTS', color: 'blue', items: [] }],
  },
  functions: {
    title: 'Functions',
    introHtml: '<p>The IQAC performs the following key functions to ensure quality enhancement:</p>',
    blocks: [{ title: 'FUNCTIONS DOCUMENT', color: 'green', items: [] }],
  },
  composition: {
    title: 'Composition',
    introHtml: '<p>The IQAC comprises faculty representatives, administrative officers, management members, student representatives, alumni, and industry experts.</p>',
    blocks: [{ title: 'COMMITTEE COMPOSITION', color: 'orange', items: [] }],
  },
  activities: {
    title: 'Major Activities',
    introHtml: '<p>The IQAC undertakes various quality enhancement activities throughout the academic year.</p>',
    blocks: [{ title: 'ACTIVITY REPORTS', color: 'blue', items: [] }],
  },
  'meeting-minutes': {
    title: 'Meeting Minutes',
    introHtml: '<p>Minutes of IQAC meetings are maintained as per UGC and NAAC guidelines. The IQAC meets at least once every quarter.</p>',
    blocks: [
      { title: '2025-26 MEETINGS', color: 'green', items: [] },
      { title: '2024-25 MEETINGS', color: 'blue', items: [] },
      { title: '2023-24 MEETINGS', color: 'orange', items: [] },
    ],
  },
  naac: {
    title: 'NAAC Compliance',
    introHtml: '<p>NEISSR has been accredited by the National Assessment and Accreditation Council (NAAC). The following documents demonstrate our compliance with NAAC standards.</p>',
    blocks: [
      { title: 'SELF STUDY REPORT (SSR)', color: 'green', items: [] },
      { title: 'PEER TEAM REPORT', color: 'orange', items: [] },
      { title: 'CERTIFICATES', color: 'blue', items: [] },
    ],
  },
  autonomous: {
    title: 'Autonomous Undertaking',
    introHtml: '<p>Documents relating to the autonomous status of NEISSR.</p>',
    blocks: [{ title: 'DOCUMENTS', color: 'blue', items: [] }],
  },
  'best-practices': {
    title: 'Best Practices',
    introHtml: '<p>NEISSR has institutionalized several best practices that contribute to academic excellence and social responsibility.</p>',
    blocks: [
      { title: 'PRACTICE 1', color: 'green', items: [] },
      { title: 'PRACTICE 2', color: 'blue', items: [] },
    ],
  },
  'institutional-distinctiveness': {
    title: 'Institutional Distinctiveness',
    introHtml: '<p>Documents highlighting NEISSR institutional distinctiveness.</p>',
    blocks: [{ title: 'DOCUMENTS', color: 'purple', items: [] }],
  },
  feedback: {
    title: 'Feedback from Stakeholders',
    introHtml: '<p>NEISSR values feedback from students, faculty, alumni, employers, and parents to continuously improve quality.</p>',
    blocks: [
      { title: 'STUDENT FEEDBACK', color: 'blue', items: [] },
      { title: 'FACULTY FEEDBACK', color: 'green', items: [] },
      { title: 'ALUMNI FEEDBACK', color: 'orange', items: [] },
      { title: 'EMPLOYER FEEDBACK', color: 'purple', items: [] },
    ],
    contactEmail: 'iqac.neissr@gmail.com',
  },
  'program-outcomes': {
    title: 'Program and Course Outcomes',
    introHtml: '<p>Documented program and course outcomes for each programme offered at NEISSR.</p>',
    blocks: [
      { title: 'BSW PROGRAMME', color: 'blue', items: [] },
      { title: 'MSW PROGRAMME', color: 'green', items: [] },
    ],
  },
  'ethics-manual': {
    title: 'Human Values & Professional Ethics Manual',
    introHtml: '<p>Documents relating to values-based education and professional ethics at NEISSR.</p>',
    blocks: [{ title: 'MANUAL', color: 'purple', items: [] }],
  },
  'sss-poster': {
    title: 'Information Poster on SSS',
    introHtml: '<p>Student Satisfaction Survey (SSS) information and reports.</p>',
    blocks: [{ title: 'POSTERS', color: 'amber', items: [] }],
  },
  affiliation: {
    title: 'Affiliation',
    introHtml: '<p>NEISSR affiliation and accreditation documents.</p>',
    blocks: [{ title: 'CERTIFICATES', color: 'green', items: [] }],
  },
  aqar: {
    title: 'AQAR (Annual Quality Assurance Report)',
    introHtml: '<p>Annual Quality Assurance Reports submitted to NAAC.</p>',
    blocks: [
      { title: 'AQAR 2024-25', color: 'green', items: [] },
      { title: 'AQAR 2023-24', color: 'blue', items: [] },
      { title: 'AQAR 2022-23', color: 'orange', items: [] },
    ],
  },
  nirf: {
    title: 'NIRF Reports',
    introHtml: '<p>National Institutional Ranking Framework (NIRF) submissions for NEISSR.</p>',
    blocks: [
      { title: 'NIRF 2026', color: 'green', items: [] },
      { title: 'NIRF 2025', color: 'blue', items: [] },
      { title: 'NIRF 2024', color: 'orange', items: [] },
      { title: 'NIRF 2023', color: 'purple', items: [] },
    ],
  },
  'academic-calendar': {
    title: 'Academic Calendar',
    introHtml: '<p>Academic calendars for various academic years.</p>',
    blocks: [
      { title: '2025-26', color: 'green', items: [] },
      { title: '2024-25', color: 'blue', items: [] },
    ],
  },
  'annual-reports': {
    title: 'College Annual Reports',
    introHtml: '<p>Comprehensive annual reports documenting institutional activities and achievements.</p>',
    blocks: [
      { title: '2024-25', color: 'green', items: [] },
      { title: '2023-24', color: 'blue', items: [] },
    ],
  },
  'mandatory-disclosures': {
    title: 'Mandatory Disclosures',
    introHtml: '<p>As per directives of UGC and NAAC, the following mandatory disclosures are made available to all stakeholders.</p>',
    blocks: [{ title: 'DISCLOSURE DOCUMENTS', color: 'red', items: [] }],
  },
};

export default function IQACPage() {
  const { section = 'about' } = useParams<{ section?: string }>();

  const { data: detail, isLoading } = useQuery<SectionData>({
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
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#003DA5] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-blue-200 mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/iqac" className="hover:text-white">IQAC</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">{current.label}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-serif font-bold">
            IQAC — Internal Quality Assurance Cell
          </h1>
          <p className="text-blue-100 text-sm md:text-base mt-2">
            North East Institute of Social Sciences and Research
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="flex-1 min-w-0 order-2 lg:order-1">
          {/* Title */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#003DA5] mb-2">
              {detail?.title || current.label}
            </h2>
            <div className="w-24 h-1 bg-[#C8102E] rounded" />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#003DA5] animate-spin" />
            </div>
          ) : (
            <>
              {/* Intro */}
              {detail?.introHtml && (
                <div
                  className="prose prose-base max-w-none text-neutral-700 leading-relaxed mb-8
                    prose-p:mb-4 prose-headings:text-[#003DA5] prose-headings:font-serif prose-headings:font-bold
                    prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                    prose-ul:my-4 prose-li:text-neutral-700"
                  dangerouslySetInnerHTML={{ __html: detail.introHtml }}
                />
              )}

              {/* Blocks */}
              {detail?.blocks && detail.blocks.length > 0 && (
                <div className="space-y-6">
                  {detail.blocks.map((block, bi) => (
                    <div
                      key={bi}
                      className={`border-l-4 ${BORDER_COLORS[block.color] || BORDER_COLORS.blue} rounded-r-lg p-6 shadow-sm`}
                    >
                      <h3
                        className={`text-sm font-bold uppercase tracking-wider mb-4 ${HEADER_COLORS[block.color] || HEADER_COLORS.blue}`}
                      >
                        {block.title}
                      </h3>

                      {block.items && block.items.length > 0 ? (
                        <div className="space-y-2">
                          {block.items.map((item, ii) => (
                            <div
                              key={ii}
                              className="flex items-center justify-between py-3 px-4 bg-white rounded-md border border-neutral-100 hover:border-[#003DA5] transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <FileText className="w-4 h-4 text-[#C8102E] shrink-0" />
                                <span className="text-sm font-medium text-neutral-800 truncate">
                                  {item.name}
                                </span>
                              </div>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#003DA5] hover:bg-[#002d7a] text-white text-xs font-semibold rounded shrink-0 ml-3 transition-colors"
                              >
                                Click Here
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-neutral-500 italic">No documents added yet.</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Contact */}
              {detail?.contactEmail && (
                <div className="mt-10 pt-6 border-t border-neutral-200 flex items-center gap-2 text-sm text-neutral-600">
                  <Mail className="w-4 h-4 text-[#003DA5]" />
                  <span>For further queries, please contact:</span>
                  <a
                    href={`mailto:${detail.contactEmail}`}
                    className="text-[#003DA5] font-semibold underline"
                  >
                    {detail.contactEmail}
                  </a>
                </div>
              )}
            </>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 order-1 lg:order-2">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden lg:sticky lg:top-24">
            <div className="bg-[#003DA5] text-white px-5 py-4">
              <h3 className="font-serif font-bold text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                IQAC
              </h3>
            </div>
            <nav className="max-h-[70vh] overflow-y-auto divide-y divide-neutral-100">
              {SECTIONS.map((s) => (
                <Link
                  key={s.id}
                  to={`/iqac/${s.id}`}
                  className={`block px-5 py-3 text-sm transition-colors ${
                    section === s.id
                      ? 'bg-blue-50 text-[#003DA5] font-semibold border-l-4 border-[#C8102E]'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-[#003DA5]'
                  }`}
                >
                  {s.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
