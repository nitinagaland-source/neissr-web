import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadToCloudinary, getResourceType } from '../../lib/cloudinary';
import { toast } from 'sonner';
import { FileText, Upload, X, Save, Loader2, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';

const SECTIONS = [
  { id: 'about', label: 'About IQAC' },
  { id: 'policy', label: 'Quality Policy' },
  { id: 'functions', label: 'Functions' },
  { id: 'composition', label: 'Composition' },
  { id: 'activities', label: 'Major Activities' },
  { id: 'meeting-minutes', label: 'Meeting Minutes' },
  { id: 'naac', label: 'NAAC Compliance' },
  { id: 'nirf', label: 'NIRF Reports' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'mandatory-disclosures', label: 'Mandatory Disclosures' },
  { id: 'feedback', label: 'Feedback' },
];

interface SectionData {
  title: string;
  contentHtml: string;
  heroImageUrl?: string;
  documents: { name: string; url: string; size?: string }[];
}

function SectionEditor({ sectionId, label }: { sectionId: string; label: string }) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<SectionData>({
    queryKey: ['iqac-admin', sectionId],
    enabled: open,
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'iqac_sections', sectionId));
      return snap.exists()
        ? (snap.data() as SectionData)
        : { title: label, contentHtml: '', heroImageUrl: '', documents: [] };
    },
  });

  const [localTitle, setLocalTitle] = useState('');
  const [localContent, setLocalContent] = useState('');
  const [localImage, setLocalImage] = useState('');

  React.useEffect(() => {
    if (data) {
      setLocalTitle(data.title || label);
      setLocalContent(data.contentHtml || '');
      setLocalImage(data.heroImageUrl || '');
    }
  }, [data, label]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await setDoc(
        doc(db, 'iqac_sections', sectionId),
        {
          title: localTitle,
          contentHtml: localContent,
          heroImageUrl: localImage,
          documents: data?.documents || [],
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    onSuccess: () => {
      toast.success('Section saved successfully.');
      qc.invalidateQueries({ queryKey: ['iqac-section', sectionId] });
      qc.invalidateQueries({ queryKey: ['iqac-admin', sectionId] });
    },
    onError: () => toast.error('Failed to save. Try again.'),
  });

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files allowed.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'image');
      setLocalImage(url);
      toast.success('Hero image updated.');
    } catch {
      toast.error('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File must be under 100MB.');
      return;
    }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'raw');
      const size = file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const newDoc = { name: file.name, url, size };
      const updated = [...(data?.documents || []), newDoc];
      await setDoc(
        doc(db, 'iqac_sections', sectionId),
        { documents: updated, updatedAt: serverTimestamp() },
        { merge: true }
      );
      qc.invalidateQueries({ queryKey: ['iqac-admin', sectionId] });
      toast.success('Document uploaded.');
    } catch {
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const removeDoc = async (index: number) => {
    const updated = (data?.documents || []).filter((_, i) => i !== index);
    await setDoc(
      doc(db, 'iqac_sections', sectionId),
      { documents: updated, updatedAt: serverTimestamp() },
      { merge: true }
    );
    qc.invalidateQueries({ queryKey: ['iqac-admin', sectionId] });
    toast.success('Document removed.');
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors border-b border-neutral-100"
      >
        <div className="text-left">
          <h3 className="font-semibold text-neutral-800">{label}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{sectionId}</p>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
      </button>

      {open && (
        <div className="p-6 space-y-6 border-t border-neutral-100">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : (
            <>
              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-600 mb-2">Title</label>
                <input
                  type="text"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:border-[#003DA5] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Section title"
                />
              </div>

              {/* Hero Image */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-600 mb-2">Hero Image</label>
                {localImage && (
                  <div className="relative mb-3 rounded-lg overflow-hidden h-32 bg-neutral-100 flex items-center">
                    <img src={localImage} alt="Hero" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setLocalImage('')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-semibold text-neutral-700 transition-colors">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleHeroUpload} disabled={uploading} />
                </label>
              </div>

              {/* Content HTML */}
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-600 mb-2">Content (HTML)</label>
                <textarea
                  rows={12}
                  value={localContent}
                  onChange={(e) => setLocalContent(e.target.value)}
                  placeholder="Use HTML: <p>, <h3>, <ul>, <li>, <strong> etc."
                  className="w-full px-4 py-3 text-xs font-mono border border-neutral-300 rounded-lg focus:border-[#003DA5] focus:ring-2 focus:ring-blue-100 outline-none resize-y"
                />
              </div>

              {/* Save */}
              <button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003DA5] text-white text-sm font-bold rounded-lg hover:bg-[#002d7a] disabled:opacity-50 transition-colors"
              >
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Section
              </button>

              {/* Documents */}
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold uppercase text-neutral-600">Documents & PDFs</h4>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 transition-colors">
                    {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                    {uploading ? 'Uploading...' : 'Add PDF'}
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleDocUpload} disabled={uploading} />
                  </label>
                </div>

                {data?.documents && data.documents.length > 0 ? (
                  <div className="space-y-2">
                    {data.documents.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-[#C8102E] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-neutral-800 truncate">{d.name}</p>
                            {d.size && <p className="text-[10px] text-neutral-400">{d.size}</p>}
                          </div>
                        </div>
                        <button onClick={() => removeDoc(i)} className="text-red-500 hover:text-red-700 p-1">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400">No documents yet.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function IQACAdminPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-20">
      <div className="pb-4 border-b border-neutral-200">
        <h2 className="text-2xl font-bold text-neutral-900 font-serif">IQAC Content Manager</h2>
        <p className="text-sm text-neutral-600 mt-2">
          Edit content, upload hero images, and manage documents for each IQAC section. Click to expand.
        </p>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((s) => (
          <SectionEditor key={s.id} sectionId={s.id} label={s.label} />
        ))}
      </div>
    </div>
  );
}
