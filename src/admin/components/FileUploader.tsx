import React, { useRef, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { toast } from 'sonner';
import { Upload, FileText, Image as ImageIcon, X, RefreshCw } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  accept: string;
  maxSizeMB: number;
  storagePath: string;
  currentUrl?: string;
  onUploadComplete: (url: string, fileName: string, fileSize: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  hint?: string;
}

export default function FileUploader({
  label,
  accept,
  maxSizeMB,
  storagePath,
  currentUrl,
  onUploadComplete,
  onRemove,
  disabled = false,
  hint,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const isImage = accept.includes('image');
  const isPdf = accept.includes('pdf');

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const acceptedTypes = accept.split(',').map((t) => t.trim());
    const fileType = file.type;
    const isValidType = acceptedTypes.some((t) => {
      if (t.endsWith('/*')) {
        return fileType.startsWith(t.replace('/*', ''));
      }
      return t === fileType;
    });

    if (!isValidType) {
      toast.error(`Invalid file type. Accepted types: ${accept}`);
      return;
    }

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File is too large. Maximum allowed size is ${maxSizeMB}MB.`);
      return;
    }

    setPendingFile(file);
    handleUpload(file);
  };

  const handleUpload = (file: File) => {
    setUploading(true);
    setProgress(0);
    setError(null);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${safeName}`;
    const fullPath = storagePath.endsWith('/')
      ? `${storagePath}${filename}`
      : `${storagePath}/${filename}`;

    const storageRef = ref(storage, fullPath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        setProgress(pct);
      },
      (err) => {
        console.error('Upload error:', err);
        setError('Upload failed. Please check your connection and retry.');
        setUploading(false);
        toast.error('File upload failed.');
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(url, file.name, formatFileSize(file.size));
          setUploading(false);
          setProgress(0);
          toast.success('File uploaded successfully.');
        } catch {
          setError('Failed to retrieve file URL.');
          setUploading(false);
          toast.error('Failed to retrieve uploaded file URL.');
        }
      }
    );
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>

      {/* Native OS hidden file input */}
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        className="hidden"
        onChange={handleFileSelect}
        disabled={disabled || uploading}
      />

      {/* Current File Preview */}
      {currentUrl && !uploading && (
        <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
          {isImage ? (
            <img
              src={currentUrl}
              alt="Uploaded file preview"
              className="h-20 w-20 object-cover rounded-lg border border-neutral-200 shrink-0 bg-white"
            />
          ) : isPdf ? (
            <div className="flex items-center gap-3 text-sm text-neutral-700 font-medium">
              <FileText className="w-8 h-8 text-[#003DA5] shrink-0" />
              <div className="truncate max-w-[220px]">
                <p className="text-xs font-semibold text-neutral-800">Uploaded Document</p>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#003DA5] underline"
                >
                  View File
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-neutral-700">
              <ImageIcon className="w-6 h-6 text-[#003DA5] shrink-0" />
              <span className="truncate max-w-[200px]">File Uploaded</span>
            </div>
          )}

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="ml-auto text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 p-1 hover:bg-red-50 rounded transition-colors"
              title="Remove file"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          )}
        </div>
      )}

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-1 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
          <div className="flex justify-between items-center text-xs font-medium text-[#003DA5]">
            <span>Uploading file...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#003DA5] h-2 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error Retry */}
      {error && !uploading && (
        <div className="flex items-center justify-between p-2.5 bg-red-50 rounded-lg border border-red-200 text-xs text-red-700">
          <span>{error}</span>
          {pendingFile && (
            <button
              type="button"
              onClick={() => handleUpload(pendingFile)}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-700 underline hover:text-red-900"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry
            </button>
          )}
        </div>
      )}

      {/* Choose File Button */}
      {!uploading && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="inline-flex items-center gap-2 px-4 py-2 border border-neutral-300 bg-white rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          <Upload className="w-4 h-4 text-[#003DA5]" />
          {currentUrl ? 'Replace File' : 'Choose File'}
        </button>
      )}

      <p className="text-[11px] text-neutral-400">
        {hint ?? `${isPdf ? 'PDF file' : isImage ? 'JPG, PNG or WebP' : 'Media file'} — max ${maxSizeMB}MB`}
      </p>
    </div>
  );
}
