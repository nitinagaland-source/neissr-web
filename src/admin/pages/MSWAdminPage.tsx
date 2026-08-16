import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { Save, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';

const DEFAULT_SPECS = [
  { slug: 'community-development', title: 'Community Development (CD)', coordinator: 'Dr. Toli H. Kiba', description: 'Focuses on rural and urban community development, tribal governance, PRA methods, SHG formation, and sustainable livelihoods.' },
  { slug: 'youth-development', title: 'Youth Development (YD)', coordinator: 'Dr. Abel Ariina', description: 'Prepares social workers to empower youth, handle mental health and substance issues, skill training, and youth leadership.' },
  { slug: 'social-entrepreneurship', title: 'Social Entrepreneurship (SED)', coordinator: 'Fr. Dr. Robin Thomas', description: 'Combines social work ethics with business principles, micro-enterprise creation, project management, and impact investing.' },
  { slug: 'peace-conflict-studies', title: 'Peace & Conflict Transformation Studies (PCTS)', coordinator: 'Ms. Elizabeth Pojar', description: 'Nagaland\'s first specialized MSW track in peacebuilding, conflict mediation, inter-ethnic dialogue, and post-conflict reconciliation.' },
];

const DEFAULT = {
  badge: 'Postgraduate Degree',
  title: 'Master of Social Work (MSW)',
  subtitle: '2-Year (4 Semesters) Degree with 4 specialized domains. Affiliated to Nagaland University.',
  overview: 'The MSW programme at NEISSR is designed to foster advanced professional social workers capable of policy analysis, field agency management, research, and grassroots conflict intervention.',
  specialisations: DEFAULT_SPECS,
  syllabusUrl: '',
};

type Spec = { slug: string; title: string; coordinator: string; description: string };

export default function MSWAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<typeof DEFAULT>(DEFAULT);

  useEffect(() => {
    getDoc(doc(db, 'site_content', 'msw')).then((snap) => {
      if (snap.exists()) setData({ ...DEFAULT, ...snap.data() as typeof DEFAULT });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const set = (key: string, val: any) => setData((d) => ({ ...d, [key]: val }));

  const setSpec = (i: number, field: keyof Spec, val: string) =>
    setData((d) => ({ ...d, specialisations: d.specialisations.map((s, x) => x === i ? { ...s, [field]: val } : s) }));

  const addSpec = () => setData((d) => ({
    ...d, specialisations: [...d.specialisations, { slug: `spec-${Date.now()}`, title: 'New Specialisation', coordinator: '', description: '' }]
  }));

  const delSpec = (i: number) => setData((d) => ({ ...d, specialisations: d.specialisations.filter((_, x) => x !== i) }));

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'site_content', 'msw'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      toast.success('MSW page saved.');
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center gap-2 py-12 text-neutral-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div>
          <h2 className="text-2xl font-bold font-serif text-neutral-900">MSW Programme Editor</h2>
          <p className="text-sm text-neutral-500 mt-1">Edit all MSW page content and specialisations.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/academics/msw" target="_blank" className="text-xs text-[#003DA5] underline flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> Preview
          </a>
          <button onClick={save} disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003DA5] hover:bg-[#002d7a] text-white text-sm font-bold rounded-lg disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save MSW Page
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
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#003DA5] outline-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-neutral-600 block mb-1">Programme Title</label>
            <input value={data.title} onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#003DA5] outline-none" />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-neutral-600 block mb-1">Subtitle</label>
          <input value={data.subtitle} onChange={(e) => set('subtitle', e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#003DA5] outline-none" />
        </div>
      </div>

      {/* Overview */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3">
        <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider">Programme Overview</h3>
        <textarea rows={5} value={data.overview} onChange={(e) => set('overview', e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#003DA5] outline-none resize-y" />
      </div>

      {/* Specialisations */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider">MSW Specialisations</h3>
          <button onClick={addSpec}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#003DA5] text-white text-xs font-bold rounded-lg">
            <Plus className="w-3 h-3" /> Add Specialisation
          </button>
        </div>
        <div className="space-y-4">
          {data.specialisations.map((spec, i) => (
            <div key={spec.slug} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#003DA5]">Specialisation {i + 1}</span>
                <button onClick={() => delSpec(i)} className="p-1.5 text-red-500 hover:bg-red-50 rounded border border-red-200">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1">Title</label>
                  <input value={spec.title} onChange={(e) => setSpec(i, 'title', e.target.value)}
                    className="w-full px-2 py-1.5 border border-neutral-300 rounded text-xs focus:border-[#003DA5] outline-none bg-white" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 block mb-1">Coordinator</label>
                  <input value={spec.coordinator} onChange={(e) => setSpec(i, 'coordinator', e.target.value)}
                    className="w-full px-2 py-1.5 border border-neutral-300 rounded text-xs focus:border-[#003DA5] outline-none bg-white" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 block mb-1">Description</label>
                <textarea rows={2} value={spec.description} onChange={(e) => setSpec(i, 'description', e.target.value)}
                  className="w-full px-2 py-1.5 border border-neutral-300 rounded text-xs focus:border-[#003DA5] outline-none bg-white resize-y" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Syllabus URL */}
      <div className="bg-blue-50 rounded-xl border-2 border-blue-200 p-5 space-y-2">
        <h3 className="font-bold text-[#003DA5] text-sm">📄 MSW Syllabus Download Link</h3>
        <p className="text-[11px] text-blue-700">Google Drive → right-click PDF → Share → Anyone with the link → Copy link → paste below.</p>
        <input type="url" value={data.syllabusUrl} onChange={(e) => set('syllabusUrl', e.target.value)}
          placeholder="https://drive.google.com/file/d/..."
          className="w-full px-3 py-2 border border-blue-200 rounded-lg text-sm focus:border-[#003DA5] outline-none bg-white" />
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#003DA5] hover:bg-[#002d7a] text-white text-sm font-bold rounded-lg disabled:opacity-50 shadow-lg">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save MSW Page
        </button>
      </div>
    </div>
  );
}
