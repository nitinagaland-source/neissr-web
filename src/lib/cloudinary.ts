const CLOUD_NAME = 'qqfx65pe';
const UPLOAD_PRESET = 'neissr_uploads';
export async function uploadToCloudinary(file, resourceType = 'image') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch('https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/' + resourceType + '/upload', { method: 'POST', body: formData });
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || 'Cloudinary upload failed'); }
  const data = await res.json();
  return data.secure_url;
}
export function getResourceType(file) { return file.type.startsWith('image/') ? 'image' : 'raw'; }
