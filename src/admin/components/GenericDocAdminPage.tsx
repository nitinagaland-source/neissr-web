import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import FileUploader from "../components/FileUploader";
import { toast } from "sonner";
import { Plus, Trash2, X, FileText, ExternalLink } from "lucide-react";

interface DocItem {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  publishedAt?: string;
}

interface GenericDocAdminPageProps {
  title: string;
  subtitle: string;
  collectionName: string;
  accentColor?: string;
}

export default function GenericDocAdminPage({ title, subtitle, collectionName, accentColor = "#003DA5" }: GenericDocAdminPageProps) {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newFileUrl, setNewFileUrl] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);

  const { data: items = [] } = useQuery({
    queryKey: [collectionName],
    queryFn: async () => {
      const snap = await getDocs(collection(db, collectionName));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as DocItem[];
    },
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newFileUrl) { toast.error("Title and file/link required."); return; }
    setSaving(true);
    try {
      await addDoc(collection(db, collectionName), {
        title: newTitle,
        description: newDesc,
        fileUrl: newFileUrl,
        publishedAt: newDate,
        createdAt: serverTimestamp(),
      });
      toast.success("Document added.");
      setModalOpen(false);
      setNewTitle(""); setNewDesc(""); setNewFileUrl(""); setNewDate(new Date().toISOString().split("T")[0]);
      qc.invalidateQueries({ queryKey: [collectionName] });
    } catch { toast.error("Failed to save."); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this document?")) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success("Deleted.");
      qc.invalidateQueries({ queryKey: [collectionName] });
    } catch { toast.error("Failed to delete."); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#003DA5] text-white font-semibold text-xs rounded-lg hover:bg-[#002d7a] transition-colors shadow-sm shrink-0">
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      <div className="space-y-3">
        {items.length === 0 && (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center text-neutral-400 text-sm">No documents yet. Click "Add Document" to upload.</div>
        )}
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#003DA5]/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-[#003DA5]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-800 text-sm truncate">{item.title}</p>
              {item.description && <p className="text-xs text-neutral-500 truncate">{item.description}</p>}
              {item.publishedAt && <p className="text-xs text-neutral-400 mt-0.5">{item.publishedAt}</p>}
            </div>
            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-500 hover:text-[#003DA5]" title="View">
              <ExternalLink className="w-4 h-4" />
            </a>
            <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg border border-red-100 hover:bg-red-50 text-red-500" title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-xl border border-neutral-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-bold text-neutral-900 text-lg">Add Document</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="p-1 text-neutral-400 hover:text-neutral-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Document Title *</label>
              <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg" placeholder="e.g. Annual Report 2025" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Description</label>
              <textarea rows={2} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg" placeholder="Brief description..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Date</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg" />
            </div>
            <FileUploader
              label="Upload Document or Image *"
              accept="application/pdf,image/jpeg,image/png,image/webp"
              maxSizeMB={20}
              storagePath={collectionName}
              currentUrl={newFileUrl}
              onUploadComplete={(url) => setNewFileUrl(url)}
              onRemove={() => setNewFileUrl("")}
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-neutral-600 bg-neutral-100 rounded-lg">Cancel</button>
              <button type="submit" disabled={saving} className="px-5 py-2 text-xs font-semibold text-white bg-[#003DA5] rounded-lg hover:bg-[#002d7a]">{saving ? "Saving..." : "Add Document"}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}