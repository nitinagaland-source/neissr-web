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

const documentSchema = z.object({
  title: z.string().min(2, 'Document title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  category: z.string().min(1, 'Category is required'),
  fileUrl: z.string().min(5, 'File upload is required'),
  fileSize: z.string().optional(),
  description: z.string().optional(),
  publishedAt: z.string().min(1, 'Published date is required'),
  status: z.enum(['published', 'draft']),
});

type DocumentFormData = z.infer<typeof documentSchema>;

export default function DocumentEditPage() {
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
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      title: '',
      slug: '',
      category: 'prospectus',
      fileUrl: '',
      fileSize: '',
      description: '',
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'published',
    },
  });

  const titleValue = watch('title');
  const fileUrlValue = watch('fileUrl');

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
      getDoc(doc(db, 'documents', id)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          reset({
            title: data.title || '',
            slug: data.slug || id,
            category: data.category || 'prospectus',
            fileUrl: data.fileUrl || '',
            fileSize: data.fileSize || '',
            description: data.description || '',
            publishedAt: data.publishedAt ? data.publishedAt.split('T')[0] : new Date().toISOString().split('T')[0],
            status: data.status || 'published',
          });
        } else {
          toast.error('Document not found.');
          navigate('/admin/documents');
        }
        setLoadingDoc(false);
      });
    }
  }, [id, isNew, reset, navigate]);

  const onSubmit = async (data: DocumentFormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      let targetId = id;

      if (isNew) {
        const ref = await addDoc(collection(db, 'documents'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        targetId = ref.id;
      } else if (id) {
        await setDoc(doc(db, 'documents', id), payload, { merge: true });
      }

      await logActivity(isNew ? 'create' : 'update', 'documents', targetId || 'unknown');
      toast.success(`Document ${isNew ? 'uploaded' : 'updated'} successfully.`);
      navigate('/admin/documents');
    } catch {
      toast.error('Failed to save document.');
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
          onClick={() => navigate('/admin/documents')}
          className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
          title="Back to Documents"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-xl font-bold font-sans text-neutral-900">
            {isNew ? 'Upload Official Document' : `Edit Document: ${watch('title')}`}
          </h2>
          <p className="text-xs text-neutral-500">
            Configure title, category, PDF file upload, and publication date.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Document Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Document Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. Academic Prospectus 2026-2027"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  URL Identifier / Slug <span className="text-red-500">*</span>
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
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white focus:border-[#003DA5] focus:outline-none font-semibold"
                >
                  <option value="prospectus">Prospectus</option>
                  <option value="academic-calendar">Academic Calendar</option>
                  <option value="examination-manual">Examination Manual</option>
                  <option value="nirf">NIRF Report</option>
                  <option value="naac">NAAC Accreditation</option>
                  <option value="affiliations">Affiliation Order</option>
                  <option value="mandatory-disclosures">Mandatory Disclosures</option>
                  <option value="magazines">Magazines & Journals</option>
                  <option value="other">Other Official Document</option>
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
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white focus:border-[#003DA5] focus:outline-none font-semibold"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Short Description
              </label>
              <textarea
                rows={3}
                {...register('description')}
                placeholder="Provide context or instructions for this official document..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* PDF File Upload Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            File Upload
          </h3>

          <FileUploader
            label="Upload Document File (PDF Recommended)"
            accept="application/pdf,image/jpeg,image/png"
            maxSizeMB={50}
            storagePath={`/documents/${id || 'new'}/`}
            currentUrl={fileUrlValue}
            onUploadComplete={(url, name, size) => {
              setValue('fileUrl', url, { shouldDirty: true, shouldValidate: true });
              if (size) setValue('fileSize', size, { shouldDirty: true });
            }}
            onRemove={() => setValue('fileUrl', '', { shouldDirty: true, shouldValidate: true })}
            hint="PDF files up to 50MB."
          />
          {errors.fileUrl && (
            <p className="text-xs text-red-600 font-semibold">{errors.fileUrl.message}</p>
          )}
        </div>

        <FormFooter
          onCancel={() => navigate('/admin/documents')}
          saving={saving}
          isDirty={isDirty}
          saveLabel={isNew ? 'Upload Document' : 'Save Document'}
        />
      </form>
    </div>
  );
}
