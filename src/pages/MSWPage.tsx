import React from 'react';
import { Award, Download, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReferenceCard from '../components/ui/ReferenceCard';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

function getOpenUrl(url: string): string {
  if (!url) return '#';
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/view`;
  return url;
}

const DEFAULT_SPECS = [
  { slug: 'community-development', title: 'Community Development (CD)', coordinator: 'Dr. Toli H. Kiba', description: 'Focuses on rural and urban community development, tribal governance, PRA methods, SHG formation, and sustainable livelihoods.', gradient: 'blue' as const },
  { slug: 'youth-development', title: 'Youth Development (YD)', coordinator: 'Dr. Abel Ariina', description: 'Prepares social workers to empower youth, handle mental health and substance issues, skill training, and youth leadership.', gradient: 'purple' as const },
  { slug: 'social-entrepreneurship', title: 'Social Entrepreneurship (SED)', coordinator: 'Fr. Dr. Robin Thomas', description: 'Combines social work ethics with business principles, micro-enterprise creation, project management, and impact investing.', gradient: 'pink' as const },
  { slug: 'peace-conflict-studies', title: 'Peace & Conflict Transformation Studies (PCTS)', coordinator: 'Ms. Elizabeth Pojar', description: 'Nagaland\'s first specialized MSW track in peacebuilding, conflict mediation, inter-ethnic dialogue, and post-conflict reconciliation.', gradient: 'emerald' as const },
];

const DEFAULT = {
  badge: 'Postgraduate Degree',
  title: 'Master of Social Work (MSW)',
  subtitle: '2-Year (4 Semesters) Degree with 4 specialized domains. Affiliated to Nagaland University.',
  overview: 'The MSW programme at NEISSR is designed to foster advanced professional social workers capable of policy analysis, field agency management, research, and grassroots conflict intervention. Students undergo rigorous classroom learning, concurrent fieldwork, rural immersion, and a 30-day block internship in reputed national/international organizations.',
  specialisations: DEFAULT_SPECS,
  syllabusUrl: '',
};

type GradientType = 'blue' | 'purple' | 'pink' | 'emerald';
const GRADIENTS: GradientType[] = ['blue', 'purple', 'pink', 'emerald'];

export default function MSWPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['msw-page'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return DEFAULT;
      const snap = await getDoc(doc(db, 'site_content', 'msw'));
      if (snap.exists()) return { ...DEFAULT, ...snap.data() };
      return DEFAULT;
    },
  });

  const d = data || DEFAULT;
  const specs = (d.specialisations || DEFAULT_SPECS).map((s: any, i: number) => ({
    ...s,
    gradient: GRADIENTS[i % GRADIENTS.length],
  }));

  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-8 h-8 text-[#003DA5] animate-spin" />
    </div>
  );

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      {/* Hero */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">{d.badge}</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{d.title}</h1>
          <p className="text-neutral-100 text-sm md:text-base max-w-2xl">{d.subtitle}</p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
        {/* Overview */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#003DA5] pl-3">
            Programme Overview
          </h2>
          <p className="text-neutral-700 text-sm md:text-base leading-relaxed">{d.overview}</p>

          {/* MSW Syllabus download */}
          <div className="pt-4 border-t border-neutral-100 flex flex-wrap gap-4">
            <Link to="/admissions"
              className="inline-flex items-center gap-2 bg-[#003DA5] text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-[#002d7a]">
              Apply for MSW Admission <ArrowRight className="w-4 h-4" />
            </Link>
            {d.syllabusUrl ? (
              <a href={getOpenUrl(d.syllabusUrl)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-800 px-6 py-3 rounded-full text-xs font-bold hover:bg-neutral-200">
                <Download className="w-4 h-4" /> Download MSW Syllabus
              </a>
            ) : (
              <Link to="/academics/manuals"
                className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-800 px-6 py-3 rounded-full text-xs font-bold hover:bg-neutral-200">
                <Download className="w-4 h-4" /> Download MSW Syllabus
              </Link>
            )}
          </div>
        </div>

        {/* Specialisations */}
        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-neutral-900">Choose Your MSW Specialisation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specs.map((spec: any) => (
              <ReferenceCard
                key={spec.slug}
                title={spec.title}
                badge={`Coordinator: ${spec.coordinator}`}
                gradient={spec.gradient}
                icon={<Award className="w-8 h-8" />}
                buttonText="View Details"
                buttonLink={`/academics/msw/${spec.slug}`}
              >
                <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">{spec.description}</p>
              </ReferenceCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
