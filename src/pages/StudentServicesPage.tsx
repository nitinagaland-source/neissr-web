import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  GraduationCap, MessageCircle, Shield, ClipboardList,
  Heart, Users, BookOpen, Briefcase, ChevronRight,
  FileText, Download, ArrowLeft, Star
} from 'lucide-react';

const SERVICES = [
  {
    id: 'scholarship',
    label: 'Scholarship',
    icon: GraduationCap,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    description: 'Financial assistance programmes for deserving students.',
  },
  {
    id: 'counselling',
    label: 'Counselling Centre',
    icon: MessageCircle,
    color: 'bg-green-50 text-green-600 border-green-100',
    description: 'Professional counselling and mental wellness support.',
  },
  {
    id: 'anti-ragging',
    label: 'Anti-Ragging Committee',
    icon: Shield,
    color: 'bg-red-50 text-red-600 border-red-100',
    description: 'Zero tolerance against ragging. Report incidents here.',
  },
  {
    id: 'grievance',
    label: 'Student Grievance Redressal',
    icon: ClipboardList,
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    description: 'Mechanism to address and resolve student grievances.',
  },
  {
    id: 'welfare',
    label: 'Student Welfare Committee',
    icon: Heart,
    color: 'bg-pink-50 text-pink-600 border-pink-100',
    description: 'Promoting student well-being and campus life quality.',
  },
  {
    id: 'womens-cell',
    label: "Women's Empowerment Cell",
    icon: Star,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    description: "Supporting and empowering women students and staff.",
  },
  {
    id: 'alumni',
    label: 'Alumni Association',
    icon: Users,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    description: 'Connecting NEISSR graduates across generations.',
  },
  {
    id: 'library',
    label: 'Library',
    icon: BookOpen,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    description: 'Access to books, journals, and digital resources.',
  },
  {
    id: 'placement',
    label: 'Placement Cell',
    icon: Briefcase,
    color: 'bg-teal-50 text-teal-600 border-teal-100',
    description: 'Career guidance and placement assistance for students.',
  },
];

const SEED_DETAIL: Record<string, { title: string; contentHtml: string; documents: { name: string; url: string; size?: string }[] }> = {
  scholarship: {
    title: 'Scholarship',
    contentHtml: `<p>NEISSR offers various scholarship programmes to support deserving and meritorious students. The institution believes that financial constraints should not be a barrier to quality education.</p>
<h3>Available Scholarships</h3>
<ul>
<li><strong>Merit Scholarship:</strong> Awarded to students who secure top ranks in their respective programmes.</li>
<li><strong>SC/ST Scholarship:</strong> Government scholarship for students belonging to Scheduled Caste and Scheduled Tribe communities.</li>
<li><strong>OBC Scholarship:</strong> For students from Other Backward Classes as per government norms.</li>
<li><strong>Minority Scholarship:</strong> For students from minority communities as notified by the Government of India.</li>
<li><strong>Post Matric Scholarship:</strong> State government scholarship for eligible students.</li>
</ul>
<h3>How to Apply</h3>
<p>Students can apply for scholarships through the National Scholarship Portal (NSP) or the respective state government portal. For institution-specific scholarships, contact the Student Welfare Office.</p>`,
    documents: [],
  },
  counselling: {
    title: 'Counselling Centre',
    contentHtml: `<p>The Counselling Centre at NEISSR provides professional mental health support and guidance to students. Our trained counsellors are available to help students navigate academic, personal, and career-related challenges.</p>
<h3>Services Offered</h3>
<ul>
<li>Individual counselling sessions</li>
<li>Group counselling and peer support</li>
<li>Academic stress management</li>
<li>Career counselling and guidance</li>
<li>Crisis intervention and support</li>
</ul>
<h3>Appointments</h3>
<p>Students may book an appointment by visiting the Student Affairs Office or by contacting the counsellor directly. All sessions are strictly confidential.</p>`,
    documents: [],
  },
  'anti-ragging': {
    title: 'Anti-Ragging Committee',
    contentHtml: `<p>NEISSR has a zero-tolerance policy against ragging in any form. The Anti-Ragging Committee is constituted as per UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions, 2009.</p>
<h3>What is Ragging?</h3>
<p>Ragging includes any conduct which has the effect of teasing, treating or handling with rudeness a fresher or any other student; indulging in rowdy or undisciplined activities which cause or are likely to cause annoyance, hardship, physical or psychological harm or raise apprehension or fear in a fresher or any other student.</p>
<h3>How to Report</h3>
<ul>
<li>Contact the Anti-Ragging helpline: 1800-180-5522</li>
<li>File a complaint with the Proctorial Board</li>
<li>Email: antiragging.neissr@gmail.com</li>
</ul>
<h3>Punishment</h3>
<p>Those found guilty of ragging are liable to be expelled from the institution and/or punished as per the laws of the land.</p>`,
    documents: [],
  },
  grievance: {
    title: 'Student Grievance Redressal',
    contentHtml: `<p>The Student Grievance Redressal Committee ensures that all student grievances are addressed promptly and fairly. The committee functions as per UGC guidelines.</p>
<h3>Nature of Grievances Addressed</h3>
<ul>
<li>Academic grievances (examination, results, attendance)</li>
<li>Administrative grievances (fee, hostel, facilities)</li>
<li>Discrimination or harassment complaints</li>
<li>Any other issues affecting student welfare</li>
</ul>
<h3>Grievance Procedure</h3>
<ol>
<li>Student submits a written complaint to the Grievance Cell</li>
<li>Committee acknowledges receipt within 3 working days</li>
<li>Investigation and hearing within 15 working days</li>
<li>Decision communicated in writing</li>
</ol>`,
    documents: [],
  },
  welfare: {
    title: 'Student Welfare Committee',
    contentHtml: `<p>The Student Welfare Committee works to ensure the overall well-being of students in the campus. It addresses various aspects of student life including health, safety, and social welfare.</p>
<h3>Functions</h3>
<ul>
<li>Organizing health camps and awareness programmes</li>
<li>Facilitating medical assistance for students in need</li>
<li>Coordinating sports and recreational activities</li>
<li>Supporting students with special needs</li>
<li>Organizing orientation programmes for new students</li>
</ul>`,
    documents: [],
  },
  'womens-cell': {
    title: "Women's Empowerment Cell",
    contentHtml: `<p>The Women's Empowerment Cell (WEC) at NEISSR is committed to creating a safe, inclusive and empowering environment for women students and staff members.</p>
<h3>Objectives</h3>
<ul>
<li>Creating awareness about gender equality and women's rights</li>
<li>Providing a platform for women to voice their concerns</li>
<li>Organizing seminars, workshops and events on women's empowerment</li>
<li>Addressing complaints of sexual harassment</li>
</ul>
<h3>Internal Complaints Committee (ICC)</h3>
<p>As per the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, NEISSR has constituted an Internal Complaints Committee to address complaints of sexual harassment.</p>`,
    documents: [],
  },
  alumni: {
    title: 'Alumni Association',
    contentHtml: `<p>The NEISSR Alumni Association connects graduates across batches, fostering a lifelong bond with the institution and among fellow alumni.</p>
<h3>Objectives</h3>
<ul>
<li>Maintaining and strengthening the bond between alumni and the institution</li>
<li>Facilitating networking opportunities among alumni</li>
<li>Supporting current students through mentorship and placement assistance</li>
<li>Contributing to the development of the institution</li>
</ul>
<h3>Membership</h3>
<p>All graduates of NEISSR are automatically members of the Alumni Association. For active membership and to participate in events, please register with the Alumni Cell.</p>`,
    documents: [],
  },
  library: {
    title: 'Library',
    contentHtml: `<p>The NEISSR Library is a well-stocked repository of academic resources, supporting the teaching, learning, and research activities of the institution.</p>
<h3>Resources Available</h3>
<ul>
<li>Books on Social Work, Sociology, Psychology, and related disciplines</li>
<li>National and international journals and periodicals</li>
<li>Reports and publications from government and NGO sectors</li>
<li>Dissertations and theses by previous students</li>
<li>Digital resources and e-databases</li>
</ul>
<h3>Library Hours</h3>
<p>Monday to Saturday: 8:30 AM to 5:30 PM</p>`,
    documents: [],
  },
  placement: {
    title: 'Placement Cell',
    contentHtml: `<p>The Placement Cell at NEISSR provides career guidance and facilitates campus placements for students. The cell has strong connections with NGOs, government organizations, and the corporate sector.</p>
<p>Visit the <a href="/placement" class="text-[#003DA5] underline">Placements page</a> for detailed information about our placement record and activities.</p>`,
    documents: [],
  },
};

export default function StudentServicesPage() {
  const { slug } = useParams<{ slug?: string }>();
  const [selected, setSelected] = useState<string | null>(slug || null);

  const { data: detail, isLoading } = useQuery({
    queryKey: ['student-service', selected],
    enabled: !!selected,
    queryFn: async () => {
      if (!isFirebaseConfigured || !selected) return SEED_DETAIL[selected || ''];
      const snap = await getDoc(doc(db, 'student_services', selected));
      if (snap.exists()) return snap.data();
      return SEED_DETAIL[selected];
    },
  });

  const selectedService = SERVICES.find((s) => s.id === selected);

  return (
    <div className="bg-[#FAF9F7] min-h-screen">
      {/* Hero */}
      <div className="bg-[#003DA5] text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-blue-200 mb-2">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span>Student Services</span>
            {selected && (
              <>
                <ChevronRight className="w-3 h-3" />
                <span>{selectedService?.label}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif">Student Services</h1>
          <p className="text-blue-200 text-sm mt-1">
            Supporting your academic journey and campus life at NEISSR
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {selected && selectedService ? (
          /* Detail View */
          <div>
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm font-semibold text-[#003DA5] hover:underline mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Services
            </button>

            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 md:p-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-[#003DA5] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-neutral-100">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${selectedService.color}`}>
                      <selectedService.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold font-serif text-[#003DA5]">
                      {detail?.title || selectedService.label}
                    </h2>
                  </div>

                  <div
                    className="prose prose-sm max-w-none text-neutral-700 leading-relaxed
                      prose-headings:text-[#C8102E] prose-headings:font-bold
                      prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
                      prose-p:mb-4 prose-ul:pl-5 prose-ul:mb-4 prose-ol:pl-5
                      prose-li:mb-1"
                    dangerouslySetInnerHTML={{ __html: detail?.contentHtml || '' }}
                  />

                  {detail?.documents && detail.documents.length > 0 && (
                    <div className="mt-8 border-t border-neutral-100 pt-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500 mb-4">Downloads</h3>
                      <div className="space-y-2">
                        {detail.documents.map((d: { name: string; url: string; size?: string }, i: number) => (
                          <a
                            key={i}
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-[#003DA5] hover:bg-blue-50/30 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-[#C8102E] shrink-0" />
                              <div>
                                <p className="text-sm font-semibold text-neutral-800 group-hover:text-[#003DA5]">{d.name}</p>
                                {d.size && <p className="text-xs text-neutral-400">{d.size}</p>}
                              </div>
                            </div>
                            <Download className="w-4 h-4 text-[#003DA5]" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div>
            <p className="text-neutral-600 mb-6">
              Select a service below to learn more.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelected(service.id)}
                    className="group bg-white rounded-xl border border-neutral-200 shadow-sm p-5 text-left hover:border-[#003DA5] hover:shadow-md transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${service.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-neutral-900 mb-1 group-hover:text-[#003DA5] transition-colors">
                      {service.label}
                    </h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-[#003DA5] opacity-0 group-hover:opacity-100 transition-opacity">
                      Read More <ChevronRight className="w-3 h-3" />
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
