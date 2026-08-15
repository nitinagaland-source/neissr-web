const CLOUD_NAME = 'qqfx65pe';
const UPLOAD_PRESET = 'neissr_uploads';

/**
 * Upload a file to Cloudinary.
 *
 * IMPORTANT — Cloudinary free plan has a 10MB per-file limit for unsigned uploads.
 * Larger files will fail with "File size too large".
 *
 * PDFs are uploaded as `image` resource type (Cloudinary supports it) so they
 * can be viewed inline in the browser and downloaded easily.
 */
export async function uploadToCloudinary(
  file: File,
  resourceType: 'image' | 'raw' | 'auto' | 'video' = 'auto'
): Promise<string> {
  // For PDFs, use `image` type so browsers can preview/download them
  let effectiveType: string = resourceType;
  if (resourceType === 'auto') {
    if (file.type.startsWith('image/')) effectiveType = 'image';
    else if (file.type.startsWith('video/')) effectiveType = 'video';
    else if (file.type === 'application/pdf') effectiveType = 'image'; // trick: viewable in browser
    else effectiveType = 'raw';
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${effectiveType}/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || 'Upload failed';
    // Common case: file too large on free plan
    if (msg.toLowerCase().includes('file size too large')) {
      throw new Error(
        'File too large. Cloudinary free plan allows up to 10MB per file. ' +
        'Compress the PDF or upgrade the Cloudinary account for larger files.'
      );
    }
    throw new Error(msg);
  }

  const data = await res.json();
  return data.secure_url as string;
}

/**
 * Convert a Cloudinary URL into a forced-download URL by injecting fl_attachment.
 * Works for image, raw, and video resource types.
 *
 * Example:
 *   in:  https://res.cloudinary.com/xx/image/upload/v123/file.pdf
 *   out: https://res.cloudinary.com/xx/image/upload/fl_attachment/v123/file.pdf
 */
export function toDownloadUrl(url: string, filename?: string): string {
  if (!url || !url.includes('/upload/')) return url;
  const flag = filename ? `fl_attachment:${encodeURIComponent(filename)}` : 'fl_attachment';
  // Only inject if not already present
  if (url.includes('fl_attachment')) return url;
  return url.replace('/upload/', `/upload/${flag}/`);
}

export function getResourceType(file: File): 'image' | 'raw' | 'video' {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf') return 'image'; // browser-friendly
  return 'raw';
}
