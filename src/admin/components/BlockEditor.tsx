import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { toast } from 'sonner';
import {
  FileText, Upload, X, Save, Loader2, Plus, Trash2, ChevronDown, ChevronUp, Link2,
} from 'lucide-react';

interface DocumentItem {
  name: string;
  url: string;
  size?: string;
}
interface Block {
  title: string;
  color: string;
  items: DocumentItem[];
}
interface BlockData {
  title: string;
  introHtml?: string;
  blocks: Block[];
  contactEmail?: string;
}

const COLORS = ['green', 'orange', 'blue', 'red', 'purple', 'amber'];
const COLOR_BG: Record<string, string> = {
  green: 'bg-green-100 border-green-300 text-green-800',
  orange: 'bg-orange-100 border-orange-300 text-orange-800',
  blue: 'bg-blue-100 border-blue-300 text-blue-800',
  red: 'bg-red-100 border-red-300 text-red-800',
  purple: 'bg-purple-100 border-purple-300 text-purple-800',
  amber: 'bg-amber-100 border-amber-300 text-amber-800',
};

interface BlockEditorProps {
  collectionName: string;      // 'iqac_sections' or 'student_services'
  docId: string;
  defaultTitle: string;
  onSaved?: () => void;
}

export default function BlockEditor({ collectionName, docId, defaultTitle, onSaved }: BlockEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null); // block index for upload feedback
  const [linkInput, setLinkInput] = useState<Record<number, { name: string; url: string }>>({});

  const [title, setTitle] = useState(defaultTitle);
  const [intro, setIntro] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);

  // Load
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, collectionName, docId));
        if (snap.exists()) {
          const d = snap.data() as BlockData;
          setTitle(d.title || defaultTitle);
          setIntro(d.introHtml || '');
          setContactEmail(d.contactEmail || '');
          setBlocks(d.blocks || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [collectionName, docId, defaultTitle]);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(
        doc(db, collectionName, docId),
        { title, introHtml: intro, contactEmail, blocks, updatedAt: serverTimestamp() },
        { merge: true }
      );
      toast.success('Saved successfully.');
      onSaved?.();
    } catch {
      toast.error('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  const addBlock = () => {
    setBlocks([...blocks, { title: 'NEW SECTION', color: 'blue', items: [] }]);
  };
  const deleteBlock = (bi: number) => {
    if (!confirm('Delete this block?')) return;
    setBlocks(blocks.filter((_, i) => i !== bi));
  };
  const updateBlock = (bi: number, patch: Partial<Block>) => {
    setBlocks(blocks.map((b, i) => (i === bi ? { ...b, ...patch } : b)));
  };

  const uploadItem = async (bi: number, file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      toast.error('File must be under 100MB.');
      return;
    }
    setUploading(`${bi}`);
    try {
      // 'auto' → cloudinary.ts routes PDFs to `image` for inline viewing
      const url = await uploadToCloudinary(file, 'auto');
      const size = file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      const newItem: DocumentItem = {
        name: file.name.replace(/\.[^/.]+$/, ''),
        url,
        size,
      };
      setBlocks((prev) =>
        prev.map((b, i) => (i === bi ? { ...b, items: [...b.items, newItem] } : b))
      );
      toast.success('Uploaded. Click "Save Page" to keep changes.');
    } catch (e: any) {
      toast.error(e?.message || 'Upload failed.');
    } finally {
      setUploading(null);
    }
  };

  const deleteItem = (bi: number, ii: number) => {
    if (!confirm('Delete this document?')) return;
    setBlocks(
      blocks.map((b, i) =>
        i === bi ? { ...b, items: b.items.filter((_, x) => x !== ii) } : b
      )
    );
  };

  const addLinkItem = (bi: number) => {
    const input = linkInput[bi];
    if (!input?.url?.trim()) { toast.error('Paste a URL first.'); return; }
    if (!input?.name?.trim()) { toast.error('Enter a document name.'); return; }
    const newItem: DocumentItem = { name: input.name.trim(), url: input.url.trim() };
    setBlocks(blocks.map((b, i) => i === bi ? { ...b, items: [...b.items, newItem] } : b));
    setLinkInput((prev) => ({ ...prev, [bi]: { name: '', url: '' } }));
    toast.success('Link added. Click "Save Page" to keep.');
  };

  const updateItemName = (bi: number, ii: number, name: string) => {
    setBlocks(
      blocks.map((b, i) =>
        i === bi ? { ...b, items: b.items.map((it, x) => (x === ii ? { ...it, name } : it)) } : b
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-500 p-6">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Page Basics */}
      <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-5 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-600 mb-2">Page Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#003DA5] focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-600 mb-2">
            Introduction (HTML) — appears at top of page
          </label>
          <textarea
            rows={5}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="<p>Write intro paragraph here...</p>"
            className="w-full px-3 py-2 font-mono text-xs border border-neutral-300 rounded-lg focus:border-[#003DA5] focus:ring-2 focus:ring-blue-100 outline-none resize-y"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-neutral-600 mb-2">
            Contact Email (optional)
          </label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="contact.neissr@gmail.com"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#003DA5] focus:ring-2 focus:ring-blue-100 outline-none"
          />
        </div>
      </div>

      {/* Blocks Manager */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Document Blocks</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Each block is a colored section (e.g., "REGULATIONS") with downloadable documents inside.
            </p>
          </div>
          <button
            onClick={addBlock}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#003DA5] hover:bg-[#002d7a] text-white text-xs font-semibold rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" /> Add Block
          </button>
        </div>

        {blocks.length === 0 ? (
          <div className="text-center py-10 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200">
            <p className="text-sm text-neutral-500">No blocks yet. Click "Add Block" to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, bi) => (
              <div key={bi} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5 space-y-4">
                {/* Block Header */}
                <div className="flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_140px] gap-2">
                    <input
                      type="text"
                      value={block.title}
                      onChange={(e) => updateBlock(bi, { title: e.target.value.toUpperCase() })}
                      placeholder="BLOCK TITLE (e.g., REGULATIONS)"
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm font-bold uppercase focus:border-[#003DA5] focus:ring-2 focus:ring-blue-100 outline-none"
                    />
                    <select
                      value={block.color}
                      onChange={(e) => updateBlock(bi, { color: e.target.value })}
                      className={`px-3 py-2 border rounded-lg text-sm font-semibold uppercase ${COLOR_BG[block.color]}`}
                    >
                      {COLORS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => deleteBlock(bi)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Items */}
                <div className="pl-4 border-l-2 border-neutral-100 space-y-2">
                  {block.items.map((item, ii) => (
                    <div key={ii} className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                      {item.url.includes("drive.google") ? <Link2 className="w-4 h-4 text-blue-500 shrink-0" /> : <FileText className="w-4 h-4 text-[#C8102E] shrink-0" />}
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItemName(bi, ii, e.target.value)}
                        className="flex-1 px-2 py-1 bg-white border border-neutral-200 rounded text-xs font-medium focus:border-[#003DA5] outline-none"
                      />
                      {item.size && <span className="text-[10px] text-neutral-400 shrink-0">{item.size}</span>}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#003DA5] font-semibold underline shrink-0"
                      >
                        View
                      </a>
                      <button
                        onClick={() => deleteItem(bi, ii)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add Documents */}
                  <div className="space-y-3 mt-2">

                    {/* Option 1: Upload IMAGE only */}
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 transition-colors">
                      {uploading === `${bi}` ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      {uploading === `${bi}` ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploading === `${bi}`}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) uploadItem(bi, f);
                          e.target.value = '';
                        }}
                      />
                    </label>

                    {/* Option 2: Google Drive / External URL for PDFs */}
                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-4 space-y-2 bg-blue-50">
                      <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5" /> Add PDF via Google Drive Link
                      </p>
                      <p className="text-[10px] text-blue-600 leading-relaxed">
                        📌 <strong>For PDFs:</strong> Upload to Google Drive → right-click → Share → Copy link → set to "Anyone with the link" → paste below.
                      </p>
                      <input
                        type="text"
                        placeholder="Document name (e.g. Anti Ragging Committee 2025-26)"
                        value={linkInput[bi]?.name || ''}
                        onChange={(e) => setLinkInput((prev) => ({ ...prev, [bi]: { ...prev[bi], name: e.target.value } }))}
                        className="w-full px-3 py-2 text-xs border border-blue-200 rounded-lg focus:border-[#003DA5] outline-none bg-white"
                      />
                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="https://drive.google.com/file/d/..."
                          value={linkInput[bi]?.url || ''}
                          onChange={(e) => setLinkInput((prev) => ({ ...prev, [bi]: { ...prev[bi], url: e.target.value } }))}
                          className="flex-1 px-3 py-2 text-xs border border-blue-200 rounded-lg focus:border-[#003DA5] outline-none bg-white"
                        />
                        <button
                          onClick={() => addLinkItem(bi)}
                          className="px-4 py-2 bg-[#003DA5] hover:bg-[#002d7a] text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                        >
                          Add PDF
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-200 pt-4 pb-2 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-sm font-bold rounded-lg shadow-lg disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Page
        </button>
      </div>
    </div>
  );
}
