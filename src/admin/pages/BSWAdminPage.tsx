import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { Save, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';

const DEFAULT = {
  badge: 'Undergraduate Degree',
  title: 'Bachelor of Social Work (BSW)',
  subtitle: 'Affiliated to Nagaland University. 3 Years (6 Semesters) Course preparing students for frontline social work practice.',
  overview: 'The BSW programme at NEISSR was introduced in 2022 to build foundational social work capacity among young school-leavers in Nagaland and North East India.',
  curriculum: [
    { title: 'Semester 1 & 2', desc: 'Intro to Social Work, Human Growth & Behaviour, Sociology for Social Work, Concurrent Fieldwork.' },
    { title: 'Semester 3 & 4', desc: 'Work with Individuals & Groups, Community Organization, Social Legislation, 10-Day Rural Camp.' },
    { title: 'Semester 5 & 6', desc: 'Social Research, Disaster Management, Block Fieldwork Placement, Undergrad Research Project.' },
    { title: 'Fieldwork Requirements', desc: 'Minimum 2 days/week fieldwork, 150 hours per semester in grassroots NGOs, hospitals, or local councils.' },
  ],
  duration: '3 Years (6 Semesters)',
  seats: '50 Seats',
  eligibility: '10+2 Passed (Any Stream)',
  affiliation: 'Nagaland University',
  syllabusUrl: '',
};

type CurriculumItem = { title: string; desc: string };

export default function BSWAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<typeof DEFAULT>(DEFAULT);

  useEffect(() => {
    getDoc(doc(db, 'site_content', 'bsw')).then((snap) => {
      if (snap.exists()) setData({ ...DEFAULT, ...snap.data() as typeof DEFAULT });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const set = (key: string, val: any) => setData((d) => ({ ...d, [key]: val }));

  const setCurr = (i: number, field: 'title' | 'desc', val: string) =>
    setData((d) => ({ ...d, curriculum: d.curriculum.map((c, x) => x === i ? { ...c, [field]: val } : c) }));

  const addCurr = () => setData((d) => ({ ...d, curriculum: [...d.curriculum, { title: 'New Section', desc: '' }] }));
  const delCurr = (i: number) => setData((d) => ({ ...d, curriculum: d.curriculum.filter((_, x) => x !== i) }));

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_content', 'bsw'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      toast.success('BSW page saved.');
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center gap-2 py-12 text-neutral-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-2xl font-bold font-serif text-neutral-900">BSW Programme Editor</h2>
          <p className="text-sm text-neutral-500 mt-1">Edit all BSW page content. Changes reflect live immediately after save.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/academics/bsw" target="_blank" className="text-xs text-[#003DA5] underline flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> Preview
          </a>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-sm font-bold rounded-lg disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save BSW Page
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider">Hero Banner</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-600 block mb-1">Badge Text</label>
            <input value={data.badge} onChange={(e) => set('badge', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#C8102E] outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 block mb-1">Programme Title</label>
            <input value={data.title} onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#C8102E] outline-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 block mb-1">Subtitle</label>
          <input value={data.subtitle} onChange={(e) => set('subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#C8102E] outline-none" />
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3">
        <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider">Programme Overview</h3>
        <textarea rows={5} value={data.overview} onChange={(e) => set('overview', e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#C8102E] outline-none resize-y" />
      </div>

      {/* Curriculum */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider">Curriculum Highlights</h3>
          <button onClick={addCurr}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#003DA5] text-white text-xs font-bold rounded-lg">
            <Plus className="w-3 h-3" /> Add Section
          </button>
        </div>
        <div className="space-y-3">
          {data.curriculum.map((c, i) => (
            <div key={i} className="flex gap-3 items-start p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2">
                <input value={c.title} onChange={(e) => setCurr(i, 'title', e.target.value)}
                  placeholder="Section title"
                  className="px-2 py-1.5 border border-neutral-300 rounded text-xs font-bold focus:border-[#C8102E] outline-none" />
                <input value={c.desc} onChange={(e) => setCurr(i, 'desc', e.target.value)}
                  placeholder="Description"
                  className="px-2 py-1.5 border border-neutral-300 rounded text-xs focus:border-[#C8102E] outline-none" />
              </div>
              <button onClick={() => delCurr(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Fast Facts */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider">Fast Facts (Sidebar)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'duration', label: 'Duration' },
            { key: 'seats', label: 'Sanctioned Seats' },
            { key: 'eligibility', label: 'Eligibility' },
            { key: 'affiliation', label: 'Affiliation' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs font-semibold text-neutral-600 block mb-1">{label}</label>
              <input value={(data as any)[key]} onChange={(e) => set(key, e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#C8102E] outline-none" />
            </div>
          ))}
        </div>
      </div>

      {/* Syllabus URL */}
      <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-5 space-y-2">
        <h3 className="font-bold text-[#003DA5] text-sm">📄 BSW Syllabus Download Link</h3>
        <p className="text-[11px] text-blue-700">Google Drive → right-click PDF → Share → Anyone with the link → Copy link → paste below.</p>
        <input type="url" value={data.syllabusUrl} onChange={(e) => set('syllabusUrl', e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:border-[#003DA5] outline-none bg-white" />
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-sm font-bold rounded-lg disabled:opacity-50 shadow-lg">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save BSW Page
        </button>
      </div>
    </div>
  );
}
