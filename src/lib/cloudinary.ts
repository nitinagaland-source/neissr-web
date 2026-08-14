const CLOUD_NAME = 'qfqx65pe';
const UPLOAD_PRESET = 'neissr_uploads';

export type CloudinaryResourceType = 'image' | 'raw';

/**
 * Determines which Cloudinary resource type a file should be uploaded as.
 * - Images upload as "image".
 * - PDFs also upload as "image" — Cloudinary serves/previews PDFs reliably
 *   this way under an unsigned preset (the "raw" endpoint was the cause of
 *   stuck/failed document uploads).
 * - Anything else falls back to "raw".
 */
export function getResourceType(file: File): CloudinaryResourceType {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type === 'application/pdf') return 'image';
  return 'raw';
}

// Files can be up to 100MB (see DocumentEditPage), so allow a generous window.
const UPLOAD_TIMEOUT_MS = 5 * 60 * 1000;

export interface UploadToCloudinaryOptions {
  /** Called with an integer 0-100 as the upload progresses. Reaches 100 only after Cloudinary confirms success. */
  onProgress?: (percent: number) => void;
  /** Optional AbortSignal to cancel an in-flight upload. */
  signal?: AbortSignal;
}

interface CloudinaryResponse {
  secure_url?: string;
  error?: { message?: string };
}

/**
 * Uploads a file to Cloudinary via an unsigned preset using XMLHttpRequest,
 * so real upload progress is available through xhr.upload.onprogress
 * (fetch() cannot report upload progress).
 */
export function uploadToCloudinary(
  file: File,
  resourceType: CloudinaryResourceType = 'image',
  options: UploadToCloudinaryOptions = {}
): Promise<string> {
  const { onProgress, signal } = options;

  return new Promise<string>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new Error('Upload cancelled.'));
      return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
    xhr.open('POST', url, true);
    xhr.timeout = UPLOAD_TIMEOUT_MS;

    const onAbort = () => xhr.abort();
    const cleanup = () => {
      if (signal) signal.removeEventListener('abort', onAbort);
    };
    if (signal) signal.addEventListener('abort', onAbort);

    xhr.upload.onprogress = (event) => {
      if (!onProgress || !event.lengthComputable) return;
      // Cap real progress at 99% — 100% is only reported once Cloudinary
      // confirms the upload succeeded, in xhr.onload below.
      const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
      onProgress(percent);
    };

    xhr.onload = () => {
      cleanup();
      let data: CloudinaryResponse | null = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // non-JSON response, handled by the status check below
      }

      if (xhr.status >= 200 && xhr.status < 300 && data?.secure_url) {
        onProgress?.(100);
        resolve(data.secure_url);
      } else {
        reject(new Error(data?.error?.message || `Upload failed (status ${xhr.status}).`));
      }
    };

    xhr.onerror = () => {
      cleanup();
      reject(new Error('Network error during upload. Check your connection and try again.'));
    };

    xhr.ontimeout = () => {
      cleanup();
      reject(new Error('Upload timed out. Please try again.'));
    };

    xhr.onabort = () => {
      cleanup();
      reject(new Error('Upload cancelled.'));
    };

    xhr.send(formData);
  });
}
