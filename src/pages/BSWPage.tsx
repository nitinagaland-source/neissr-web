import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';

export default function BSWPage() {
  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#C8102E] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Undergraduate Degree</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">
            Bachelor of Social Work (BSW)
          </h1>
          <p className="text-neutral-100 text-sm md:text-base max-w-2xl">
            Affiliated to Nagaland University. 3 Years (6 Semesters) Course preparing students for frontline social work practice.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#C8102E] pl-3">
              Programme Overview
            </h2>
            <p className="text-neutral-700 text-sm md:text-base leading-relaxed">
              The BSW programme at NEISSR was introduced in 2022 to build foundational social work capacity among young school-leavers in Nagaland and North East India. The course provides a rigorous mix of theoretical learning in sociology, psychology, human rights, social legislation, and community health alongside mandatory concurrent field practicums.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-neutral-900">Curriculum Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-700">
              <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200">
                <div className="font-bold text-[#C8102E] mb-1">Semester 1 & 2</div>
                Intro to Social Work, Human Growth & Behaviour, Sociology for Social Work, Concurrent Fieldwork.
              </div>
              <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200">
                <div className="font-bold text-[#C8102E] mb-1">Semester 3 & 4</div>
                Work with Individuals & Groups, Community Organization, Social Legislation, 10-Day Rural Camp.
              </div>
              <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200">
                <div className="font-bold text-[#C8102E] mb-1">Semester 5 & 6</div>
                Social Research, Disaster Management, Block Fieldwork Placement, Undergrad Research Project.
              </div>
              <div className="p-4 bg-[#FAF9F7] rounded-xl border border-neutral-200">
                <div className="font-bold text-[#C8102E] mb-1">Fieldwork Requirements</div>
                Minimum 2 days/week fieldwork, 150 hours per semester in grassroots NGOs, hospitals, or local councils.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-200 flex flex-wrap gap-4">
            <Link
              to="/admissions"
              className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-[#9A0C24]"
            >
              Apply for BSW Admission <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/documents"
              className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-800 px-6 py-3 rounded-full text-xs font-bold hover:bg-neutral-200"
            >
              <Download className="w-4 h-4" /> Download BSW Syllabus
            </Link>
          </div>
        </div>

        {/* Sidebar key facts */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-neutral-900 border-b border-neutral-100 pb-2">
              BSW Fast Facts
            </h3>
            <div className="space-y-3 text-xs text-neutral-700">
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Duration</span>
                <span className="font-semibold text-neutral-900">3 Years (6 Semesters)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Sanctioned Seats</span>
                <span className="font-semibold text-neutral-900">50 Seats</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100">
                <span className="text-neutral-500">Eligibility</span>
                <span className="font-semibold text-neutral-900">10+2 Passed (Any Stream)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Affiliation</span>
                <span className="font-semibold text-[#003DA5]">Nagaland University</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
