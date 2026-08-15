import React, { useState } from 'react';
import BlockEditor from '../components/BlockEditor';
import { ChevronRight, ExternalLink } from 'lucide-react';

const SECTIONS = [
  { id: 'about', label: 'About IQAC' },
  { id: 'policy', label: 'Internal Quality Assurance Policy' },
  { id: 'financial-support', label: 'Policy on Financial Support' },
  { id: 'functions', label: 'Functions' },
  { id: 'composition', label: 'Composition' },
  { id: 'activities', label: 'Major Activities' },
  { id: 'meeting-minutes', label: 'Meeting Minutes' },
  { id: 'naac', label: 'NAAC Compliance' },
  { id: 'autonomous', label: 'Autonomous Undertaking' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'institutional-distinctiveness', label: 'Institutional Distinctiveness' },
  { id: 'feedback', label: 'Feedback from Stakeholders' },
  { id: 'program-outcomes', label: 'Program and Course Outcomes' },
  { id: 'ethics-manual', label: 'Human Values & Professional Ethics Manual' },
  { id: 'sss-poster', label: 'Information Poster on SSS' },
  { id: 'affiliation', label: 'Affiliation' },
  { id: 'aqar', label: 'AQAR' },
  { id: 'nirf', label: 'NIRF Reports' },
  { id: 'academic-calendar', label: 'Academic Calendar' },
  { id: 'annual-reports', label: 'College Annual Reports' },
  { id: 'mandatory-disclosures', label: 'Mandatory Disclosures' },
];

export default function IQACAdminPage() {
  const [selected, setSelected] = useState<string>('about');
  const current = SECTIONS.find((s) => s.id === selected)!;

  return (
    <div className="pb-20">
      <div className="pb-4 border-b border-neutral-200 mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 font-serif">IQAC Content Manager</h2>
        <p className="text-sm text-neutral-600 mt-2">
          Select a section, edit content, add unlimited document blocks with downloadable PDFs.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Section Picker Sidebar */}
        <aside className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden lg:sticky lg:top-6">
            <div className="bg-[#003DA5] text-white px-4 py-3">
              <h3 className="text-sm font-bold uppercase tracking-wider">IQAC Sections</h3>
            </div>
            <div className="max-h-[70vh] overflow-y-auto divide-y divide-neutral-100">
              {SECTIONS.map((s) => (
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
                <p className="text-xs text-neutral-400 mt-0.5">/iqac/{current.id}</p>
              </div>
              <a
                href={`/iqac/${current.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Preview
              </a>
            </div>

            <BlockEditor
              key={selected}
              collectionName="iqac_sections"
              docId={selected}
              defaultTitle={current.label}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
