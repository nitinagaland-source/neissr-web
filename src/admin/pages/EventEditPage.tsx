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

const eventSchema = z.object({
  title: z.string().min(2, 'Event title is required'),
  slug: z.string().min(2, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
  eventDate: z.string().min(1, 'Event date is required'),
  time: z.string().optional(),
  venue: z.string().min(2, 'Venue is required'),
  organizer: z.string().optional(),
  descriptionHtml: z.string().min(20, 'Event description is required'),
  bannerUrl: z.string().optional(),
  registrationLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  status: z.enum(['published', 'draft']),
});

type EventFormData = z.infer<typeof eventSchema>;

export default function EventEditPage() {
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
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      slug: '',
      eventDate: new Date().toISOString().split('T')[0],
      time: '09:30 AM – 04:00 PM',
      venue: 'Peace Centre Auditorium, NEISSR Campus',
      organizer: 'NEISSR Academic Council',
      descriptionHtml: '',
      bannerUrl: '',
      registrationLink: '',
      status: 'published',
    },
  });

  const titleValue = watch('title');
  const bannerUrlValue = watch('bannerUrl');

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
      getDoc(doc(db, 'events', id)).then((snap) => {
        if (snap.exists()) {
          const data = snap.data();
          reset({
            title: data.title || '',
            slug: data.slug || id,
            eventDate: data.eventDate || new Date().toISOString().split('T')[0],
            time: data.time || '',
            venue: data.venue || '',
            organizer: data.organizer || '',
            descriptionHtml: data.descriptionHtml || '',
            bannerUrl: data.bannerUrl || '',
            registrationLink: data.registrationLink || '',
            status: data.status || 'published',
          });
        } else {
          toast.error('Event not found.');
          navigate('/admin/events');
        }
        setLoadingDoc(false);
      });
    }
  }, [id, isNew, reset, navigate]);

  const onSubmit = async (data: EventFormData) => {
    setSaving(true);
    try {
      const payload = {
        ...data,
        updatedAt: serverTimestamp(),
      };

      let targetId = id;

      if (isNew) {
        const ref = await addDoc(collection(db, 'events'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        targetId = ref.id;
      } else if (id) {
        await setDoc(doc(db, 'events', id), payload, { merge: true });
      }

      await logActivity(isNew ? 'create' : 'update', 'events', targetId || 'unknown');
      toast.success(`Event ${isNew ? 'created' : 'updated'} successfully.`);
      navigate('/admin/events');
    } catch {
      toast.error('Failed to save event.');
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
          onClick={() => navigate('/admin/events')}
          className="p-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-600 transition-colors"
          title="Back to Events List"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h2 className="text-xl font-bold font-sans text-neutral-900">
            {isNew ? 'Schedule New Event' : `Edit Event: ${watch('title')}`}
          </h2>
          <p className="text-xs text-neutral-500">
            Configure date, time, venue, description, registration links, and promotional banner.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Event Details
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. National Seminar on Youth Empowerment & Social Work"
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
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('eventDate')}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
                {errors.eventDate && (
                  <p className="text-xs text-red-600 mt-1">{errors.eventDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Event Time / Hours
                </label>
                <input
                  type="text"
                  {...register('time')}
                  placeholder="09:30 AM – 04:00 PM"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Venue / Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('venue')}
                  placeholder="Peace Centre Auditorium, NEISSR Campus"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
                {errors.venue && (
                  <p className="text-xs text-red-600 mt-1">{errors.venue.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Organizing Club / Dept
                </label>
                <input
                  type="text"
                  {...register('organizer')}
                  placeholder="Youth Development Forum"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  External Registration URL (Optional)
                </label>
                <input
                  type="url"
                  {...register('registrationLink')}
                  placeholder="https://forms.google.com/..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:outline-none font-mono"
                />
                {errors.registrationLink && (
                  <p className="text-xs text-red-600 mt-1">{errors.registrationLink.message}</p>
                )}
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

        {/* Event Banner Upload Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Event Poster Banner
          </h3>

          <FileUploader
            label="Upload Promotional Poster"
            accept="image/jpeg,image/png,image/webp"
            maxSizeMB={10}
            storagePath={`/events/${id || 'new'}/`}
            currentUrl={bannerUrlValue}
            onUploadComplete={(url) => setValue('bannerUrl', url, { shouldDirty: true })}
            onRemove={() => setValue('bannerUrl', '', { shouldDirty: true })}
            hint="Landscape banner image. Max 10MB"
          />
        </div>

        {/* Event Description Rich Text */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-100 pb-2">
            Detailed Schedule & Agenda
          </h3>

          <Controller
            name="descriptionHtml"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label="Event Agenda & Speaker Details"
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
          onCancel={() => navigate('/admin/events')}
          saving={saving}
          isDirty={isDirty}
          saveLabel={isNew ? 'Create Event' : 'Save Changes'}
        />
      </form>
    </div>
  );
}
