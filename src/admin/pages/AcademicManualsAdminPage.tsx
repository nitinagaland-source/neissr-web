import React from 'react';
import BlockEditor from '../components/BlockEditor';
import { ExternalLink } from 'lucide-react';

export default function AcademicManualsAdminPage() {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="pb-4 border-b border-neutral-200 mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 font-serif">Academic Manuals Manager</h2>
        <p className="text-sm text-neutral-600 mt-2">
          Add blocks for BSW, MSW manuals and syllabi. Upload via Google Drive link.
        </p>
        <a
          href="/academics/manuals"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-2 text-xs text-[#003DA5] underline"
        >
          <ExternalLink className="w-3 h-3" /> Preview public page
        </a>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
        <BlockEditor
          collectionName="academic_manuals"
          docId="main"
          defaultTitle="Academic Manuals"
        />
      </div>
    </div>
  );
}
