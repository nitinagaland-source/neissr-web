import React from 'react';
import { Award, CheckCircle, Download } from 'lucide-react';

export default function NAACPage() {
  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">National Assessment and Accreditation Council</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">NAAC Accreditation & IQAC</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            NEISSR is accredited by NAAC with Grade B++ (CGPA 2.98), reflecting institutional quality, research rigor, and community impact.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
        {/* Accreditation Banner */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-neutral-200">
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#C8102E] uppercase">1st Cycle Accreditation</div>
              <h2 className="font-serif text-3xl font-bold text-neutral-900">NAAC Grade B++ (CGPA 2.98)</h2>
              <p className="text-xs text-neutral-600">Valid through 2029 | Cycle 1 Assessment</p>
            </div>

            <div className="bg-[#FAF9F7] p-6 rounded-2xl border border-neutral-200 text-center space-y-1 shrink-0">
              <div className="font-serif font-bold text-4xl text-[#003DA5]">2.98</div>
              <div className="text-xs font-semibold text-neutral-600">Cumulative Grade Point Average</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-neutral-900">Internal Quality Assurance Cell (IQAC)</h3>
            <p className="text-neutral-700 text-sm leading-relaxed">
              The IQAC at NEISSR functions as a cornerstone for quality enhancement, monitoring academic performance, fieldwork supervision protocols, faculty development, and community research ethics.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex flex-wrap gap-4">
            <a
              href="#naac-certificate"
              onClick={(e) => {
                e.preventDefault();
                alert('Downloading NAAC Accreditation Certificate...');
              }}
              className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-[#9A0C24]"
            >
              <Download className="w-4 h-4" /> Download NAAC Certificate
            </a>
            <a
              href="#aqar-report"
              onClick={(e) => {
                e.preventDefault();
                alert('Downloading Annual Quality Assurance Report (AQAR)...');
              }}
              className="inline-flex items-center gap-2 bg-[#003DA5] text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-[#002B75]"
            >
              <Download className="w-4 h-4" /> Download Latest AQAR
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
