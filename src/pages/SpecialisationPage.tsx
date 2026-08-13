import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, BookOpen } from 'lucide-react';

export default function SpecialisationPage() {
  const { slug } = useParams<{ slug: string }>();

  const detailsMap: Record<string, { title: string; coordinator: string; description: string; outcomes: string[] }> = {
    'community-development': {
      title: 'Community Development (CD)',
      coordinator: 'Dr. Toli H. Kiba',
      description: 'The Community Development track equips trainees with Participatory Rural Appraisal (PRA) techniques, rural camp facilitation, micro-planning, Panchayati Raj and tribal council governance, and environmental sustainability management.',
      outcomes: [
        'Expertise in PRA and PLA research methodologies',
        'Capacity to organize Self-Help Groups (SHGs) and farmer producer organizations',
        'Project formulation and Monitoring & Evaluation (M&E) skills',
        'Deep understanding of customary laws and North East land tenure systems'
      ]
    },
    'youth-development': {
      title: 'Youth Development (YD)',
      coordinator: 'Dr. Abel Ariina',
      description: 'Addresses the unique psychological, social, and economic dynamics of youth in North East India. Covers adolescent health, substance abuse prevention, youth policy advocacy, vocational skill building, and leadership.',
      outcomes: [
        'Skills in youth counseling and career guidance',
        'Designing youth-led peace initiatives and anti-addiction drives',
        'Youth policy formulation and advocacy with government departments',
        'Community sports and youth mobilization strategies'
      ]
    },
    'social-entrepreneurship': {
      title: 'Social Entrepreneurship & Development (SED)',
      coordinator: 'Fr. Dr. Robin Thomas',
      description: 'Blends non-profit ethics with sustainable market mechanisms. Students learn business plan development, financial literacy, social impact measurement, ethical marketing, and rural enterprise management.',
      outcomes: [
        'Drafting viable business models for social enterprises',
        'Fundraising, grant writing, and pitch presentation skills',
        'Micro-credit and community banking operations',
        'Supply chain optimization for indigenous handicraft and agro-products'
      ]
    },
    'peace-conflict-studies': {
      title: 'Peace & Conflict Transformation Studies (PCTS)',
      coordinator: 'Ms. Elizabeth Pojar',
      description: 'Pioneering specialty at NEISSR providing critical insights into multi-ethnic conflict resolution, restorative justice, peace education, dialogue facilitation, and post-accord community healing.',
      outcomes: [
        'Peer mediation and conflict negotiation techniques',
        'Designing Peace Clubs and Peace Channel modules in schools/colleges',
        'Trauma healing and psychosocial support in conflict-affected zones',
        'Inter-faith and inter-tribal dialogue facilitation'
      ]
    }
  };

  const item = slug && detailsMap[slug] ? detailsMap[slug] : detailsMap['community-development'];

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-8">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <Link
          to="/academics/msw"
          className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-[#003DA5] mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to MSW Specialisations
        </Link>
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">
            MSW Specialisation
          </div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{item.title}</h1>
          <p className="text-sm text-neutral-200">Coordinator: {item.coordinator}</p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#C8102E] pl-3">
              Specialisation Focus
            </h2>
            <p className="text-neutral-700 text-sm md:text-base leading-relaxed mt-3">
              {item.description}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-neutral-200">
            <h3 className="font-serif text-xl font-bold text-neutral-900">Key Learning Outcomes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-neutral-700">
              {item.outcomes.map((out, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 bg-[#FAF9F7] rounded-xl border border-neutral-200">
                  <CheckCircle className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
                  <span>{out}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
