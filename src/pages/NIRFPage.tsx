import React from 'react';
import { Download, Award, CheckCircle } from 'lucide-react';

export default function NIRFPage() {
  const nirfReports = [
    { year: '2025', title: 'NIRF Data Submission 2025 (Overall & College Category)', status: 'Submitted' },
    { year: '2024', title: 'NIRF Report 2024 (Overall & Social Work Discipline)', status: 'Approved' },
    { year: '2023', title: 'NIRF Data 2023 Submission Report', status: 'Approved' }
  ];

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Ministry of Education, Govt. of India</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">NIRF (National Institutional Ranking Framework)</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            In compliance with NIRF guidelines, NEISSR publicly discloses institutional data regarding student intake, faculty credentials, financial resources, and placements.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-8">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#C8102E] pl-3">
              NIRF Data Submissions & Disclosures
            </h2>
            <p className="text-neutral-700 text-sm leading-relaxed">
              NEISSR regularly participates in the National Institutional Ranking Framework (NIRF) instituted by the Ministry of Education, Government of India. Below are the official submitted documents available for public review.
            </p>
          </div>

          <div className="space-y-4">
            {nirfReports.map((rep, idx) => (
              <div key={idx} className="p-6 bg-[#FAF9F7] rounded-2xl border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-[#C8102E]">Academic Year {rep.year}</div>
                  <h3 className="font-serif font-bold text-lg text-neutral-900">{rep.title}</h3>
                  <div className="text-xs text-neutral-500 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Status: {rep.status}
                  </div>
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
