import React, { useRef, useState } from 'react';
import { uploadToCloudinary, getResourceType } from '../../lib/cloudinary';
import { toast } from 'sonner';
import { Upload, FileText, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
interface FileUploaderProps { label: string; accept: string; maxSizeMB: number; storagePath?: string; currentUrl?: string; onUploadComplete: (url: string, fileName: string, fileSize: string) => void; onRemove?: () => void; disabled?: boolean; hint?: string; }
export default function FileUploader({ label, accept, maxSizeMB, currentUrl, onUploadComplete, onRemove, disabled = false, hint }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const isImage = accept.includes('image');
  const isPdf = accept.includes('pdf');
  const formatFileSize = (bytes: number) => { if (bytes < 1024) return bytes + ' B'; if (bytes < 1024*1024) return (bytes/1024).toFixed(1)+' KB'; return (bytes/(1024*1024)).toFixed(1)+' MB'; };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const acceptedTypes = accept.split(',').map(t => t.trim());
    const isValidType = acceptedTypes.some(t => t.endsWith('/*') ? file.type.startsWith(t.replace('/*','')) : t === file.type);
    if (!isValidType) { toast.error('Invalid file type.'); return; }
    if (file.size > maxSizeMB * 1024 * 1024) { toast.error('File must be under ' + maxSizeMB + 'MB.'); return; }
    setPendingFile(file); handleUpload(file);
  };
  const handleUpload = async (file: File) => {
    setUploading(true); setProgress(0); setError(null);
    try {
      const url = await uploadToCloudinary(file, getResourceType(file), {
        onProgress: (percent) => setProgress(percent),
      });
      onUploadComplete(url, file.name, formatFileSize(file.size));
      toast.success('File uploaded successfully.');
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Upload failed. Retry?';
      setError(message);
      toast.error(message);
    } finally { setUploading(false); setProgress(0); }
  };
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      <input type="file" ref={inputRef} accept={accept} className="hidden" onChange={handleFileSelect} disabled={disabled||uploading} />
      {currentUrl && !uploading && (
        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
          {isImage ? <img src={currentUrl} alt="preview" className="h-20 w-20 object-cover rounded-lg border border-neutral-200 shrink-0" />
          : isPdf ? <div className="flex items-center gap-3"><FileText className="w-8 h-8 text-[#003DA5] shrink-0" /><div><p className="text-xs font-semibold text-neutral-800">Uploaded Document</p><a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#003DA5] underline">View File</a></div></div>
          : <div className="flex items-center gap-2"><ImageIcon className="w-6 h-6 text-[#003DA5]" /><span className="text-sm">File Uploaded</span></div>}
          {onRemove && <button type="button" onClick={onRemove} disabled={disabled} className="ml-auto text-xs text-red-600 font-semibold flex items-center gap-1 p-1 hover:bg-red-50 rounded"><X className="w-3.5 h-3.5" />Remove</button>}
        </div>
      )}
      {uploading && <div className="space-y-1 p-3 bg-blue-50/50 rounded-xl border border-blue-100"><div className="flex justify-between text-xs font-medium text-[#003DA5]"><span>Uploading...</span><span>{progress}%</span></div><div className="w-full bg-blue-200/60 rounded-full h-2"><div className="bg-[#003DA5] h-2 rounded-full transition-all" style={{width: progress+'%'}} /></div></div>}
      {error && !uploading && <div className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg border border-red-200 text-xs text-red-700"><span>{error}</span>{pendingFile && <button type="button" onClick={() => handleUpload(pendingFile)} className="font-bold underline flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" />Retry</button>}</div>}
      {!uploading && <button type="button" onClick={() => inputRef.current?.click()} disabled={disabled} className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 bg-white rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 shadow-sm"><Upload className="w-4 h-4 text-[#003DA5]" />{currentUrl ? 'Replace File' : 'Choose File'}</button>}
      <p className="text-[11px] text-neutral-400">{hint ?? (isPdf ? 'PDF file' : isImage ? 'JPG, PNG or WebP' : 'Media file') + ' � max ' + maxSizeMB + 'MB'}</p>
    </div>
  );
}
