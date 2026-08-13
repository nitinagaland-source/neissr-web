import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { SEED_FACULTY } from '../../data/seedData';
import { logActivity } from '../../lib/activityLog';
import { toast } from 'sonner';
import RichTextEditor from '../components/RichTextEditor';
import RepeatableField from '../components/RepeatableField';
import FormFooter from '../components/FormFooter';
import { ArrowLeft } from 'lucide-react';

const facultySchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  designation: z.string().min(2, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
  type: z.enum(['management', 'teaching', 'non-teaching']),
  order: z.number().int().min(1, 'Order must be a positive integer'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  status: z.enum(['published', 'draft']),
  photoUrl: z.string().optional(),
  qualifications: z.array(z.string()).min(1, 'At least one qualification required'),
  bioHtml: z.string().optional(),
});

type FacultyFormData = z.infer<typeof facultySchema>;

export default function FacultyEditPage() {
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
  } = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      fullName: '',
      slug: '',
      designation: '',
      department: 'MSW-CD',
      type: 'teaching',
      order: 99,
      email: '',
      status: 'published',
      photoUrl: '',
      qualifications: ['M.A. Social Work'],
      bioHtml: '',
    },
  });

  const fullNameValue = watch('fullName');
  const photoUrlValue = watch('photoUrl');
  const qualificationsValue = watch('qualifications') || [];

  // Auto-generate slug for new items
  useEffect(() => {
    if (isNew && fullNameValue) {
      const generated = fullNameValue
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setValue('slug', generated, { shouldValidate: true, shouldDirty: true });
    }
  }, [fullNameValue, isNew, setValue]);

  // Fetch document if editing
  useEffect(() => {
    if (!isNew && id) {
      if (!isFirebaseConfigured) {
        // Load from seed data for preview
        const seedMember = SEED_FACULTY.find((f) => f.id === id || f.slug === id);
        if (seedMember) {
          reset({
            fullName: seedMember.fullName || '',
            slug: seedMember.slug || id,
            designation: seedMember.designation || '',
            department: seedMember.department || 'MSW-CD',
            type: seedMember.type || 'teaching',
            order: seedMember.order ?? 99,
            email: seedMember.email || '',
            status: seedMember.status || 'published',
            photoUrl: seedMember.photoUrl || '',
            qualifications: seedMember.qualifications?.length ? seedMember.qualifications : ['M.A. Social Work'],
            bioHtml: seedMember.bioHtml || '',
          });
        }
        setLoadingDoc(false);
        return;
      }
      getDoc(doc(db, 'faculty', id)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          reset({
            fullName: data.fullName || '',
            slug: data.slug || id,
            designation: data.designation || '',
            department: data.department || 'MSW-CD',
            type: data.type || 'teaching',
            order: data.order ?? 99,
            email: data.email || '',
            status: data.status || 'published',
            photoUrl: data.photoUrl || '',
            qualifications: data.qualifications && data.qualifications.length ? data.qualifications : ['M.A. Social Work'],
            bioHtml: data.bioHtml || '',
          });
        } else {
          toast.error('Faculty record not found.');
          navigate('/admin/faculty');
        }
        setLoadingDoc(false);
      });
    }
  }, [id, isNew, reset, navigate]);

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }
    // If Firebase Storage is available, upload there
    if (isFirebaseConfigured) {
      try {
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
        const { storage } = await import('../../lib/firebase');
        const storageRef = ref(storage, `faculty/${id || 'new'}/${Date.now()}_${file.name}`);
        toast.info('Uploading photo...');
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        setValue('photoUrl', url, { shouldDirty: true });
        toast.success('Photo uploaded successfully.');
      } catch {
        toast.error('Upload failed. Paste an image URL below instead.');
      }
    } else {
      // In preview mode without Firebase, use a local object URL
      const objectUrl = URL.createObjectURL(file);
      setValue('photoUrl', objectUrl, { shouldDirty: true });
      toast.success('Photo selected (will upload when Firebase is connected).');
    }
  };

  const onSubmit = async (data: FacultyFormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      let targetId = id;

      if (isNew) {
        const ref = await addDoc(collection(db, 'faculty'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        targetId = ref.id;
      } else if (id) {
        await setDoc(doc(db, 'faculty', id), payload, { merge: true });
      }

      await logActivity(isNew ? 'create' : 'update', 'faculty', targetId || 'unknown');
      toast.success(`Faculty member ${isNew ? 'created' : 'updated'} successfully.`);
      navigate('/admin/faculty');
    } catch {
      toast.error('Failed to save faculty member.');
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
      {/* Header Back Button */}
      <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
        <button
          type="button"
          onClick={() => navigate('/admin/faculty')}
          className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
          title="Back to Faculty List"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-xl font-bold font-sans text-neutral-900">
            {isNew ? 'Add New Faculty Member' : `Edit: ${watch('fullName')}`}
          </h2>
          <p className="text-xs text-neutral-500">
            Configure profile info, designation, qualifications, photo, and professional biography.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('fullName')}
                placeholder="Dr. John Doe"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 focus:outline-none"
              />
              {errors.fullName && (
                <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('slug')}
                placeholder="dr-john-doe"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 focus:outline-none bg-neutral-50 font-mono"
              />
              {errors.slug && (
                <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('designation')}
                placeholder="Assistant Professor & HoD"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 focus:outline-none"
              />
              {errors.designation && (
                <p className="text-xs text-red-600 mt-1">{errors.designation.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                {...register('department')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 focus:outline-none bg-white"
              >
                <option value="Management">Management / Leadership</option>
                <option value="BSW">BSW — Bachelor of Social Work</option>
                <option value="MSW-CD">MSW — Community Development (CD)</option>
                <option value="MSW-YD">MSW — Youth Development (YD)</option>
                <option value="MSW-SED">MSW — Social Entrepreneurship (SED)</option>
                <option value="MSW-PCTS">MSW — Peace & Conflict Transformation (PCTS)</option>
                <option value="Non-Teaching">Non-Teaching Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Staff Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 focus:outline-none bg-white"
              >
                <option value="teaching">Teaching Faculty</option>
                <option value="management">Management Executive</option>
                <option value="non-teaching">Non-Teaching Administration</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Display Order <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('order', { valueAsNumber: true })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 focus:outline-none font-mono"
              />
              <p className="text-[10px] text-neutral-400 mt-1">Lower numbers appear first on faculty directory.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                {...register('email')}
                placeholder="faculty.name@neissr.ac.in"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Publication Status <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4 pt-2">
                <label className="inline-flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="radio"
                    value="published"
                    {...register('status')}
                    className="text-[#003DA5]"
                  />
                  <span>Published (Visible publicly)</span>
                </label>
                <label className="inline-flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                  <input
                    type="radio"
                    value="draft"
                    {...register('status')}
                    className="text-[#003DA5]"
                  />
                  <span>Draft (Hidden)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Upload Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Faculty Photograph
          </h3>

          <div className="space-y-4">
            {/* Photo Preview */}
            {photoUrlValue && (
              <div className="flex items-center gap-4">
                <img
                  src={photoUrlValue}
                  alt="Faculty photo preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200"
                />
                <button
                  type="button"
                  onClick={() => setValue('photoUrl', '', { shouldDirty: true })}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold underline"
                >
                  Remove Photo
                </button>
              </div>
            )}

            {/* File Picker */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Upload from Computer
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoFileChange}
                className="block w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#003DA5] file:text-white hover:file:bg-[#002d7a] cursor-pointer"
              />
              <p className="text-[10px] text-neutral-400 mt-1">
                1:1 Square headshot recommended. JPG, PNG or WebP — max 10MB.
              </p>
            </div>

            {/* Manual URL fallback */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Or paste an image URL
              </label>
              <input
                type="url"
                value={photoUrlValue || ''}
                onChange={(e) => setValue('photoUrl', e.target.value, { shouldDirty: true })}
                placeholder="https://example.com/photo.jpg"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Qualifications Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Academic Qualifications
          </h3>

          <RepeatableField<string>
            label="Degrees & Certifications"
            items={qualificationsValue}
            addLabel="Qualification"
            minItems={1}
            onAdd={() => {
              setValue('qualifications', [...qualificationsValue, ''], { shouldDirty: true });
            }}
            onRemove={(index) => {
              const updated = qualificationsValue.filter((_, i) => i !== index);
              setValue('qualifications', updated, { shouldDirty: true });
            }}
            renderItem={(item, index) => (
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const updated = [...qualificationsValue];
                  updated[index] = e.target.value;
                  setValue('qualifications', updated, { shouldDirty: true });
                }}
                placeholder="e.g., Ph.D. in Social Work (Nagaland University)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
              />
            )}
          />
          {errors.qualifications && (
            <p className="text-xs text-red-600 font-medium">{errors.qualifications.message}</p>
          )}
        </div>

        {/* Biography Rich Text Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Professional Biography & Research Interests
          </h3>

          <Controller
            name="bioHtml"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label="Profile Biography"
                value={field.value || ''}
                onChange={field.onChange}
                hint="Highlight research papers, teaching specialisations, field experiences, and awards."
              />
            )}
          />
        </div>

        {/* Sticky Form Footer */}
        <FormFooter
          onCancel={() => navigate('/admin/faculty')}
          saving={saving}
          isDirty={isDirty}
          saveLabel={isNew ? 'Create Faculty Member' : 'Save Changes'}
        />
      </form>
    </div>
  );
}
