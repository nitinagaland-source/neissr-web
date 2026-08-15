import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { toast } from 'sonner';
import { FileText, Upload, X, Save, Loader2, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const SECTIONS = [
  { id: 'about', label: 'About IQAC' },
  { id: 'policy', label: 'Quality Policy' },
  { id: 'functions', label: 'Functions' },
  { id: 'composition', label: 'Composition' },
  { id: 'activities', label: 'Major Activities' },
  { id: 'meeting-minutes', label: 'Meeting Minutes' },
  { id: 'naac', label: 'NAAC Documents' },
  { id: 'nirf', label: 'NIRF Reports' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'mandatory-disclosures', label: 'Mandatory Disclosures' },
  { id: 'feedback', label: 'Feedback' },
];

interface SectionData {
  title: string;
  contentHtml: string;
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
        : { title: label, contentHtml: '', documents: [] };
    },
  });

  const [localContent, setLocalContent] = useState('');
  const [localTitle, setLocalTitle] = useState('');

  React.useEffect(() => {
    if (data) {
      setLocalContent(data.contentHtml || '');
      setLocalTitle(data.title || label);
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      await setDoc(
        doc(db, 'iqac_sections', sectionId),
        {
          title: localTitle,
          contentHtml: localContent,
          documents: data?.documents || [],
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    },
    onSuccess: () => {
      toast.success('Section saved.');
      qc.invalidateQueries({ queryKey: ['iqac-section', sectionId] });
      qc.invalidateQueries({ queryKey: ['iqac-admin', sectionId] });
    },
    onError: () => toast.error('Failed to save.'),
  });

  const handleUploadDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-neutral-50 transition-colors"
      >
        <span className="font-semibold text-neutral-800">{label}</span>
        {open ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
      </button>

      {open && (
        <div className="border-t border-neutral-100 p-5 space-y-4">
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : (
            <>
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:border-[#003DA5] focus:outline-none"
                />
              </div>

              {/* Content HTML */}
              <div>
                <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-1">
                  Content (HTML)
                </label>
                <textarea
                  rows={10}
                  value={localContent}
                  onChange={(e) => setLocalContent(e.target.value)}
                  placeholder="Enter HTML content here. Use <p>, <ul>, <li>, <h3>, <strong> tags."
                  className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded-lg focus:border-[#003DA5] focus:outline-none resize-y"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Use HTML tags. Preview at{' '}
                  <a
                    href={`/iqac/${sectionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#003DA5] underline inline-flex items-center gap-0.5"
                  >
                    /iqac/{sectionId} <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#003DA5] text-white text-xs font-bold rounded-lg hover:bg-[#002d7a] disabled:opacity-50 transition-colors"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save Content
              </button>

              {/* Documents */}
              <div className="border-t border-neutral-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
                    Documents / PDFs
                  </h4>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 transition-colors">
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    {uploading ? 'Uploading...' : 'Upload PDF'}
                    <input
                      type="file"
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onChange={handleUploadDoc}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {data?.documents && data.documents.length > 0 ? (
                  <div className="space-y-2">
                    {data.documents.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-lg border border-neutral-200"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#C8102E] shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-neutral-800">{d.name}</p>
                            {d.size && <p className="text-[10px] text-neutral-400">{d.size}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#003DA5] underline"
                          >
                            View
                          </a>
                          <button
                            onClick={() => removeDoc(i)}
                            className="text-red-500 hover:text-red-700 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400">No documents uploaded yet.</p>
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
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="text-xl font-bold font-sans text-neutral-900">IQAC Content Manager</h2>
        <p className="text-xs text-neutral-500 mt-1">
          Edit content and upload PDFs for each IQAC section. Click a section to expand it.
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
