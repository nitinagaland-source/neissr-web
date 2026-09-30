import React, { useState } from 'react';
import { toast } from 'sonner';
import { uploadToCloudinary } from '../../lib/cloudinary';

type Props = {
  data: any;
  onChange: (field: string, value: any) => void;
};

export default function HeroCarouselManager({ data, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const images = Array.isArray(data.heroImages) ? data.heroImages : [];

  const removeImage = (index: number) => {
    onChange(
      'heroImages',
      images.filter((_: string, i: number) => i !== index)
    );
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;

    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange('heroImages', next);
  };

  const uploadImages = async (files: File[]) => {
    if (!files.length) return;

    setUploading(true);

    try {
      const uploaded = await Promise.all(
        files.map((file) => uploadToCloudinary(file, 'image'))
      );

      onChange('heroImages', [...images, ...uploaded]);
      toast.success(
        `${uploaded.length} hero image${uploaded.length === 1 ? '' : 's'} uploaded successfully.`
      );
    } catch (err: any) {
      toast.error(err?.message || 'Hero image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3 md:col-span-2">
      <div>
        <label className="text-xs font-semibold text-neutral-700">
          Hero Carousel Images
        </label>
        <p className="text-[11px] text-neutral-500 mt-1">
          Select multiple images from File Explorer. Their order below is the carousel order.
        </p>
      </div>

      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-5 text-center hover:border-[#003DA5] transition-colors">
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            void uploadImages(files);
            e.target.value = '';
          }}
        />

        <div className="text-sm font-semibold text-neutral-800">
          {uploading ? 'Uploading images...' : 'Choose Multiple Images'}
        </div>
        <div className="text-[11px] text-neutral-500 mt-1">
          JPG, PNG or WebP. You can select several files at once.
        </div>
      </label>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {images.map((url: string, index: number) => (
            <div
              key={`${url}-${index}`}
              className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
            >
              <img
                src={url}
                alt={`Hero carousel ${index + 1}`}
                className="w-full h-32 object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/65 px-2 py-2">
                <span className="text-[10px] font-semibold text-white">
                  Slide {index + 1}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    className="px-2 py-1 rounded bg-white/90 text-[10px] font-semibold text-neutral-800 disabled:opacity-40"
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={index === images.length - 1}
                    className="px-2 py-1 rounded bg-white/90 text-[10px] font-semibold text-neutral-800 disabled:opacity-40"
                  >
                    Right
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="px-2 py-1 rounded bg-red-600 text-[10px] font-semibold text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-[11px] text-neutral-500">
          No carousel images uploaded yet. The existing legacy hero image will remain until carousel images are added and saved.
        </div>
      )}
    </div>
  );
}
