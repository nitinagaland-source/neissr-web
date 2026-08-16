import React, { useRef, useState } from 'react';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { toast } from 'sonner';
import { Upload, FileText, Image as ImageIcon, X, RefreshCw, Link2, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  accept: string;
  maxSizeMB: number;
  storagePath: string; // kept for API compatibility (unused with Cloudinary)
  currentUrl?: string;
  onUploadComplete: (url: string, fileName: string, fileSize: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  hint?: string;
}

/**
 * Convert Google Drive share URL to a viewable URL, ensures preview works
 */
function normalizeUrl(url: string): string {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/view`;
  return url;
}

export default function FileUploader({
  label,
  accept,
  maxSizeMB,
  currentUrl,
  onUploadComplete,
  onRemove,
  disabled = false,
  hint,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkMode, setLinkMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const isImage = accept.includes('image');
  const isPdf = accept.includes('pdf') || accept.includes('.pdf');
  const isGDrive = currentUrl?.includes('drive.google') || currentUrl?.includes('docs.google');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    // Validate type
    const acceptedTypes = accept.split(',').map((t) => t.trim());
    const isValidType = acceptedTypes.some((t) => {
      if (t.endsWith('/*')) return file.type.startsWith(t.replace('/*', ''));
      if (t.startsWith('.')) return file.name.toLowerCase().endsWith(t.toLowerCase());
      return t === file.type;
    });
    if (!isValidType) { toast.error(`Invalid file type. Accepted: ${accept}`); return; }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File too large. Max ${maxSizeMB}MB.`);
      return;
    }

    setUploading(true); setError(null);
    try {
      // Cloudinary: images as 'image', pdf as 'image' (viewable), others 'raw'
      let type: 'image' | 'raw' | 'auto' = 'auto';
      if (file.type.startsWith('image/')) type = 'image';
      else if (file.type === 'application/pdf') type = 'image'; // pdf trick
      else type = 'raw';
      const url = await uploadToCloudinary(file, type);
      onUploadComplete(url, file.name, formatFileSize(file.size));
      toast.success('Uploaded successfully.');
    } catch (err: any) {
      const msg = err?.message || 'Upload failed.';
      setError(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleAddLink = () => {
    const trimmed = linkUrl.trim();
    if (!trimmed) { toast.error('Paste a URL first.'); return; }
    if (!trimmed.startsWith('http')) { toast.error('URL must start with https://'); return; }
    const normalized = normalizeUrl(trimmed);
    const displayName = trimmed.includes('drive.google')
      ? 'Google Drive File'
      : trimmed.split('/').pop()?.split('?')[0] || 'External Link';
    onUploadComplete(normalized, displayName, 'Link');
    setLinkUrl('');
    setLinkMode(false);
    toast.success('Link added.');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>

      <input
        type="file" ref={inputRef} accept={accept} className="hidden"
        onChange={handleFileSelect} disabled={disabled || uploading}
      />

      {/* Current file preview */}
      {currentUrl && !uploading && (
        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
          {isImage && !isGDrive ? (
            <img src={currentUrl} alt="Preview"
              className="h-20 w-20 object-cover rounded-lg border border-neutral-200 shrink-0 bg-white" />
          ) : (
            <div className="flex items-center gap-3 text-sm text-neutral-700 font-medium">
              {isGDrive ? <Link2 className="w-8 h-8 text-blue-500 shrink-0" /> :
                isPdf ? <FileText className="w-8 h-8 text-[#C8102E] shrink-0" /> :
                <ImageIcon className="w-8 h-8 text-[#003DA5] shrink-0" />}
              <div className="truncate max-w-[220px]">
                <p className="text-xs font-semibold text-neutral-800">
                  {isGDrive ? 'Google Drive Link' : isPdf ? 'Uploaded PDF' : 'Uploaded File'}
                </p>
                <a href={currentUrl} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-[#003DA5] underline">View File</a>
              </div>
            </div>
          )}
          {onRemove && (
            <button type="button" onClick={onRemove} disabled={disabled}
              className="ml-auto text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 p-1 hover:bg-red-50 rounded transition-colors" title="Remove">
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          )}
        </div>
      )}

      {/* Uploading indicator */}
      {uploading && (
        <div className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <Loader2 className="w-4 h-4 text-[#003DA5] animate-spin" />
          <span className="text-xs font-medium text-[#003DA5]">Uploading to Cloudinary...</span>
        </div>
      )}

      {/* Error */}
      {error && !uploading && (
        <div className="p-2.5 bg-red-50 rounded-lg border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Action buttons */}
      {!uploading && !linkMode && (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={disabled}
            className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 bg-white rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 disabled:opacity-50 shadow-sm">
            <Upload className="w-4 h-4 text-[#003DA5]" />
            {currentUrl ? 'Replace File' : 'Choose File'}
          </button>
          <button type="button" onClick={() => setLinkMode(true)} disabled={disabled}
            className="inline-flex items-center gap-2 px-4 py-2 border border-blue-300 bg-blue-50 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-50 shadow-sm">
            <Link2 className="w-4 h-4" />
            Paste Google Drive Link
          </button>
        </div>
      )}

      {/* Link input mode */}
      {linkMode && !uploading && (
        <div className="p-3 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200 space-y-2">
          <p className="text-xs font-bold text-blue-700 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5" /> Paste Google Drive Link
          </p>
          <p className="text-[10px] text-blue-600 leading-relaxed">
            Google Drive → right-click file → Share → Copy link → set "Anyone with the link" → paste below.
          </p>
          <div className="flex gap-2">
            <input type="url" placeholder="https://drive.google.com/file/d/..."
              value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-blue-200 rounded-lg focus:border-[#003DA5] outline-none bg-white" />
            <button type="button" onClick={handleAddLink}
              className="px-4 py-2 bg-[#003DA5] hover:bg-[#002d7a] text-white text-xs font-bold rounded-lg whitespace-nowrap">
              Add Link
            </button>
            <button type="button" onClick={() => { setLinkMode(false); setLinkUrl(''); }}
              className="px-3 py-2 border border-neutral-300 bg-white text-neutral-600 text-xs font-semibold rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}

      <p className="text-[11px] text-neutral-400">
        {hint ?? `${isPdf ? 'PDF file' : isImage ? 'JPG, PNG or WebP' : 'File'} — upload max ${maxSizeMB}MB, or paste Google Drive link (no size limit)`}
      </p>
    </div>
  );
}
