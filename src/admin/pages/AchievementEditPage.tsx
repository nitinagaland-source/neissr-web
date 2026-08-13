import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { logActivity } from '../../lib/activityLog';
import { toast } from 'sonner';
import FileUploader from '../components/FileUploader';
import FormFooter from '../components/FormFooter';
import { ArrowLeft } from 'lucide-react';

const achievementSchema = z.object({
  recipientName: z.string().min(2, 'Recipient name is required'),
  title: z.string().min(2, 'Award/Honour title is required'),
  category: z.enum(['student', 'faculty', 'institutional']),
  description: z.string().min(10, 'Description required'),
  date: z.string().min(1, 'Date is required'),
  imageUrl: z.string().optional(),
  status: z.enum(['published', 'draft']),
});

type AchievementFormData = z.infer<typeof achievementSchema>;

export default function AchievementEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(!isNew);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      recipientName: '',
      title: '',
      category: 'student',
      description: '',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '',
      status: 'published',
    },
  });

  const imageUrlValue = watch('imageUrl');

  useEffect(() => {
    if (!isNew && id) {
      getDoc(doc(db, 'achievements', id)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          reset({
            recipientName: data.recipientName || '',
            title: data.title || '',
            category: data.category || 'student',
            description: data.description || '',
            date: data.date || new Date().toISOString().split('T')[0],
            imageUrl: data.imageUrl || '',
            status: data.status || 'published',
          });
        } else {
          toast.error('Achievement record not found.');
          navigate('/admin/achievements');
        }
        setLoadingDoc(false);
      });
    }
  }, [id, isNew, reset, navigate]);

  const onSubmit = async (data: AchievementFormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      let targetId = id;

      if (isNew) {
        const ref = await addDoc(collection(db, 'achievements'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        targetId = ref.id;
      } else if (id) {
        await setDoc(doc(db, 'achievements', id), payload, { merge: true });
      }

      await logActivity(isNew ? 'create' : 'update', 'achievements', targetId || 'unknown');
      toast.success(`Achievement ${isNew ? 'created' : 'updated'} successfully.`);
      navigate('/admin/achievements');
    } catch {
      toast.error('Failed to save achievement.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingDoc) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#003DA5] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
        <button
          type="button"
          onClick={() => navigate('/admin/achievements')}
          className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
          title="Back to Achievements"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-xl font-bold font-sans text-neutral-900">
            {isNew ? 'Add Achievement / Award' : `Edit Achievement`}
          </h2>
          <p className="text-xs text-neutral-500">
            Configure recipient, award title, category, photo, and detailed description.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Achievement Information
          </h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Recipient Name / Entity <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('recipientName')}
                  placeholder="e.g. Ms. Sentila Ao (MSW Class of 2025)"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
                {errors.recipientName && (
                  <p className="text-xs text-red-600 mt-1">{errors.recipientName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white font-semibold focus:border-[#003DA5] focus:outline-none"
                >
                  <option value="student">Student Achievement</option>
                  <option value="faculty">Faculty Honour / Grant</option>
                  <option value="institutional">Institutional Recognition</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Award / Honour Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="e.g. Gold Medalist in University Examinations"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
                {errors.title && (
                  <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Date Awarded <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white font-semibold focus:border-[#003DA5] focus:outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Achievement Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                {...register('description')}
                placeholder="Describe the context, awarding body, and significance of this achievement..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Photo Upload Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Achievement Photo / Certificate
          </h3>

          <FileUploader
            label="Upload Photo or Certificate Image"
            accept="image/jpeg,image/png,image/webp"
            maxSizeMB={10}
            storagePath={`/achievements/${id || 'new'}/`}
            currentUrl={imageUrlValue}
            onUploadComplete={(url) => setValue('imageUrl', url, { shouldDirty: true })}
            onRemove={() => setValue('imageUrl', '', { shouldDirty: true })}
            hint="JPG, PNG or WebP image. Max 10MB"
          />
        </div>

        <FormFooter
          onCancel={() => navigate('/admin/achievements')}
          saving={saving}
          isDirty={isDirty}
          saveLabel={isNew ? 'Create Achievement' : 'Save Changes'}
        />
      </form>
    </div>
  );
}
