import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';

const DEFAULTS = {
  coreValuesHeading: 'Core Values of NEISSR',
  coreValuesIntroHtml: '<p>At NEISSR, our work is guided by a set of deeply held values.</p>',
  coreValue1Title: 'Integrity', coreValue1Desc: 'We uphold honesty, transparency, and ethical conduct in all our actions.',
  coreValue2Title: 'Compassion', coreValue2Desc: 'We care deeply for the vulnerable and marginalized communities we serve.',
  coreValue3Title: 'Excellence', coreValue3Desc: 'We strive for the highest standards in education, research, and practice.',
  coreValue4Title: 'Peace', coreValue4Desc: 'We are committed to peace-building and conflict transformation in North East India.',
  coreValue5Title: 'Social Justice', coreValue5Desc: 'We advocate for equity, rights, and dignity for all people.',
  coreValuesImageUrl: '',
  coreValuesDriveLink: '',
};

export default function CoreValuesPage() {
  const [data, setData] = useState<any>(DEFAULTS);

  useEffect(() => {
    async function load() {
      try {
        if (isFirebaseConfigured) {
          const snap = await getDoc(doc(db, 'content', 'core-values'));
          if (snap.exists()) setData({ ...DEFAULTS, ...snap.data() });
        }
      } catch (e) {}
    }
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">{data.coreValuesHeading}</h1>
      {data.coreValuesImageUrl && <img src={data.coreValuesImageUrl} alt="Core Values" className="w-full rounded-xl mb-8 object-cover max-h-72" />}
      {data.coreValuesIntroHtml && <div className="prose mb-8" dangerouslySetInnerHTML={{ __html: data.coreValuesIntroHtml }} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1,2,3,4,5].map((n) => data['coreValue'+n+'Title'] && (
          <div key={n} className="bg-white rounded-xl border border-neutral-200 p-6">
            <h3 className="text-lg font-bold text-[#C8102E] mb-1">{data['coreValue'+n+'Title']}</h3>
            <p className="text-neutral-600 text-sm">{data['coreValue'+n+'Desc']}</p>
          </div>
        ))}
      </div>
      {data.coreValuesDriveLink && (
        <a href={data.coreValuesDriveLink} target="_blank" rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 px-5 py-2 bg-[#C8102E] text-white rounded-lg font-semibold text-sm hover:bg-[#a00d24]">
          View Document
        </a>
      )}
    </div>
  );
}
