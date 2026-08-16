import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { DEFAULT_CONTENT } from '../admin/pages/ContentEditorPage';

export default function VisionPage() {
  const [data, setData] = useState<any>(DEFAULT_CONTENT.vision);

  useEffect(() => {
    async function load() {
      try {
        if (isFirebaseConfigured) {
          const snap = await getDoc(doc(db, 'content', 'vision'));
          if (snap.exists()) setData({ ...DEFAULT_CONTENT.vision, ...snap.data() });
        }
      } catch (e) {}
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">{data.visionHeading || 'Vision & Mission'}</h1>
      {data.visionImageUrl && <img src={data.visionImageUrl} alt="Vision" className="w-full rounded-xl mb-8 object-cover max-h-72" />}
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-bold text-[#C8102E] mb-2">Our Vision</h2>
          <p className="text-neutral-700">{data.visionStatement}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="text-lg font-bold text-[#C8102E] mb-2">Our Mission</h2>
          <p className="text-neutral-700">{data.missionStatement}</p>
        </div>
        {data.coreValuesHtml && (
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-[#C8102E] mb-2">Core Values</h2>
            <div className="prose" dangerouslySetInnerHTML={{ __html: data.coreValuesHtml }} />
          </div>
        )}
        {data.visionDriveLink && (
          <a href={data.visionDriveLink} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 bg-[#C8102E] text-white rounded-lg font-semibold text-sm hover:bg-[#a00d24]">
            View Document
          </a>
        )}
      </div>
    </div>
  );
}
