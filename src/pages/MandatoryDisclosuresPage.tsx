import React from 'react';
import { Download, ShieldCheck, CheckCircle } from 'lucide-react';

export default function MandatoryDisclosuresPage() {
  const disclosures = [
    { title: 'UGC Section 2(f) Recognition Order', code: 'C-54342', category: 'Statutory Approval' },
    { title: 'Nagaland University Permanent Affiliation Certificate', code: 'NU/ACAD/NEISSR/2014', category: 'Affiliation' },
    { title: 'Internal Complaints Committee (ICC) & Anti-Ragging Policy', code: 'NEISSR/ICC/2024', category: 'Student Safety' },
    { title: 'Equal Opportunity Cell & Tribal Empowerment Cell Charter', code: 'NEISSR/EOC/2024', category: 'Inclusion' },
    { title: 'Audited Financial Statements 2023-24', code: 'FIN/2024/01', category: 'Governance' }
  ];

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">UGC & Statutory Compliance</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Mandatory Public Disclosures</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            In compliance with University Grants Commission (UGC) and Nagaland University statutes.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#C8102E] pl-3">
              Statutory Certificates & Governance Committees
            </h2>
            <p className="text-neutral-700 text-sm leading-relaxed">
              NEISSR maintains complete transparency across all statutory recognitions, governance bodies, anti-ragging mandates, and financial audits.
            </p>
          </div>

          <div className="space-y-4">
            {disclosures.map((disc, idx) => (
              <div key={idx} className="p-6 bg-[#FAF9F7] rounded-2xl border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#C8102E] uppercase">{disc.category}</div>
                  <h3 className="font-serif font-bold text-lg text-neutral-900">{disc.title}</h3>
                  <div className="text-xs text-neutral-500">Ref Code: {disc.code}</div>
                </div>

                <span className="inline-flex items-center gap-2 bg-neutral-200 text-neutral-500 px-5 py-2.5 rounded-full text-xs font-bold cursor-not-allowed"><Download className="w-4 h-4" /> Document Coming Soon</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
