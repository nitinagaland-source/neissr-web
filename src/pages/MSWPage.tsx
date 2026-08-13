import React from 'react';
import { Award } from 'lucide-react';
import ReferenceCard from '../components/ui/ReferenceCard';

export default function MSWPage() {
  const specialisations: Array<{
    slug: string;
    title: string;
    coordinator: string;
    description: string;
    gradient: 'blue' | 'purple' | 'pink' | 'emerald';
  }> = [
    {
      slug: 'community-development',
      title: 'Community Development (CD)',
      coordinator: 'Dr. Toli H. Kiba',
      description: 'Focuses on rural and urban community development, tribal governance, PRA methods, SHG formation, and sustainable livelihoods.',
      gradient: 'blue'
    },
    {
      slug: 'youth-development',
      title: 'Youth Development (YD)',
      coordinator: 'Dr. Abel Ariina',
      description: 'Prepares social workers to empower youth, handle mental health and substance issues, skill training, and youth leadership.',
      gradient: 'purple'
    },
    {
      slug: 'social-entrepreneurship',
      title: 'Social Entrepreneurship (SED)',
      coordinator: 'Fr. Dr. Robin Thomas',
      description: 'Combines social work ethics with business principles, micro-enterprise creation, project management, and impact investing.',
      gradient: 'pink'
    },
    {
      slug: 'peace-conflict-studies',
      title: 'Peace & Conflict Transformation Studies (PCTS)',
      coordinator: 'Ms. Elizabeth Pojar',
      description: 'Nagaland’s first specialized MSW track in peacebuilding, conflict mediation, inter-ethnic dialogue, and post-conflict reconciliation.',
      gradient: 'emerald'
    }
  ];

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Postgraduate Degree</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">
            Master of Social Work (MSW)
          </h1>
          <p className="text-neutral-100 text-sm md:text-base max-w-2xl">
            2-Year (4 Semesters) Degree with 4 specialized domains. Affiliated to Nagaland University.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
          <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#003DA5] pl-3">
            Programme Overview
          </h2>
          <p className="text-neutral-700 text-sm md:text-base leading-relaxed">
            The MSW programme at NEISSR is designed to foster advanced professional social workers capable of policy analysis, field agency management, research, and grassroots conflict intervention. Students undergo rigorous classroom learning, concurrent fieldwork, rural immersion, and a 30-day block internship in reputed national/international organizations.
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="font-serif text-3xl font-bold text-neutral-900">
            Choose Your MSW Specialisation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {specialisations.map((spec) => (
              <ReferenceCard
                key={spec.slug}
                title={spec.title}
                badge={`Coordinator: ${spec.coordinator}`}
                gradient={spec.gradient}
                icon={<Award className="w-8 h-8" />}
                buttonText="View Details"
                buttonLink={`/academics/msw/${spec.slug}`}
              >
                <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">
                  {spec.description}
                </p>
              </ReferenceCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
