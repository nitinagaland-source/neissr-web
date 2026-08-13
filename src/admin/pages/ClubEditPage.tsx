import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { logActivity } from '../../lib/activityLog';
import { toast } from 'sonner';
import FileUploader from '../components/FileUploader';
import RichTextEditor from '../components/RichTextEditor';
import FormFooter from '../components/FormFooter';
import { ArrowLeft } from 'lucide-react';

const clubSchema = z.object({
  name: z.string().min(2, 'Club name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  tagline: z.string().optional(),
  facultyAdvisor: z.string().optional(),
  studentIncharge: z.string().optional(),
  descriptionHtml: z.string().min(20, 'Club description is required'),
  imageUrl: z.string().optional(),
  status: z.enum(['published', 'draft']),
});

type ClubFormData = z.infer<typeof clubSchema>;

export default function ClubEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [loadingDoc, setLoadingDoc] = useState(!isNew);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<ClubFormData>({
    resolver: zodResolver(clubSchema),
    defaultValues: {
      name: '',
      slug: '',
      tagline: '',
      facultyAdvisor: '',
      studentIncharge: '',
      descriptionHtml: '',
      imageUrl: '',
      status: 'published',
    },
  });

  const nameValue = watch('name');
  const imageUrlValue = watch('imageUrl');

  useEffect(() => {
    if (isNew && nameValue) {
      const generated = nameValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setValue('slug', generated, { shouldValidate: true, shouldDirty: true });
    }
  }, [nameValue, isNew, setValue]);

  useEffect(() => {
    if (!isNew && id) {
      getDoc(doc(db, 'clubs', id)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          reset({
            name: data.name || '',
            slug: data.slug || id,
            tagline: data.tagline || '',
            facultyAdvisor: data.facultyAdvisor || '',
            studentIncharge: data.studentIncharge || '',
            descriptionHtml: data.descriptionHtml || '',
            imageUrl: data.imageUrl || '',
            status: data.status || 'published',
          });
        } else {
          toast.error('Club not found.');
          navigate('/admin/clubs');
        }
        setLoadingDoc(false);
      });
    }
  }, [id, isNew, reset, navigate]);

  const onSubmit = async (data: ClubFormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      let targetId = id;

      if (isNew) {
        const ref = await addDoc(collection(db, 'clubs'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        targetId = ref.id;
      } else if (id) {
        await setDoc(doc(db, 'clubs', id), payload, { merge: true });
      }

      await logActivity(isNew ? 'create' : 'update', 'clubs', targetId || 'unknown');
      toast.success(`Club ${isNew ? 'created' : 'updated'} successfully.`);
      navigate('/admin/clubs');
    } catch {
      toast.error('Failed to save club.');
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
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
        <button
          type="button"
          onClick={() => navigate('/admin/clubs')}
          className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
          title="Back to Clubs"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-xl font-bold font-sans text-neutral-900">
            {isNew ? 'Register New Student Club' : `Edit Club: ${watch('name')}`}
          </h2>
          <p className="text-xs text-neutral-500">
            Configure club objectives, faculty advisor, student convenors, and promotional logo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Club Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Club Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="e.g. Red Ribbon Club & Community Health Forum"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('slug')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-neutral-50 font-mono focus:border-[#003DA5] focus:outline-none"
                />
                {errors.slug && (
                  <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  {...register('tagline')}
                  placeholder="Empowering communities through health advocacy"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Faculty Advisor
                </label>
                <input
                  type="text"
                  {...register('facultyAdvisor')}
                  placeholder="Dr. Jane Smith"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Student Convenor / In-Charge
                </label>
                <input
                  type="text"
                  {...register('studentIncharge')}
                  placeholder="Mr. Thomas Ao (MSW Final Year)"
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
          </div>
        </div>

        {/* Logo Upload Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Club Logo / Badge Image
          </h3>

          <FileUploader
            label="Upload Club Emblem"
            accept="image/jpeg,image/png,image/webp"
            maxSizeMB={10}
            storagePath={`/clubs/${id || 'new'}/`}
            currentUrl={imageUrlValue}
            onUploadComplete={(url) => setValue('imageUrl', url, { shouldDirty: true })}
            onRemove={() => setValue('imageUrl', '', { shouldDirty: true })}
            hint="Square image or transparent logo. Max 10MB"
          />
        </div>

        {/* Club Description Rich Text */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Objectives, Key Activities & Membership
          </h3>

          <Controller
            name="descriptionHtml"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label="Detailed Overview & Action Plan"
                value={field.value || ''}
                onChange={field.onChange}
                required
              />
            )}
          />
          {errors.descriptionHtml && (
            <p className="text-xs text-red-600 font-semibold">{errors.descriptionHtml.message}</p>
          )}
        </div>

        <FormFooter
          onCancel={() => navigate('/admin/clubs')}
          saving={saving}
          isDirty={isDirty}
          saveLabel={isNew ? 'Create Club' : 'Save Changes'}
        />
      </form>
    </div>
  );
}
