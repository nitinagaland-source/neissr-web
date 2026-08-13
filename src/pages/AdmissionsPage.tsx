import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Phone, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { useQuery } from '@tanstack/react-query';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, '10-digit mobile number required'),
  email: z.string().email('Valid email required'),
  programme: z.string().min(1, 'Select a programme'),
  qualifyingMarks: z.string().min(1, 'Enter percentage/CGPA')
});

type FormData = z.infer<typeof formSchema>;

export default function AdmissionsPage() {
  const { data: admissionContent } = useQuery({
    queryKey: ['public-content-admissions'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return null;
      const snap = await getDoc(doc(db, 'content', 'admissions'));
      return snap.exists() ? snap.data() : null;
    },
  });

  const bannerTitle = admissionContent?.bannerTitle || "Admissions Open — BSW & MSW";
  const bannerSubtitle = admissionContent?.bannerSubtitle || "Join Nagaland's leading Social Work college. Affiliated to Nagaland University & NAAC B++ Accredited.";

  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      await addDoc(collection(db, 'enquiries'), {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        programmeInterested: data.programme,
        message: `Qualifying Marks: ${data.qualifyingMarks}`,
        sourcePage: 'admissions',
        status: 'new',
        createdAt: serverTimestamp(),
      });
      toast.success(`Application enquiry for ${data.fullName} submitted! Admission officer will contact you.`);
      reset();
    } catch {
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#C8102E] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Academic Session 2026-27</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">{bannerTitle}</h1>
          <p className="text-neutral-100 text-sm md:text-base max-w-2xl">
            {bannerSubtitle}
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info Left */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#C8102E] pl-3">
              Eligibility Criteria
            </h2>
            <div className="space-y-3 text-xs text-neutral-700">
              <div className="p-3 bg-[#FAF9F7] rounded-xl border border-neutral-200">
                <div className="font-bold text-[#C8102E]">Bachelor of Social Work (BSW)</div>
                <p className="mt-1">Passed 10+2 / HSSLC or equivalent in any stream with minimum 45% aggregate marks from a recognized board.</p>
              </div>
              <div className="p-3 bg-[#FAF9F7] rounded-xl border border-neutral-200">
                <div className="font-bold text-[#003DA5]">Master of Social Work (MSW)</div>
                <p className="mt-1">Bachelor&apos;s degree (BA, BSc, BCom, BSW, BBA or equivalent) with minimum 45% aggregate marks from Nagaland University or any recognized university.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h2 className="font-serif text-2xl font-bold text-neutral-900 border-l-4 border-[#003DA5] pl-3">
              Selection Process
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-xs text-neutral-700">
              <li>Online Application / On-campus form submission</li>
              <li>Scrutiny of academic transcripts and marksheets</li>
              <li>Personal Interview with the Admission Board</li>
              <li>Verification of certificates & seat confirmation</li>
            </ol>
          </div>

          <div className="bg-[#003DA5] text-white p-6 rounded-2xl space-y-2">
            <div className="text-xs font-semibold text-[#C9A227] uppercase">Admission Helplines</div>
            <div className="text-sm font-bold flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C9A227]" /> 6909617895 | 8787663564 | 8415948915 | 7085474171
            </div>
          </div>
        </div>

        {/* Application Form Right */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-md space-y-6">
          <div>
            <h3 className="font-serif font-bold text-2xl text-neutral-900">
              Online Admission Form 2026-27
            </h3>
            <p className="text-xs text-neutral-500 mt-1">Fill out your details below to begin the application process.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
              <input
                type="text"
                {...register('fullName')}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-xs"
                placeholder="Full Name as per Class X certificate"
              />
              {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-xs"
                  placeholder="Mobile number"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Email *</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-xs"
                  placeholder="Email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Programme *</label>
              <select {...register('programme')} className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-xs bg-white">
                <option value="">Select Programme</option>
                <option value="BSW">BSW — Bachelor of Social Work</option>
                <option value="MSW-CD">MSW — Community Development</option>
                <option value="MSW-YD">MSW — Youth Development</option>
                <option value="MSW-SED">MSW — Social Entrepreneurship</option>
                <option value="MSW-PCTS">MSW — Peace & Conflict Studies</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Percentage / CGPA *</label>
              <input
                type="text"
                {...register('qualifyingMarks')}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-xs"
                placeholder="e.g. 78.5% or 7.8 CGPA"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#C8102E] hover:bg-[#9A0C24] text-white py-3 rounded-full font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
