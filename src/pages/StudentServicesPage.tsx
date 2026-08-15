import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

// Convert any Google Drive share URL to a proper view URL
function getViewUrl(url: string): string {
  if (!url) return url;
  // Google Drive: convert /view or /edit to /preview for PDF viewing
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
}

function getOpenUrl(url: string): string {
  if (!url) return url;
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/view`;
  }
  return url;
}
import {
  GraduationCap, MessageCircle, Shield, ClipboardList,
  Heart, Users, BookOpen, Briefcase, ChevronRight,
  Loader2, Mail, FileText
} from 'lucide-react';

const SERVICES = [
  { id: 'scholarship', label: 'Scholarship', icon: GraduationCap },
  { id: 'counselling', label: 'Counselling Centre', icon: MessageCircle },
  { id: 'anti-ragging', label: 'Anti-Ragging Committee', icon: Shield },
  { id: 'grievance', label: 'Student Grievance Redressal', icon: ClipboardList },
  { id: 'welfare', label: 'Student Welfare Committee', icon: Heart },
  { id: 'womens-cell', label: "Women's Empowerment Cell", icon: Users },
  { id: 'internal-complaints', label: 'Internal Complaints Committee', icon: Shield },
  { id: 'alumni', label: 'Alumni Association', icon: Users },
  { id: 'library', label: 'Library', icon: BookOpen },
  { id: 'placement', label: 'Placement Cell', icon: Briefcase },
  { id: 'coaching', label: 'Coaching Centre', icon: BookOpen },
  { id: 'health-care', label: 'Health Care', icon: Heart },
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

interface ServiceData {
  title: string;
  introHtml?: string;
  blocks: Block[];
  contactEmail?: string;
}

const SEED_DATA: Record<string, ServiceData> = {
  scholarship: {
    title: 'Scholarship',
    introHtml: '<p>NEISSR offers merit-based and need-based scholarships for deserving students. Financial constraints should never hinder a quality education.</p>',
    blocks: [
      { title: 'AVAILABLE SCHOLARSHIPS', color: 'blue', items: [] },
      { title: 'HOW TO APPLY', color: 'green', items: [] },
    ],
    contactEmail: 'scholarship.neissr@gmail.com',
  },
  'anti-ragging': {
    title: 'Anti-Ragging Committee',
    introHtml: '<p>NEISSR has a zero-tolerance policy against ragging. The Anti-Ragging Committee is constituted as per UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions, 2009.</p>',
    blocks: [
      { title: 'REGULATIONS', color: 'green', items: [] },
      { title: 'COMMITTEES', color: 'orange', items: [] },
      { title: 'REPORTING', color: 'red', items: [] },
    ],
    contactEmail: 'antiragging.neissr@gmail.com',
  },
  counselling: {
    title: 'Counselling Centre',
    introHtml: '<p>Professional mental health support and career guidance for all students.</p>',
    blocks: [
      { title: 'SERVICES OFFERED', color: 'blue', items: [] },
      { title: 'RESOURCES', color: 'purple', items: [] },
    ],
    contactEmail: 'counselling.neissr@gmail.com',
  },
  grievance: {
    title: 'Student Grievance Redressal',
    introHtml: '<p>The Student Grievance Redressal Committee ensures all grievances are addressed promptly and fairly per UGC guidelines.</p>',
    blocks: [
      { title: 'POLICIES', color: 'green', items: [] },
      { title: 'COMMITTEES', color: 'orange', items: [] },
      { title: 'GRIEVANCE FORM', color: 'blue', items: [] },
    ],
    contactEmail: 'grievance.neissr@gmail.com',
  },
  welfare: {
    title: 'Student Welfare Committee',
    introHtml: '<p>The Student Welfare Committee works to ensure the overall well-being of students on campus.</p>',
    blocks: [{ title: 'ACTIVITIES', color: 'blue', items: [] }],
    contactEmail: 'welfare.neissr@gmail.com',
  },
  'womens-cell': {
    title: "Women's Empowerment Cell",
    introHtml: '<p>Creating a safe, inclusive, and empowering environment for women students and staff.</p>',
    blocks: [
      { title: 'POLICIES', color: 'green', items: [] },
      { title: 'ACTIVITIES', color: 'purple', items: [] },
    ],
    contactEmail: 'women.neissr@gmail.com',
  },
  'internal-complaints': {
    title: 'Internal Complaints Committee',
    introHtml: '<p>Constituted as per the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013.</p>',
    blocks: [
      { title: 'REGULATIONS', color: 'green', items: [] },
      { title: 'COMMITTEE MEMBERS', color: 'orange', items: [] },
    ],
    contactEmail: 'icc.neissr@gmail.com',
  },
  alumni: {
    title: 'Alumni Association',
    introHtml: '<p>Connecting NEISSR graduates across generations. All alumni are automatically members.</p>',
    blocks: [
      { title: 'MEMBERSHIP', color: 'blue', items: [] },
      { title: 'EVENTS', color: 'purple', items: [] },
    ],
    contactEmail: 'alumni.neissr@gmail.com',
  },
  library: {
    title: 'Library',
    introHtml: '<p>Well-stocked repository of academic resources supporting teaching, learning, and research.</p>',
    blocks: [
      { title: 'RESOURCES', color: 'blue', items: [] },
      { title: 'RULES', color: 'orange', items: [] },
    ],
  },
  placement: {
    title: 'Placement Cell',
    introHtml: '<p>Career guidance and placement assistance for graduating students.</p>',
    blocks: [{ title: 'RESOURCES', color: 'blue', items: [] }],
  },
  coaching: {
    title: 'Coaching Centre',
    introHtml: '<p>Additional coaching support for competitive examinations and skill development.</p>',
    blocks: [{ title: 'PROGRAMMES', color: 'blue', items: [] }],
  },
  'health-care': {
    title: 'Health Care',
    introHtml: '<p>Health support and medical facilities for students on campus.</p>',
    blocks: [{ title: 'FACILITIES', color: 'red', items: [] }],
  },
};

/* ================= LIST VIEW (KJU-style mega grid) ================= */
function ServicesList() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#003DA5] text-white py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-blue-200 mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Student Services</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-3">Student Services</h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl">
            Comprehensive support systems ensuring academic excellence, well-being, and holistic development
          </p>
        </div>
      </div>

      {/* Grid — KJU mega menu style */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <Link
                key={service.id}
                to={`/student-services/${service.id}`}
                className="group flex items-start gap-4 p-4 rounded-lg hover:bg-neutral-50 border-b border-neutral-100 transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-[#003DA5]/10 flex items-center justify-center shrink-0 group-hover:bg-[#003DA5] transition-colors">
                  <Icon className="w-6 h-6 text-[#003DA5] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-lg text-neutral-900 group-hover:text-[#003DA5] transition-colors mb-1">
                    {service.label}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8102E] group-hover:gap-2 transition-all">
                    Read More <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= DETAIL VIEW (KJU-style blocks + sidebar) ================= */
function ServiceDetail({ slug }: { slug: string }) {
  const service = SERVICES.find((s) => s.id === slug);

  const { data: detail, isLoading } = useQuery<ServiceData>({
    queryKey: ['student-service', slug],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_DATA[slug] || { title: service?.label || '', blocks: [] };
      const snap = await getDoc(doc(db, 'student_services', slug));
      if (snap.exists()) return snap.data() as ServiceData;
      return SEED_DATA[slug] || { title: service?.label || '', blocks: [] };
    },
  });

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
          <Link to="/student-services" className="text-[#003DA5] underline">Back to Student Services</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-neutral-600 flex-wrap">
          <Link to="/" className="hover:text-[#003DA5] font-medium">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/student-services" className="hover:text-[#003DA5] font-medium">Student Services</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-800 font-semibold">{service.label}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Title Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#003DA5] mb-2">
              {detail?.title || service.label}
            </h1>
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
                    prose-p:mb-4 prose-headings:text-[#003DA5] prose-headings:font-serif prose-headings:font-bold"
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
                              className="flex items-center justify-between py-3 px-4 bg-white rounded-md border border-neutral-100 hover:border-[#003DA5] transition-colors group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <FileText className="w-4 h-4 text-[#C8102E] shrink-0" />
                                <span className="text-sm font-medium text-neutral-800 truncate">
                                  {item.name}
                                </span>
                              </div>
                              <a
                                href={getOpenUrl(item.url)}
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

        {/* Right Sidebar — Other Services */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-lg overflow-hidden sticky top-24">
            <div className="bg-[#003DA5] text-white px-5 py-4">
              <h3 className="font-serif font-bold text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Student Services
              </h3>
            </div>
            <nav className="divide-y divide-neutral-100">
              {SERVICES.map((s) => (
                <Link
                  key={s.id}
                  to={`/student-services/${s.id}`}
                  className={`block px-5 py-3 text-sm transition-colors ${
                    slug === s.id
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

export default function StudentServicesPage() {
  const { slug } = useParams<{ slug?: string }>();
  return slug ? <ServiceDetail slug={slug} /> : <ServicesList />;
}
