import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { toast } from 'sonner';
import {
  FileText, Upload, X, Save, Loader2, Plus, Trash2,
  ChevronDown, ChevronUp, Link2, Check,
} from 'lucide-react';

interface DocumentItem { name: string; url: string; size?: string; }
interface Block { title: string; color: string; items: DocumentItem[]; }
interface BlockData {
  title: string;
  introHtml?: string;
  blocks: Block[];
  contactEmail?: string;
}

const COLORS = ['green', 'orange', 'blue', 'red', 'purple', 'amber'];
const COLOR_STYLE: Record<string, string> = {
  green:  'border-green-300  bg-green-50  text-green-800',
  orange: 'border-orange-300 bg-orange-50 text-orange-800',
  blue:   'border-blue-300   bg-blue-50   text-blue-800',
  red:    'border-red-300    bg-red-50    text-red-800',
  purple: 'border-purple-300 bg-purple-50 text-purple-800',
  amber:  'border-amber-300  bg-amber-50  text-amber-800',
};

interface Props { collectionName: string; docId: string; defaultTitle: string; }

export default function BlockEditor({ collectionName, docId, defaultTitle }: Props) {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [title, setTitle]       = useState(defaultTitle);
  const [intro, setIntro]       = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [blocks, setBlocks]     = useState<Block[]>([]);
  const [uploading, setUploading] = useState<number | null>(null);
  const [linkInputs, setLinkInputs] = useState<Record<number, { name: string; url: string }>>({});

  useEffect(() => {
    setLoading(true);
    setBlocks([]);
    getDoc(doc(db, collectionName, docId))
      .then((snap) => {
        if (snap.exists()) {
          const d = snap.data() as BlockData;
          setTitle(d.title || defaultTitle);
          setIntro(d.introHtml || '');
          setContactEmail(d.contactEmail || '');
          setBlocks(d.blocks || []);
        } else {
          setTitle(defaultTitle);
          setIntro(''); setContactEmail(''); setBlocks([]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [collectionName, docId, defaultTitle]);

  const persist = async (newBlocks: Block[], t = title, i = intro, e = contactEmail) => {
    await setDoc(
      doc(db, collectionName, docId),
      { title: t, introHtml: i, contactEmail: e, blocks: newBlocks, updatedAt: serverTimestamp() },
      { merge: true }
    );
  };

  const savePage = async () => {
    setSaving(true);
    try {
      await persist(blocks);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
      toast.success('Page saved.');
    } catch { toast.error('Save failed.'); }
    finally { setSaving(false); }
  };

  const addBlock = async () => {
    const next = [...blocks, { title: 'NEW SECTION', color: 'blue', items: [] }];
    setBlocks(next);
    try { await persist(next); toast.success('Block added.'); }
    catch { toast.error('Failed.'); }
  };

  const deleteBlock = async (bi: number) => {
    if (!confirm('Delete this block and all its documents?')) return;
    const next = blocks.filter((_, i) => i !== bi);
    setBlocks(next);
    try { await persist(next); toast.success('Block deleted.'); }
    catch { toast.error('Failed.'); }
  };

  const updateBlockField = (bi: number, patch: Partial<Block>) =>
    setBlocks((prev) => prev.map((b, i) => i === bi ? { ...b, ...patch } : b));

  const saveBlockField = async (currentBlocks: Block[]) => {
    try { await persist(currentBlocks); }
    catch { toast.error('Failed to save.'); }
  };

  const deleteItem = async (bi: number, ii: number) => {
    if (!confirm('Delete this document?')) return;
    const next = blocks.map((b, i) =>
      i === bi ? { ...b, items: b.items.filter((_, x) => x !== ii) } : b
    );
    setBlocks(next);
    try { await persist(next); toast.success('Document deleted.'); }
    catch { toast.error('Failed to delete.'); }
  };

  const renameItem = (bi: number, ii: number, name: string) =>
    setBlocks((prev) =>
      prev.map((b, i) =>
        i === bi ? { ...b, items: b.items.map((it, x) => x === ii ? { ...it, name } : it) } : b
      )
    );

  const uploadImage = async (bi: number, file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Images only.'); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error('Max 10MB.'); return; }
    setUploading(bi);
    try {
      const url = await uploadToCloudinary(file, 'image');
      const size = file.size < 1048576
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / 1048576).toFixed(1)} MB`;
      const next = blocks.map((b, i) =>
        i === bi ? { ...b, items: [...b.items, { name: file.name.replace(/\.[^/.]+$/, ''), url, size }] } : b
      );
      setBlocks(next);
      await persist(next);
      toast.success('Image uploaded and saved.');
    } catch (e: any) { toast.error(e?.message || 'Upload failed.'); }
    finally { setUploading(null); }
  };

  const addLink = async (bi: number) => {
    const inp = linkInputs[bi];
    if (!inp?.url?.trim()) { toast.error('Paste a URL first.'); return; }
    if (!inp?.name?.trim()) { toast.error('Enter a document name.'); return; }
    const next = blocks.map((b, i) =>
      i === bi ? { ...b, items: [...b.items, { name: inp.name.trim(), url: inp.url.trim() }] } : b
    );
    setBlocks(next);
    setLinkInputs((p) => ({ ...p, [bi]: { name: '', url: '' } }));
    try { await persist(next); toast.success('PDF link added and saved.'); }
    catch { toast.error('Failed to save link.'); }
  };

  if (loading) return (
    <div className="flex items-center gap-2 py-8 text-sm text-neutral-500">
      <Loader2 className="w-4 h-4 animate-spin" /> Loading…
    </div>
  );

  return (
    <div className="space-y-6 pb-6">

      {/* Page basics */}
      <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-5 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-600 mb-1">Page Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#003DA5] outline-none" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-600 mb-1">Introduction (HTML)</label>
          <textarea rows={5} value={intro} onChange={(e) => setIntro(e.target.value)}
            placeholder="<p>Write intro text here…</p>"
            className="w-full px-3 py-2 font-mono text-xs border border-neutral-300 rounded-lg focus:border-[#003DA5] outline-none resize-y" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-neutral-600 mb-1">Contact Email (optional)</label>
          <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
            placeholder="contact.neissr@gmail.com"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:border-[#003DA5] outline-none" />
        </div>
      </div>

      {/* Blocks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Document Blocks</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Add/delete saves instantly. No need to click Save Page for documents.</p>
          </div>
          <button onClick={addBlock}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#003DA5] hover:bg-[#002d7a] text-white text-xs font-bold rounded-lg">
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
              <div key={bi} className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">

                {/* Block header row */}
                <div className="flex items-center gap-2 p-4 border-b border-neutral-100 bg-neutral-50">
                  <input
                    value={block.title}
                    onChange={(e) => updateBlockField(bi, { title: e.target.value.toUpperCase() })}
                    onBlur={() => saveBlockField(blocks)}
                    placeholder="SECTION TITLE"
                    className="flex-1 px-3 py-1.5 border border-neutral-300 rounded-lg text-sm font-bold uppercase focus:border-[#003DA5] outline-none"
                  />
                  <select
                    value={block.color}
                    onChange={(e) => {
                      const next = blocks.map((b, i) => i === bi ? { ...b, color: e.target.value } : b);
                      setBlocks(next);
                      saveBlockField(next);
                    }}
                    className={`px-3 py-1.5 border rounded-lg text-xs font-bold uppercase ${COLOR_STYLE[block.color] || COLOR_STYLE.blue}`}
                  >
                    {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button onClick={() => deleteBlock(bi)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-200" title="Delete block">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Items */}
                <div className="p-4 space-y-2">
                  {block.items.length === 0 && (
                    <p className="text-xs text-neutral-400 italic pb-1">No documents yet.</p>
                  )}
                  {block.items.map((item, ii) => (
                    <div key={ii} className="flex items-center gap-2 p-2.5 bg-neutral-50 rounded-lg border border-neutral-200">
                      {item.url.includes('drive.google') || item.url.includes('docs.google')
                        ? <Link2 className="w-4 h-4 text-blue-500 shrink-0" />
                        : <FileText className="w-4 h-4 text-[#C8102E] shrink-0" />}
                      <input
                        value={item.name}
                        onChange={(e) => renameItem(bi, ii, e.target.value)}
                        onBlur={() => saveBlockField(blocks)}
                        className="flex-1 px-2 py-1 bg-white border border-neutral-200 rounded text-xs font-medium focus:border-[#003DA5] outline-none min-w-0"
                      />
                      {item.size && <span className="text-[10px] text-neutral-400 shrink-0">{item.size}</span>}
                      {item.url.includes('drive.google') && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded shrink-0">GDrive</span>
                      )}
                      <a href={item.url} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] text-[#003DA5] font-semibold underline shrink-0">View</a>
                      <button onClick={() => deleteItem(bi, ii)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded border border-red-200 shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Add options */}
                  <div className="pt-2 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-700">
                      {uploading === bi ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                      {uploading === bi ? 'Uploading...' : 'Upload Image'}
                      <input type="file" accept="image/*" className="hidden" disabled={uploading === bi}
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(bi, f); e.target.value = ''; }} />
                    </label>

                    <div className="border-2 border-dashed border-blue-200 rounded-lg p-3 space-y-2 bg-blue-50">
                      <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
                        <Link2 className="w-3.5 h-3.5" /> Add PDF via Google Drive
                      </p>
                      <p className="text-[10px] text-blue-600 leading-relaxed">
                        Google Drive → right-click PDF → Share → Copy link → set "Anyone with the link" → paste below.
                      </p>
                      <input type="text" placeholder="Document name (e.g. Anti Ragging Policy 2025-26)"
                        value={linkInputs[bi]?.name || ''}
                        onChange={(e) => setLinkInputs((p) => ({ ...p, [bi]: { ...p[bi], name: e.target.value } }))}
                        className="w-full px-2 py-1.5 text-xs border border-blue-200 rounded-lg focus:border-[#003DA5] outline-none bg-white" />
                      <div className="flex gap-2">
                        <input type="url" placeholder="https://drive.google.com/file/d/..."
                          value={linkInputs[bi]?.url || ''}
                          onChange={(e) => setLinkInputs((p) => ({ ...p, [bi]: { ...p[bi], url: e.target.value } }))}
                          className="flex-1 px-2 py-1.5 text-xs border border-blue-200 rounded-lg focus:border-[#003DA5] outline-none bg-white" />
                        <button onClick={() => addLink(bi)}
                          className="px-4 py-1.5 bg-[#003DA5] hover:bg-[#002d7a] text-white text-xs font-bold rounded-lg whitespace-nowrap">
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

      {/* Sticky save bar */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-200 pt-4 pb-2 flex items-center justify-between">
        <p className="text-xs text-neutral-500">Documents auto-save. Click "Save Page" only after editing title or intro text.</p>
        <button onClick={savePage} disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-sm font-bold rounded-lg shadow disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Page'}
        </button>
      </div>
    </div>
  );
}
