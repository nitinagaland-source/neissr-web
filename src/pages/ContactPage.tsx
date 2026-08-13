import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const formSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitting(true);
      await addDoc(collection(db, 'enquiries'), {
        fullName: data.fullName,
        phone: '',
        email: data.email,
        programmeInterested: data.subject,
        message: data.message,
        sourcePage: 'contact',
        status: 'new',
        createdAt: serverTimestamp(),
      });
      toast.success(`Thank you ${data.fullName}! Your message has been sent to NEISSR Helpdesk.`);
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Get In Touch</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Contact & Location</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            We welcome inquiries from prospective trainees, research collaborators, NGO partners, and alumni.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-xl text-neutral-900 border-b border-neutral-100 pb-2">
              Campus Address
            </h2>
            <div className="space-y-3 text-xs text-neutral-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-neutral-900">Peace Centre Campus</div>
                  <p className="text-neutral-600 mt-0.5">
                    7th Mile, Chümoukedima,<br />
                    Nagaland — 797103, India
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                <Phone className="w-5 h-5 text-[#003DA5] shrink-0" />
                <div>
                  <div className="font-bold text-neutral-900">Helpline Phone</div>
                  <p className="text-neutral-600">6909617895 / 8787663564</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                <Mail className="w-5 h-5 text-[#C8102E] shrink-0" />
                <div>
                  <div className="font-bold text-neutral-900">Official Email</div>
                  <p className="text-neutral-600">contact.neissr@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100">
                <Clock className="w-5 h-5 text-[#003DA5] shrink-0" />
                <div>
                  <div className="font-bold text-neutral-900">Office Working Hours</div>
                  <p className="text-neutral-600">Monday – Saturday: 9:00 AM – 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-neutral-200 shadow-md space-y-6">
          <div>
            <h2 className="font-serif font-bold text-2xl text-neutral-900">Send Us a Direct Message</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Complete the contact form below and our administrative office will respond within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-xs focus:border-[#003DA5] focus:outline-none"
                  placeholder="Enter your name"
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Your Email Address *</label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-xs focus:border-[#003DA5] focus:outline-none"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Subject / Inquiry Type *</label>
              <input
                type="text"
                {...register('subject')}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-xs focus:border-[#003DA5] focus:outline-none"
                placeholder="e.g., Admission Inquiry, Research Collaboration, Fieldwork"
              />
              {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Message Content *</label>
              <textarea
                rows={5}
                {...register('message')}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-xs focus:border-[#003DA5] focus:outline-none"
                placeholder="Write your detailed inquiry here..."
              />
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#003DA5] hover:bg-[#002B75] text-white px-8 py-3 rounded-full font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
