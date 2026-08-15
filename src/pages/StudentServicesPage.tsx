import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  GraduationCap, MessageCircle, Shield, ClipboardList,
  Heart, Users, BookOpen, Briefcase, ChevronRight,
  FileText, Download, ArrowLeft, Star, X, Loader2
} from 'lucide-react';

const SERVICES = [
  { id: 'scholarship', label: 'Scholarship', icon: GraduationCap, color: 'blue', description: 'Financial assistance and merit-based scholarships' },
  { id: 'counselling', label: 'Counselling Centre', icon: MessageCircle, color: 'green', description: 'Professional mental health and wellness support' },
  { id: 'anti-ragging', label: 'Anti-Ragging Committee', icon: Shield, color: 'red', description: 'Zero tolerance against ragging' },
  { id: 'grievance', label: 'Student Grievance Redressal', icon: ClipboardList, color: 'orange', description: 'Fair and prompt resolution of grievances' },
  { id: 'welfare', label: 'Student Welfare Committee', icon: Heart, color: 'pink', description: 'Holistic student well-being initiatives' },
  { id: 'womens-cell', label: "Women's Empowerment Cell", icon: Star, color: 'purple', description: 'Safe and empowering campus environment' },
  { id: 'alumni', label: 'Alumni Association', icon: Users, color: 'indigo', description: 'Lifelong connections with NEISSR graduates' },
  { id: 'library', label: 'Library Services', icon: BookOpen, color: 'amber', description: 'Comprehensive academic resources and collections' },
  { id: 'placement', label: 'Placement Cell', icon: Briefcase, color: 'teal', description: 'Career guidance and placement support' },
];

const colorSchemes: Record<string, { bg: string; border: string; icon: string; hover: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', hover: 'hover:bg-blue-100' },
  green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', hover: 'hover:bg-green-100' },
  red: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600', hover: 'hover:bg-red-100' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600', hover: 'hover:bg-orange-100' },
  pink: { bg: 'bg-pink-50', border: 'border-pink-200', icon: 'text-pink-600', hover: 'hover:bg-pink-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', hover: 'hover:bg-purple-100' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', icon: 'text-indigo-600', hover: 'hover:bg-indigo-100' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', hover: 'hover:bg-amber-100' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', icon: 'text-teal-600', hover: 'hover:bg-teal-100' },
};

const SEED_DATA: Record<string, { title: string; contentHtml: string; imageUrl?: string; documents: { name: string; url: string; size?: string }[] }> = {
  scholarship: { title: 'Scholarship', contentHtml: '<p>NEISSR offers merit-based and need-based scholarships for deserving students.</p>', documents: [] },
  counselling: { title: 'Counselling Centre', contentHtml: '<p>Professional mental health support available to all students.</p>', documents: [] },
  'anti-ragging': { title: 'Anti-Ragging Committee', contentHtml: '<p>Zero tolerance policy against ragging. Report incidents anonymously.</p>', documents: [] },
  grievance: { title: 'Student Grievance Redressal', contentHtml: '<p>Fair and transparent grievance resolution mechanism in place.</p>', documents: [] },
  welfare: { title: 'Student Welfare Committee', contentHtml: '<p>Dedicated to student well-being and campus life quality.</p>', documents: [] },
  'womens-cell': { title: "Women's Empowerment Cell", contentHtml: '<p>Creating a safe, inclusive and empowering environment for all.</p>', documents: [] },
  alumni: { title: 'Alumni Association', contentHtml: '<p>Connect with NEISSR graduates and strengthen institutional bonds.</p>', documents: [] },
  library: { title: 'Library Services', contentHtml: '<p>Access to extensive collections and digital resources.</p>', documents: [] },
  placement: { title: 'Placement Cell', contentHtml: '<p>Career guidance and employment assistance for graduating students.</p>', documents: [] },
};

export default function StudentServicesPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [selected, setSelected] = useState<string | null>(slug || null);

  const { data: detail, isLoading } = useQuery({
    queryKey: ['student-service', selected],
    enabled: !!selected,
    queryFn: async () => {
      if (!isFirebaseConfigured || !selected) return SEED_DATA[selected] || {};
      const snap = await getDoc(doc(db, 'student_services', selected));
      if (snap.exists()) return snap.data();
      return SEED_DATA[selected];
    },
  });

  const selectedService = SERVICES.find((s) => s.id === selected);
  const colors = selectedService ? colorSchemes[selectedService.color] : colorSchemes.blue;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#003DA5] via-[#0052CC] to-[#003DA5] text-white py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Student Services</h1>
          <p className="text-blue-100 text-lg">Supporting your academic journey and campus life at NEISSR</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-200 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-neutral-600">
          <Link to="/" className="hover:text-[#003DA5] font-medium">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-neutral-800 font-semibold">Student Services</span>
          {selected && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-neutral-800 font-semibold">{selectedService?.label}</span>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {selected && selectedService ? (
          /* Detail View */
          <div>
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#003DA5] hover:text-[#002d7a] mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to All Services
            </button>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-xl overflow-hidden">
              {/* Header */}
              <div className={`${colors.bg} border-b ${colors.border} p-8 md:p-12`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-xl ${colors.bg} border-2 ${colors.border} flex items-center justify-center`}>
                    <selectedService.icon className={`w-8 h-8 ${colors.icon}`} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-[#003DA5]">
                      {detail?.title || selectedService.label}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-[#003DA5] animate-spin" />
                  </div>
                ) : (
                  <>
                    <div
                      className="prose prose-base max-w-none text-neutral-700 leading-relaxed
                        prose-headings:text-[#003DA5] prose-headings:font-serif prose-headings:font-bold
                        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                        prose-p:mb-5 prose-ul:my-5 prose-li:text-neutral-700"
                      dangerouslySetInnerHTML={{ __html: detail?.contentHtml || '' }}
                    />

                    {detail?.documents && detail.documents.length > 0 && (
                      <div className="mt-12 pt-8 border-t border-neutral-200">
                        <h3 className="text-lg font-serif font-bold text-[#003DA5] mb-6">Documents</h3>
                        <div className="grid gap-3">
                          {detail.documents.map((d: any, i: number) => (
                            <a
                              key={i}
                              href={d.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:border-[#003DA5] hover:bg-blue-50 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-[#C8102E] shrink-0" />
                                <div>
                                  <p className="text-sm font-semibold text-neutral-800 group-hover:text-[#003DA5]">{d.name}</p>
                                  {d.size && <p className="text-xs text-neutral-500">{d.size}</p>}
                                </div>
                              </div>
                              <Download className="w-4 h-4 text-[#003DA5] group-hover:scale-110 transition-transform" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                const scheme = colorSchemes[service.color];
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelected(service.id)}
                    className={`group text-left bg-white border-2 ${scheme.border} rounded-xl p-8 transition-all hover:shadow-xl hover:border-[#003DA5] hover:-translate-y-1`}
                  >
                    <div className={`w-14 h-14 rounded-lg ${scheme.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${scheme.icon}`} />
                    </div>
                    <h3 className="font-serif font-bold text-lg text-neutral-900 mb-2 group-hover:text-[#003DA5] transition-colors">
                      {service.label}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#003DA5] opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn More <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
