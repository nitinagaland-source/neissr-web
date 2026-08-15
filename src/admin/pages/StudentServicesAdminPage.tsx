import React, { useState } from 'react';
import BlockEditor from '../components/BlockEditor';
import { ChevronRight, ExternalLink } from 'lucide-react';

const SERVICES = [
  { id: 'scholarship', label: 'Scholarship' },
  { id: 'counselling', label: 'Counselling Centre' },
  { id: 'anti-ragging', label: 'Anti-Ragging Committee' },
  { id: 'grievance', label: 'Student Grievance Redressal' },
  { id: 'welfare', label: 'Student Welfare Committee' },
  { id: 'womens-cell', label: "Women's Empowerment Cell" },
  { id: 'internal-complaints', label: 'Internal Complaints Committee' },
  { id: 'alumni', label: 'Alumni Association' },
  { id: 'library', label: 'Library' },
  { id: 'placement', label: 'Placement Cell' },
  { id: 'coaching', label: 'Coaching Centre' },
  { id: 'health-care', label: 'Health Care' },
];

export default function StudentServicesAdminPage() {
  const [selected, setSelected] = useState<string>('scholarship');
  const current = SERVICES.find((s) => s.id === selected)!;

  return (
    <div className="pb-20">
      <div className="pb-4 border-b border-neutral-200 mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 font-serif">Student Services Manager</h2>
        <p className="text-sm text-neutral-600 mt-2">
          Select a service, edit content, add unlimited document blocks with downloadable PDFs.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Service Picker */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden lg:sticky lg:top-6">
            <div className="bg-[#003DA5] text-white px-4 py-3">
              <h3 className="text-sm font-bold uppercase tracking-wider">Services</h3>
            </div>
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-neutral-100">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`w-full flex items-center justify-between text-left px-4 py-3 text-sm transition-colors ${
                    selected === s.id
                      ? 'bg-blue-50 text-[#003DA5] font-semibold border-l-4 border-[#C8102E]'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  <span className="truncate">{s.label}</span>
                  {selected === s.id && <ChevronRight className="w-3 h-3 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Editor */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">{current.label}</h3>
                <p className="text-xs text-neutral-400 mt-0.5">/student-services/{current.id}</p>
              </div>
              <a
                href={`/student-services/${current.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview
              </a>
            </div>

            <BlockEditor
              key={selected}
              collectionName="student_services"
              docId={selected}
              defaultTitle={current.label}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
