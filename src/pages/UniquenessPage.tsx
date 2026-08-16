import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { DEFAULT_CONTENT } from '../admin/pages/ContentEditorPage';

export default function UniquenessPage() {
  const [data, setData] = useState<any>(DEFAULT_CONTENT.uniqueness);

  useEffect(() => {
    async function load() {
      try {
        if (isFirebaseConfigured) {
          const snap = await getDoc(doc(db, 'content', 'uniqueness'));
          if (snap.exists()) setData({ ...DEFAULT_CONTENT.uniqueness, ...snap.data() });
        }
      } catch (e) {}
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">{data.uniquenessHeading || 'Our Uniqueness'}</h1>
      {data.uniquenessImageUrl && <img src={data.uniquenessImageUrl} alt="Uniqueness" className="w-full rounded-xl mb-8 object-cover max-h-72" />}
      {data.uniquenessIntroHtml && <div className="prose mb-8" dangerouslySetInnerHTML={{ __html: data.uniquenessIntroHtml }} />}
      <div className="space-y-4">
        {[1,2,3,4].map((n) => data['uniquePoint'+n] && (
          <div key={n} className="bg-white rounded-xl border border-neutral-200 p-6 flex gap-4">
            <span className="text-2xl font-black text-[#C8102E]">{n}</span>
            <p className="text-neutral-700">{data['uniquePoint'+n]}</p>
          </div>
        ))}
      </div>
      {data.uniquenessDriveLink && (
        <a href={data.uniquenessDriveLink} target="_blank" rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 px-5 py-2 bg-[#C8102E] text-white rounded-lg font-semibold text-sm hover:bg-[#a00d24]">
          View Document
        </a>
      )}
    </div>
  );
}
