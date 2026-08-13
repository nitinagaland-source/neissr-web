import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, Briefcase } from 'lucide-react';
import { logActivity } from '../../lib/activityLog';

export default function PlacementEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState('');
  const [programme, setProgramme] = useState('MSW');
  const [batchYear, setBatchYear] = useState('2023-24');
  const [organisation, setOrganisation] = useState('');
  const [role, setRole] = useState('');
  const [packageLPA, setPackageLPA] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  useEffect(() => {
    if (isNew) return;
    async function loadPlacement() {
      try {
        const snap = await getDoc(doc(db, 'placements', id!));
        if (snap.exists()) {
          const data = snap.data();
          setFullName(data.fullName || '');
          setProgramme(data.programme || 'MSW');
          setBatchYear(data.batchYear || '2023-24');
          setOrganisation(data.organisation || '');
          setRole(data.role || '');
          setPackageLPA(data.packageLPA || '');
          setStatus(data.status || 'published');
        } else {
          toast.error('Placement record not found.');
          navigate('/admin/placements');
        }
      } catch (e) {
        console.error('Error loading placement record:', e);
        toast.error('Failed to load record details.');
      } finally {
        setLoading(false);
      }
    }
    loadPlacement();
  }, [id, isNew, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !organisation.trim()) {
      toast.error('Please fill in Student Name and Organisation.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName,
        programme,
        batchYear,
        organisation,
        role,
        packageLPA,
        status,
        updatedAt: serverTimestamp(),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, 'placements'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        await logActivity('create', 'placements', docRef.id);
        toast.success('Created placement record successfully.');
      } else {
        await setDoc(doc(db, 'placements', id!), payload, { merge: true });
        await logActivity('update', 'placements', id!);
        toast.success('Updated placement record successfully.');
      }
      navigate('/admin/placements');
    } catch (err) {
      console.error('Error saving placement record:', err);
      toast.error('Failed to save placement record.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8102E]" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/placements')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Placements
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8102E] text-white rounded-lg text-xs font-bold hover:bg-[#9A0C24] transition-colors shadow-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? 'Create Record' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#C8102E]" />
          {isNew ? 'Add New Placement Record' : `Edit Record — ${fullName}`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Student Full Name *</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ms. Achuno Shitiri"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Programme</label>
            <select
              value={programme}
              onChange={(e) => setProgramme(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            >
              <option value="BSW">BSW (Bachelor of Social Work)</option>
              <option value="MSW">MSW (Master of Social Work)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Batch Year</label>
            <input
              type="text"
              value={batchYear}
              onChange={(e) => setBatchYear(e.target.value)}
              placeholder="e.g. 2023-24"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Recruiting Organisation *</label>
            <input
              type="text"
              required
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="e.g. UNICEF / Caritas India"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Designation / Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Project Officer / Social Worker"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Salary Package / Stipend</label>
            <input
              type="text"
              value={packageLPA}
              onChange={(e) => setPackageLPA(e.target.value)}
              placeholder="e.g. ₹4.2 LPA"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-1 pt-2 border-t border-neutral-100">
          <label className="text-xs font-semibold text-neutral-700">Publication Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
          >
            <option value="published">Published (Visible on Public Website)</option>
            <option value="draft">Draft (Hidden)</option>
          </select>
        </div>
      </div>
    </form>
  );
}
