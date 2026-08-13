import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import RichTextEditor from '../components/RichTextEditor';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, MessageCircle } from 'lucide-react';
import { logActivity } from '../../lib/activityLog';

export default function ForumEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Peace & Conflict');
  const [description, setDescription] = useState('');
  const [objectiveHtml, setObjectiveHtml] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  useEffect(() => {
    if (isNew) return;
    async function loadForum() {
      try {
        const snap = await getDoc(doc(db, 'forums', id!));
        if (snap.exists()) {
          const data = snap.data();
          setTitle(data.title || data.name || '');
          setSlug(data.slug || id!);
          setCategory(data.category || 'Peace & Conflict');
          setDescription(data.description || '');
          setObjectiveHtml(data.objectiveHtml || data.detailsHtml || '');
          setStatus(data.status || 'published');
        } else {
          toast.error('Forum not found.');
          navigate('/admin/forums');
        }
      } catch (e) {
        console.error('Error loading forum:', e);
        toast.error('Failed to load forum details.');
      } finally {
        setLoading(false);
      }
    }
    loadForum();
  }, [id, isNew, navigate]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please fill in Forum Title.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        name: title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        description,
        objectiveHtml,
        status,
        updatedAt: serverTimestamp(),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, 'forums'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        await logActivity('create', 'forums', docRef.id);
        toast.success('Created forum successfully.');
      } else {
        await setDoc(doc(db, 'forums', id!), payload, { merge: true });
        await logActivity('update', 'forums', id!);
        toast.success('Updated forum successfully.');
      }
      navigate('/admin/forums');
    } catch (err) {
      console.error('Error saving forum:', err);
      toast.error('Failed to save forum.');
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/forums')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Forums
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8102E] text-white rounded-lg text-xs font-bold hover:bg-[#9A0C24] transition-colors shadow-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isNew ? 'Create Forum' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#C8102E]" />
          {isNew ? 'Create New Forum' : `Edit Forum — ${title}`}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">Forum Name / Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Youth Peace Forum"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-700">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. youth-peace-forum"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg font-mono"
            />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-neutral-700">Category / Theme</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Peace & Conflict / Social Work"
              className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700">Summary / Excerpt</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of the forum purpose..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
          />
        </div>

        <div className="space-y-1">
          <RichTextEditor
            label="Detailed Objectives & Activities"
            value={objectiveHtml}
            onChange={setObjectiveHtml}
          />
        </div>

        <div className="space-y-1 pt-2 border-t border-neutral-100">
          <label className="text-xs font-semibold text-neutral-700">Publication Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
          >
            <option value="published">Published</option>
            <option value="draft">Draft (Hidden)</option>
          </select>
        </div>
      </div>
    </form>
  );
}
