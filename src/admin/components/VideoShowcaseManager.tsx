import React, { useState } from 'react';
import { toast } from 'sonner';
import { uploadToCloudinary } from '../../lib/cloudinary';

type Props = {
  data: any;
  onChange: (field: string, value: any) => void;
};

export default function VideoShowcaseManager({ data, onChange }: Props) {
  const [uploading, setUploading] = useState<number | null>(null);
  const videos = Array.isArray(data.videoShowcase) ? data.videoShowcase : [];

  const update = (index: number, patch: Record<string, any>) => {
    const next = [...videos];
    next[index] = { ...next[index], ...patch };
    onChange('videoShowcase', next);
  };

  const add = () => {
    onChange('videoShowcase', [
      ...videos,
      {
        title: '',
        sourceType: 'upload',
        videoUrl: '',
        instagramUrl: '',
        featured: videos.length === 0,
      },
    ]);
  };

  const remove = (index: number) => {
    onChange('videoShowcase', videos.filter((_: any, i: number) => i !== index));
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= videos.length) return;
    const next = [...videos];
    [next[index], next[target]] = [next[target], next[index]];
    onChange('videoShowcase', next);
  };

  const setFeatured = (index: number) => {
    onChange(
      'videoShowcase',
      videos.map((video: any, i: number) => ({ ...video, featured: i === index }))
    );
  };

  const upload = async (index: number, file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a video file.');
      return;
    }

    setUploading(index);
    try {
      const url = await uploadToCloudinary(file, 'video');
      update(index, { sourceType: 'upload', videoUrl: url });
      toast.success('Video uploaded successfully.');
    } catch (err: any) {
      toast.error(err?.message || 'Video upload failed.');
    } finally {
      setUploading(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <div>
          <h3 className="font-bold text-neutral-900 text-base">Video Showcase Manager</h3>
          <p className="text-xs text-neutral-500 mt-1">
            Upload a video from File Explorer or paste a public Instagram Reel link.
          </p>
        </div>
        <button
          type="button"
          onClick={add}
          className="px-4 py-2 rounded-lg bg-[#003DA5] text-white text-xs font-bold hover:bg-[#002f80]"
        >
          + Add Video
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700">Section Heading</label>
          <input
            type="text"
            value={data.videoShowcaseTitle || ''}
            onChange={(e) => onChange('videoShowcaseTitle', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-neutral-700">Section Subtitle</label>
          <input
            type="text"
            value={data.videoShowcaseSubtitle || ''}
            onChange={(e) => onChange('videoShowcaseSubtitle', e.target.value)}
            className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg"
          />
        </div>
      </div>

      {videos.length === 0 && (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
          No videos added yet. Click Add Video.
        </div>
      )}

      <div className="space-y-4">
        {videos.map((video: any, index: number) => (
          <div key={index} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-bold text-sm text-neutral-900">
                Video {index + 1}
                {video.featured && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-[#C8102E] text-white text-[10px]">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="px-2.5 py-1 text-xs border rounded-md bg-white disabled:opacity-40">
                  Move Left
                </button>
                <button type="button" onClick={() => move(index, 1)} disabled={index === videos.length - 1} className="px-2.5 py-1 text-xs border rounded-md bg-white disabled:opacity-40">
                  Move Right
                </button>
                <button type="button" onClick={() => setFeatured(index)} className="px-2.5 py-1 text-xs border rounded-md bg-white">
                  Set Featured
                </button>
                <button type="button" onClick={() => remove(index)} className="px-2.5 py-1 text-xs rounded-md bg-red-50 text-red-600 border border-red-200">
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-neutral-700">Video Title</label>
              <input
                type="text"
                value={video.title || ''}
                onChange={(e) => update(index, { title: e.target.value })}
                placeholder="Example: Rural Camp Stories"
                className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => update(index, { sourceType: 'upload' })}
                className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                  video.sourceType !== 'instagram'
                    ? 'bg-[#003DA5] text-white border-[#003DA5]'
                    : 'bg-white text-neutral-700 border-neutral-200'
                }`}
              >
                Upload Video
              </button>
              <button
                type="button"
                onClick={() => update(index, { sourceType: 'instagram' })}
                className={`px-3 py-2 rounded-lg text-xs font-bold border ${
                  video.sourceType === 'instagram'
                    ? 'bg-[#C8102E] text-white border-[#C8102E]'
                    : 'bg-white text-neutral-700 border-neutral-200'
                }`}
              >
                Instagram Reel
              </button>
            </div>

            {video.sourceType === 'instagram' ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700">Public Instagram Reel URL</label>
                <input
                  type="url"
                  value={video.instagramUrl || ''}
                  onChange={(e) => update(index, { instagramUrl: e.target.value })}
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg"
                />
                <p className="text-[11px] text-neutral-500">The Reel must be public and allow embedding.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block cursor-pointer rounded-xl border-2 border-dashed border-neutral-300 bg-white p-6 text-center hover:border-[#003DA5] transition-colors">
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    disabled={uploading === index}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) upload(index, file);
                      e.target.value = '';
                    }}
                  />
                  <div className="text-sm font-bold text-neutral-800">
                    {uploading === index ? 'Uploading video...' : 'Choose Video from File Explorer'}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    MP4/WebM recommended. Current direct upload limit is approximately 10 MB.
                  </div>
                </label>

                {video.videoUrl && (
                  <video src={video.videoUrl} controls className="w-full max-h-48 rounded-lg bg-black object-cover" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
