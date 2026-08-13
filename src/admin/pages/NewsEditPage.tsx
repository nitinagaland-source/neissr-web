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

const newsSchema = z.object({
  title: z.string().min(2, 'Article title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  category: z.string().min(1, 'Category is required'),
  summary: z.string().min(10, 'Short summary required (at least 10 characters)'),
  contentHtml: z.string().min(20, 'Article body content is required'),
  coverImageUrl: z.string().optional(),
  author: z.string().optional(),
  publishedAt: z.string().min(1, 'Published date is required'),
  status: z.enum(['published', 'draft']),
});

type NewsFormData = z.infer<typeof newsSchema>;

export default function NewsEditPage() {
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
  } = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      slug: '',
      category: 'academic',
      summary: '',
      contentHtml: '',
      coverImageUrl: '',
      author: 'NEISSR Media Desk',
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'published',
    },
  });

  const titleValue = watch('title');
  const coverImageUrlValue = watch('coverImageUrl');

  useEffect(() => {
    if (isNew && titleValue) {
      const generated = titleValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setValue('slug', generated, { shouldValidate: true, shouldDirty: true });
    }
  }, [titleValue, isNew, setValue]);

  useEffect(() => {
    if (!isNew && id) {
      getDoc(doc(db, 'news', id)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          reset({
            title: data.title || '',
            slug: data.slug || id,
            category: data.category || 'academic',
            summary: data.summary || '',
            contentHtml: data.contentHtml || '',
            coverImageUrl: data.coverImageUrl || '',
            author: data.author || 'NEISSR Media Desk',
            publishedAt: data.publishedAt ? data.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
            status: data.status || 'published',
          });
        } else {
          toast.error('Article not found.');
          navigate('/admin/news');
        }
        setLoadingDoc(false);
      });
    }
  }, [id, isNew, reset, navigate]);

  const onSubmit = async (data: NewsFormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      let targetId = id;

      if (isNew) {
        const ref = await addDoc(collection(db, 'news'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        targetId = ref.id;
      } else if (id) {
        await setDoc(doc(db, 'news', id), payload, { merge: true });
      }

      await logActivity(isNew ? 'create' : 'update', 'news', targetId || 'unknown');
      toast.success(`Article ${isNew ? 'published' : 'updated'} successfully.`);
      navigate('/admin/news');
    } catch {
      toast.error('Failed to save article.');
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
          onClick={() => navigate('/admin/news')}
          className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
          title="Back to News List"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-xl font-bold font-sans text-neutral-900">
            {isNew ? 'Publish News Article' : `Edit Article: ${watch('title')}`}
          </h2>
          <p className="text-xs text-neutral-500">
            Write full articles with rich text formatting, cover photos, and categorization.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Article Overview
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. NEISSR Hosts 8th Annual Peace Conference on Conflict Resolution"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
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
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('category')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white font-semibold focus:border-[#003DA5] focus:outline-none"
                >
                  <option value="academic">Academic & Research</option>
                  <option value="events">Events & Seminars</option>
                  <option value="peace-centre">Peace Centre Highlights</option>
                  <option value="fieldwork">Fieldwork & Rural Exposures</option>
                  <option value="general">General Announcements</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Published Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('publishedAt')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Author / Desk
                </label>
                <input
                  type="text"
                  {...register('author')}
                  placeholder="NEISSR Media Desk"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Publication Status <span className="text-red-500">*</span>
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
                Excerpt / Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                {...register('summary')}
                placeholder="A brief 2-sentence summary that appears in article listing cards..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
              />
              {errors.summary && (
                <p className="text-xs text-red-600 mt-1">{errors.summary.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Cover Photo Upload Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Article Cover Banner
          </h3>

          <FileUploader
            label="Upload Cover Image"
            accept="image/jpeg,image/png,image/webp"
            maxSizeMB={10}
            storagePath={`/news/${id || 'new'}/`}
            currentUrl={coverImageUrlValue}
            onUploadComplete={(url) => setValue('coverImageUrl', url, { shouldDirty: true })}
            onRemove={() => setValue('coverImageUrl', '', { shouldDirty: true })}
            hint="16:9 Landscape format recommended. Max 10MB"
          />
        </div>

        {/* Full Rich Text Article Content */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Article Content Body
          </h3>

          <Controller
            name="contentHtml"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label="Full Article Body"
                value={field.value || ''}
                onChange={field.onChange}
                required
              />
            )}
          />
          {errors.contentHtml && (
            <p className="text-xs text-red-600 font-semibold">{errors.contentHtml.message}</p>
          )}
        </div>

        <FormFooter
          onCancel={() => navigate('/admin/news')}
          saving={saving}
          isDirty={isDirty}
          saveLabel={isNew ? 'Publish Article' : 'Save Article'}
        />
      </form>
    </div>
  );
}
