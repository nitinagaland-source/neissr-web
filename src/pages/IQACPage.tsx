import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { FileText, ChevronRight, Download, ExternalLink } from 'lucide-react';

const SECTIONS = [
  { id: 'about', label: 'About IQAC' },
  { id: 'policy', label: 'Quality Policy' },
  { id: 'functions', label: 'Functions' },
  { id: 'composition', label: 'Composition' },
  { id: 'activities', label: 'Major Activities' },
  { id: 'meeting-minutes', label: 'Meeting Minutes' },
  { id: 'naac', label: 'NAAC Documents' },
  { id: 'nirf', label: 'NIRF Reports' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'mandatory-disclosures', label: 'Mandatory Disclosures' },
  { id: 'feedback', label: 'Feedback' },
];

const SEED: Record<string, { title: string; contentHtml: string; documents: { name: string; url: string; size?: string }[] }> = {
  about: {
    title: 'About IQAC',
    contentHtml: `<p>The Internal Quality Assurance Cell (IQAC) of NEISSR was established to ensure quality enhancement and sustenance in all academic and administrative activities of the institution.</p>
<p>The IQAC strives to channelize efforts and measures of the institution towards academic excellence through systematic and structured quality enhancement strategies.</p>
<h3>Objectives</h3>
<ul>
<li>To develop a system for conscious, consistent and catalytic improvement in the overall performance of the institution.</li>
<li>To promote measures for institutional functioning towards quality enhancement through internalization of quality culture and institutionalization of best practices.</li>
<li>To ensure timely, efficient and progressive performance of academic, administrative and financial tasks.</li>
</ul>`,
    documents: [],
  },
  policy: {
    title: 'Quality Policy',
    contentHtml: `<p>NEISSR is committed to strenuous endeavour for enlightenment through a holistic educational process, grounded in spiritual values, monitored and enriched through self-evaluation and continuous improvement.</p>
<p>The institution strives to nurture intellectually competent, socially responsible, and morally grounded individuals by fostering a culture of excellence in teaching, learning, research, and governance.</p>`,
    documents: [],
  },
  functions: {
    title: 'Functions',
    contentHtml: `<ul>
<li>Development and application of quality benchmarks and parameters for various academic and administrative activities of the institution.</li>
<li>Facilitating the creation of a learner-centric environment conducive for quality education and curriculum development.</li>
<li>Collection and analysis of feedback from all stakeholders on quality-related institutional processes.</li>
<li>Dissemination of information on the various quality parameters of higher education.</li>
<li>Organization of inter and intra institutional workshops and seminars on quality-related themes.</li>
<li>Documentation of various programmes and activities leading to quality improvement.</li>
<li>Acting as a nodal agency of the institution for coordinating quality-related activities including adoption and dissemination of best practices.</li>
<li>Development and maintenance of institutional database through MIS for the purpose of maintaining and enhancing institutional quality.</li>
<li>Periodical conduct of Academic and Administrative Audit.</li>
</ul>`,
    documents: [],
  },
  composition: {
    title: 'Composition',
    contentHtml: `<p>The IQAC of NEISSR comprises of the following members:</p>
<h3>Chairperson</h3>
<p>The Principal / Director of the Institution</p>
<h3>Senior Administrative Officers</h3>
<p>Members from the senior administrative staff of the institution.</p>
<h3>Faculty Representatives</h3>
<p>Senior faculty members from various departments, nominated by the Chairperson.</p>
<h3>Management Representatives</h3>
<p>Representatives from the managing body of the institution.</p>
<h3>Student Representatives</h3>
<p>Student Council President and Vice President.</p>
<h3>Alumni Representative</h3>
<p>One representative from the Alumni Association.</p>
<h3>Industry / Employer Representative</h3>
<p>An expert / industrialist from the community.</p>`,
    documents: [],
  },
  activities: {
    title: 'Major Activities',
    contentHtml: `<p>The IQAC undertakes the following major activities to ensure quality enhancement:</p>
<ul>
<li>Academic and administrative audits</li>
<li>Organization of workshops and seminars on quality enhancement</li>
<li>Feedback collection and analysis from students, faculty and stakeholders</li>
<li>Preparation of Annual Quality Assurance Reports (AQAR)</li>
<li>Coordination of NAAC accreditation activities</li>
<li>Monitoring of teaching-learning processes</li>
<li>Organizing Faculty Development Programmes</li>
<li>Facilitating industry-academia interactions</li>
</ul>`,
    documents: [],
  },
  'meeting-minutes': {
    title: 'Meeting Minutes',
    contentHtml: `<p>Minutes of IQAC meetings are maintained as per UGC and NAAC guidelines. The IQAC meets at least once every quarter to review quality initiatives and plan future activities.</p>
<p>Download the meeting minutes from the documents section below.</p>`,
    documents: [],
  },
  naac: {
    title: 'NAAC Documents',
    contentHtml: `<p>NEISSR has been accredited by the National Assessment and Accreditation Council (NAAC) with B++ grade. The following documents are available for download.</p>`,
    documents: [],
  },
  nirf: {
    title: 'NIRF Reports',
    contentHtml: `<p>NEISSR participates in the National Institutional Ranking Framework (NIRF) annually. The NIRF data submission reports are available for download below.</p>`,
    documents: [],
  },
  'best-practices': {
    title: 'Best Practices',
    contentHtml: `<p>NEISSR has institutionalized several best practices that contribute to academic excellence, social responsibility, and holistic development of students.</p>
<h3>Practice 1: Community Immersion Programme</h3>
<p>Students undergo intensive field placements in rural and urban communities, gaining hands-on experience in social work practice.</p>
<h3>Practice 2: Research-Integrated Teaching</h3>
<p>Faculty members integrate their research findings into classroom teaching, enriching the academic experience of students.</p>`,
    documents: [],
  },
  'mandatory-disclosures': {
    title: 'Mandatory Disclosures',
    contentHtml: `<p>As per the directives of UGC and NAAC, NEISSR makes the following mandatory disclosures available to all stakeholders.</p>
<p>Please refer to the documents below for all mandatory disclosure information.</p>`,
    documents: [],
  },
  feedback: {
    title: 'Feedback',
    contentHtml: `<p>NEISSR values feedback from all stakeholders. Your feedback helps us improve the quality of education and services.</p>
<p>Please use the forms below to submit your feedback.</p>
<h3>Student Feedback</h3>
<p>Students are requested to submit feedback on curriculum, teaching-learning processes, and campus facilities.</p>
<h3>Faculty Feedback</h3>
<p>Faculty members may submit feedback on curriculum design, administrative support, and research facilities.</p>`,
    documents: [],
  },
};

interface IQACSection {
  title: string;
  contentHtml: string;
  documents: { name: string; url: string; size?: string }[];
}

export default function IQACPage() {
  const { section = 'about' } = useParams<{ section?: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<IQACSection>({
    queryKey: ['iqac-section', section],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED[section] || SEED.about;
      const snap = await getDoc(doc(db, 'iqac_sections', section));
      if (snap.exists()) return snap.data() as IQACSection;
      return SEED[section] || SEED.about;
    },
  });

  const current = SECTIONS.find((s) => s.id === section) || SECTIONS[0];
  const content = data || SEED[section] || SEED.about;

  return (
    <div className="bg-[#FAF9F7] min-h-screen">
      {/* Page Hero */}
      <div className="bg-[#003DA5] text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-blue-200 mb-2">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span>IQAC</span>
            <ChevronRight className="w-3 h-3" />
            <span>{current.label}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif">
            IQAC — Internal Quality Assurance Cell
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            North East Institute of Social Sciences and Research, Dimapur
          </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden sticky top-20">
            <div className="bg-[#003DA5] text-white px-4 py-3">
              <h2 className="font-bold text-sm uppercase tracking-wider">IQAC</h2>
            </div>
            <nav className="py-2">
              {SECTIONS.map((s) => (
                <Link
                  key={s.id}
                  to={`/iqac/${s.id}`}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    section === s.id
                      ? 'bg-[#003DA5]/10 text-[#003DA5] font-semibold border-l-4 border-[#003DA5]'
                      : 'text-neutral-700 hover:bg-neutral-50 hover:text-[#003DA5]'
                  }`}
                >
                  {s.label}
                  {section === s.id && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 md:p-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-[#003DA5] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold font-serif text-[#003DA5] border-b-2 border-[#003DA5] pb-2 mb-6">
                  {content.title}
                </h2>

                {/* Rich text content */}
                <div
                  className="prose prose-sm max-w-none text-neutral-700 leading-relaxed
                    prose-headings:text-[#C8102E] prose-headings:font-bold
                    prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
                    prose-p:mb-4 prose-ul:pl-5 prose-ul:mb-4
                    prose-li:mb-1 prose-li:text-neutral-700"
                  dangerouslySetInnerHTML={{ __html: content.contentHtml }}
                />

                {/* Documents */}
                {content.documents && content.documents.length > 0 && (
                  <div className="mt-8 border-t border-neutral-100 pt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">
                      Downloads
                    </h3>
                    <div className="space-y-2">
                      {content.documents.map((doc, i) => (
                        <a
                          key={i}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-[#003DA5] hover:bg-blue-50/30 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-[#C8102E] shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-neutral-800 group-hover:text-[#003DA5]">
                                {doc.name}
                              </p>
                              {doc.size && (
                                <p className="text-xs text-neutral-400">{doc.size}</p>
                              )}
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-[#003DA5] shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback section — special case */}
                {section === 'feedback' && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-sm text-neutral-600 mb-3">
                      To submit feedback, please contact us at:
                    </p>
                    <a
                      href="mailto:contact.neissr@gmail.com"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#003DA5] hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      contact.neissr@gmail.com
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
