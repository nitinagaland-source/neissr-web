import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Users,
  CheckCircle,
  Calendar,
  Download,
  Send,
  Sparkles,
  TrendingUp,
  MapPin,
  ChevronRight,
  ChevronDown,
  Star,
  ShieldCheck,
  BarChart3,
  GraduationCap
} from 'lucide-react';
import { doc, getDoc, getDocs, collection, query, limit, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../lib/date';
import ReferenceCard from '../components/ui/ReferenceCard';
import { SEED_NEWS, SEED_EVENTS, SEED_DOCUMENTS } from '../data/seedData';

/* ============ HERO CAROUSEL COMPONENT ============ */
interface HeroCarouselProps {
  images: string[];
  intervalMs: number;
  headline: string;
  subtitle: string;
}

function HeroCarousel({ images, intervalMs, headline, subtitle }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const validImages = images.filter(Boolean);

  useEffect(() => {
    if (validImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % validImages.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [validImages.length, intervalMs]);

  return (
    <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-neutral-900">
      {/* Image slides - fade transition */}
      <div className="absolute inset-0 overflow-hidden">
        {validImages.map((img, idx) => (
          <div
            key={img + idx}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              idx === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt={`Hero slide ${idx + 1}`}
              className="w-full h-full object-cover scale-105 animate-[kenburns_20s_infinite_alternate]"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/40" />
      </div>

      {/* Text content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-8 py-20 w-full text-white">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wider uppercase shadow-md">
            <Sparkles className="w-4 h-4 text-[#C9A227]" /> Excel in Knowledge & Service
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold md:font-black leading-[1.1] tracking-tight text-white drop-shadow-sm">
            {headline}
          </h1>

          <p className="text-lg md:text-xl text-neutral-200 font-normal leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              to="/admissions"
              className="inline-flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white px-8 py-4 rounded-full font-bold text-base shadow-lg transition-all hover:scale-105"
            >
              Apply Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/academics"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border-2 border-white/60 backdrop-blur-md px-8 py-4 rounded-full font-semibold text-base transition-all hover:scale-105"
            >
              Explore Programmes
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Dot indicators */}
      {validImages.length > 1 && (
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {validImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === current ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white text-center hidden md:block">
        <ChevronDown className="w-6 h-6 mx-auto animate-bounce text-[#C9A227]" />
      </div>
    </section>
  );
}

const enquirySchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number required'),
  email: z.string().email('Valid email address required'),
  programmeInterested: z.string().min(1, 'Please select a programme'),
  message: z.string().min(5, 'Message must be at least 5 characters')
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export default function HomePage() {
  const [submitting, setSubmitting] = useState(false);

  const { data: homeContent } = useQuery({
    queryKey: ['pages', 'home'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return null;
      const snap = await getDoc(doc(db, 'pages', 'home'));
      return snap.exists() ? snap.data() : null;
    },
  });

  const { data: newsList = SEED_NEWS } = useQuery({
    queryKey: ['home-news'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_NEWS;
      const q = query(collection(db, 'news'), orderBy('publishedAt', 'desc'), limit(3));
      const snap = await getDocs(q);
      if (snap.empty) return SEED_NEWS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const published = items.filter((i: any) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_NEWS;
    },
  });

  const { data: eventsList = SEED_EVENTS } = useQuery({
    queryKey: ['home-events'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_EVENTS;
      const q = query(collection(db, 'events'), orderBy('startAt', 'asc'), limit(3));
      const snap = await getDocs(q);
      if (snap.empty) return SEED_EVENTS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const published = items.filter((i: any) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_EVENTS;
    },
  });

  const { data: documentsList = SEED_DOCUMENTS } = useQuery({
    queryKey: ['home-documents'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_DOCUMENTS;
      const q = query(collection(db, 'documents'), limit(4));
      const snap = await getDocs(q);
      if (snap.empty) return SEED_DOCUMENTS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const published = items.filter((i: any) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_DOCUMENTS;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema)
  });

  const onSubmitEnquiry = async (data: EnquiryFormData) => {
    try {
      setSubmitting(true);
      await addDoc(collection(db, 'enquiries'), {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        programmeInterested: data.programmeInterested,
        message: data.message,
        sourcePage: 'home',
        status: 'new',
        createdAt: serverTimestamp(),
      });
      toast.success(`Thank you ${data.fullName}! Your enquiry has been received. Our team will contact you shortly.`);
      reset();
    } catch {
      toast.error('Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-0">
      {/* SECTION 1 — HERO (Auto-scrolling Carousel) */}
      <HeroCarousel
        images={
          (homeContent as any)?.heroImages?.length > 0
            ? (homeContent as any).heroImages
            : [homeContent?.heroImageUrl || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000"]
        }
        intervalMs={((homeContent as any)?.heroIntervalSeconds || 5) * 1000}
        headline={homeContent?.heroHeadline || 'Shaping social change through education, peace, and service.'}
        subtitle={homeContent?.heroSubtitle || "North East Institute of Social Sciences and Research — Nagaland's premier Social Work college. Affiliated to Nagaland University & UGC 2(f) recognized."}
      />

      {/* SECTION 2 — TRUST / STATS STRIP */}
      <section className="bg-white py-6 border-y border-neutral-200/80">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            
            {/* Card 1: NAAC B++ */}
            <Link
              to="/naac"
              className="group relative p-4 md:p-5 rounded-xl border border-neutral-200/90 bg-[#FAF9F7] text-center hover:bg-white hover:border-[#C8102E]/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-4px_rgba(200,16,46,0.12)] transition-all duration-200 flex flex-col justify-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C8102E] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="font-serif font-bold text-xl md:text-2xl text-[#C8102E] group-hover:scale-[1.02] transition-transform">
                NAAC B++
              </div>
              <div className="text-xs text-neutral-600 font-semibold mt-1">
                CGPA 2.98 First Cycle
              </div>
            </Link>

            {/* Card 2: NIRF Ranked */}
            <Link
              to="/documents"
              className="group relative p-4 md:p-5 rounded-xl border border-neutral-200/90 bg-[#FAF9F7] text-center hover:bg-white hover:border-[#003DA5]/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-4px_rgba(0,61,165,0.12)] transition-all duration-200 flex flex-col justify-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#003DA5] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="font-serif font-bold text-xl md:text-2xl text-[#003DA5] group-hover:scale-[1.02] transition-transform">
                NIRF Ranked
              </div>
              <div className="text-xs text-neutral-600 font-semibold mt-1">
                College Data Submitted
              </div>
            </Link>

            {/* Card 3: UGC 2(f) */}
            <Link
              to="/about"
              className="group relative p-4 md:p-5 rounded-xl border border-neutral-200/90 bg-[#FAF9F7] text-center hover:bg-white hover:border-[#C9A227]/70 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-4px_rgba(201,162,39,0.15)] transition-all duration-200 flex flex-col justify-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#C9A227] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="font-serif font-bold text-xl md:text-2xl text-neutral-900 group-hover:text-[#8B6B08] group-hover:scale-[1.02] transition-transform">
                UGC 2(f)
              </div>
              <div className="text-xs text-neutral-600 font-semibold mt-1">
                Recognised Institute
              </div>
            </Link>

            {/* Card 4: Nagaland Univ. */}
            <Link
              to="/academics"
              className="group relative p-4 md:p-5 rounded-xl border border-neutral-200/90 bg-[#FAF9F7] text-center hover:bg-white hover:border-[#003DA5]/60 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_-4px_rgba(0,61,165,0.12)] transition-all duration-200 flex flex-col justify-center overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#003DA5] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="font-serif font-bold text-xl md:text-2xl text-[#003DA5] group-hover:scale-[1.02] transition-transform">
                Nagaland Univ.
              </div>
              <div className="text-xs text-neutral-600 font-semibold mt-1">
                Affiliated College
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* SECTION 3 — ABOUT PREVIEW (Alternating Layout) */}
      <section className="py-20 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <div className="text-xs font-semibold text-[#C8102E] uppercase tracking-wider">
                Rooted in Nagaland
              </div>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-neutral-900 leading-tight">
                Rooted in Nagaland. Committed to transformation.
              </h2>
              <p className="text-neutral-700 leading-relaxed text-base md:text-lg">
                NEISSR is the first and only MSW college under Nagaland University, established in 2014 at the Peace Centre, Chümoukedima. Managed by the Catholic Diocese of Kohima, we train compassionate, competent professionals dedicated to social justice, peacebuilding, and community transformation in North East India.
              </p>
              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 font-semibold text-[#C8102E] hover:text-[#9A0C24] transition-colors text-base"
                >
                  Learn More About NEISSR & Founder <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <img
                src={homeContent?.aboutImageUrl || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1000"}
                alt="NEISSR Campus Life"
                className="rounded-2xl shadow-xl w-full object-cover h-[400px] border border-neutral-200"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#003DA5] text-white p-6 rounded-2xl shadow-lg hidden md:block max-w-xs">
                <div className="font-serif font-bold text-3xl text-[#C9A227]">10+ Years</div>
                <div className="text-xs text-neutral-200 mt-1">
                  Excellence in Professional Social Work Education
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 — PROGRAMMES (Card Grid Layout) */}
      <section className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="text-xs font-semibold text-[#003DA5] uppercase tracking-wider">
              Academic Excellence
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-neutral-900">
              Our Programmes Offered
            </h2>
            <p className="text-neutral-600 text-sm md:text-base">
              Comprehensive undergraduate and postgraduate degrees in Social Work designed for field impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* BSW Card */}
            <ReferenceCard
              title="Bachelor of Social Work (BSW)"
              subtitle="3 Years • 6 Semesters • 50 Sanctioned Seats"
              gradient="crimson"
              icon={<BookOpen className="w-8 h-8" />}
              buttonText="Explore BSW"
              buttonLink="/academics/bsw"
              badge="Undergraduate"
            >
              <div className="space-y-3">
                <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">
                  Equips students with foundational social work principles, human rights understanding, fieldwork practicum, and grassroots community organizing skills.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="bg-neutral-100 px-3 py-1 rounded-full text-xs font-semibold text-neutral-700">6 Semesters</span>
                  <span className="bg-neutral-100 px-3 py-1 rounded-full text-xs font-semibold text-neutral-700">Grassroots Fieldwork</span>
                </div>
              </div>
            </ReferenceCard>

            {/* MSW Card */}
            <ReferenceCard
              title="Master of Social Work (MSW)"
              subtitle="2 Years • 4 Professional Streams"
              gradient="navy"
              icon={<Award className="w-8 h-8" />}
              buttonText="Explore MSW"
              buttonLink="/academics/msw"
              badge="Postgraduate"
            >
              <div className="space-y-3">
                <p className="text-neutral-600 text-xs md:text-sm leading-relaxed">
                  Postgraduate degree focusing on research, field block placements, conflict transformation, and professional leadership.
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                  <span className="bg-neutral-100 px-2.5 py-1 rounded-full text-[11px] font-semibold text-neutral-700">Community Dev</span>
                  <span className="bg-neutral-100 px-2.5 py-1 rounded-full text-[11px] font-semibold text-neutral-700">Youth Dev</span>
                  <span className="bg-neutral-100 px-2.5 py-1 rounded-full text-[11px] font-semibold text-neutral-700">Social Entrepreneurship</span>
                  <span className="bg-neutral-100 px-2.5 py-1 rounded-full text-[11px] font-semibold text-neutral-700">Peace & Conflict</span>
                </div>
              </div>
            </ReferenceCard>
          </div>
        </div>
      </section>

      {/* SECTION 5 — PLACEMENT HIGHLIGHT (3D Executive Stats Band) */}
      <section className="relative bg-[#020B19] text-white py-20 overflow-hidden border-y border-[#C9A227]/30">
        {/* Background 3D Ambient Lighting and Micro Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,61,165,0.35)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
        
        <div className="relative max-w-[1440px] mx-auto px-4 md:px-8 text-center space-y-12">
          {/* Section Header with Professional Modern Sans-Serif */}
          <div className="max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/30 text-xs font-bold text-[#E2C044] uppercase tracking-[0.2em]">
              <TrendingUp className="w-3.5 h-3.5" />
              Career Outcomes & Impact
            </div>
            <h2 className="font-sans font-black text-3xl md:text-5xl lg:text-6xl text-white tracking-tight drop-shadow-md">
              Placements that Define Futures
            </h2>
            <p className="text-neutral-300/90 text-sm md:text-base font-medium max-w-xl mx-auto">
              Empowering social work graduates with prestigious careers across global NGOs, international development bodies, and government sectors.
            </p>
          </div>

          {/* 3D Glassmorphic Executive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-2">
            {/* Stat Card 1 */}
            <div className="relative group rounded-3xl bg-gradient-to-b from-white/12 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_30px_60px_rgba(0,61,165,0.4),0_15px_30px_rgba(226,192,68,0.25),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:border-white/40 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] transform-gpu flex flex-col justify-between">
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#E2C044] to-transparent rounded-t-full" />
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300/80 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  Track Record
                </span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E2C044] to-[#9E7A13] text-white flex items-center justify-center shadow-lg border border-yellow-200/40">
                  <Award className="w-5 h-5 stroke-[2]" />
                </div>
              </div>
              <div>
                <div className="font-sans font-black text-5xl sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-[#FFF5C0] via-[#E2C044] to-[#A37E18] drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)] tracking-tight">
                  75%
                </div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mt-4 leading-relaxed">
                  Five-Year Placement Average
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="relative group rounded-3xl bg-gradient-to-b from-white/12 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_30px_60px_rgba(0,61,165,0.4),0_15px_30px_rgba(226,192,68,0.25),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:border-white/40 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] transform-gpu flex flex-col justify-between">
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#E2C044] to-transparent rounded-t-full" />
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300/80 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  Pre-Graduation
                </span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003DA5] to-[#002566] text-white flex items-center justify-center shadow-lg border border-blue-300/30">
                  <TrendingUp className="w-5 h-5 stroke-[2]" />
                </div>
              </div>
              <div>
                <div className="font-sans font-black text-5xl sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-[#FFF5C0] via-[#E2C044] to-[#A37E18] drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)] tracking-tight">
                  80%
                </div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mt-4 leading-relaxed">
                  Current Outgoing Batch Placed Ahead of Graduation
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="relative group rounded-3xl bg-gradient-to-b from-white/12 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 p-8 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_30px_60px_rgba(0,61,165,0.4),0_15px_30px_rgba(226,192,68,0.25),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:border-white/40 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] transform-gpu flex flex-col justify-between">
              <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#E2C044] to-transparent rounded-t-full" />
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300/80 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  Average Package
                </span>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8102E] to-[#800A1D] text-white flex items-center justify-center shadow-lg border border-red-300/30">
                  <Briefcase className="w-5 h-5 stroke-[2]" />
                </div>
              </div>
              <div>
                <div className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-[#FFF5C0] via-[#E2C044] to-[#A37E18] drop-shadow-[0_6px_16px_rgba(0,0,0,0.6)] tracking-tight">
                  Rs. 35,000
                </div>
                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 mt-4 leading-relaxed">
                  Average Monthly Salary for Placed Students
                </div>
              </div>
            </div>
          </div>

          {/* 3D Premium Action Button */}
          <div className="pt-4">
            <Link
              to="/placement"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#C8102E] via-[#E61C3D] to-[#9A0C24] hover:from-[#E61C3D] hover:to-[#C8102E] text-white px-9 py-4 rounded-full font-sans font-extrabold text-sm tracking-wider uppercase shadow-[0_12px_30px_rgba(200,16,46,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_18px_45px_rgba(200,16,46,0.7),inset_0_1px_2px_rgba(255,255,255,0.6)] transition-all duration-300 hover:scale-105 border border-red-400/40 group/btn"
            >
              <span>Discover Our Placement Record & Recruiters</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6 — LATEST NEWS (Horizontal Cards) */}
      <section className="py-20 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <div className="text-xs font-semibold text-[#C8102E] uppercase tracking-wider">
                Updates & Press
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 mt-1">
                Latest News & Highlights
              </h2>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-1 font-semibold text-[#003DA5] hover:underline text-sm"
            >
              View All News <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {newsList.map((news: any, index: number) => {
              const gradients: Array<'blue' | 'purple' | 'pink' | 'emerald' | 'amber' | 'indigo'> = [
                'blue',
                'purple',
                'pink',
                'emerald',
                'amber',
                'indigo'
              ];
              const gradient = gradients[index % gradients.length];

              return (
                <ReferenceCard
                  key={news.id}
                  title={news.title}
                  badge={news.category}
                  date={formatDate(news.publishedAt)}
                  gradient={gradient}
                  buttonText="Read Full Story"
                  buttonLink={`/news/${news.slug || news.id}`}
                  icon={<Sparkles className="w-8 h-8" />}
                >
                  {news.coverImageUrl && (
                    <div className="w-full h-36 rounded-xl overflow-hidden mb-2">
                      <img
                        src={news.coverImageUrl}
                        alt={news.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-neutral-600 text-xs md:text-sm line-clamp-2 leading-relaxed">
                    {news.excerpt}
                  </p>
                </ReferenceCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7 — UPCOMING EVENTS (Date Badges List) */}
      <section className="py-20 bg-white border-t border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <div className="text-xs font-semibold text-[#003DA5] uppercase tracking-wider">
                Calendar
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900 mt-1">
                Upcoming Events & Symposia
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-1 font-semibold text-[#003DA5] hover:underline text-sm"
            >
              View All Events <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {eventsList.map((event: any, index: number) => {
              const gradients: Array<'blue' | 'purple' | 'pink' | 'emerald' | 'amber' | 'indigo'> = [
                'indigo',
                'purple',
                'emerald',
                'blue',
                'pink',
                'amber'
              ];
              const gradient = gradients[index % gradients.length];
              const eventDateStr = `${new Date(event.startAt).getDate()} ${new Date(event.startAt).toLocaleString('default', { month: 'short' })} ${new Date(event.startAt).getFullYear()}`;

              return (
                <ReferenceCard
                  key={event.id}
                  title={event.title}
                  badge={event.venue}
                  date={eventDateStr}
                  gradient={gradient}
                  buttonText="Event Details"
                  buttonLink={`/events/${event.slug || event.id}`}
                  icon={<Calendar className="w-8 h-8" />}
                >
                  <div
                    className="text-neutral-600 text-xs md:text-sm line-clamp-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: event.descriptionHtml }}
                  />
                </ReferenceCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8 — LIFE AT NEISSR (Campus Life Mosaic) */}
      <section className="py-20 bg-[#FAF9F7]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-semibold text-[#C8102E] uppercase tracking-wider">
              Vibrant Campus Community
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-neutral-900">
              Life at NEISSR
            </h2>
            <p className="text-neutral-600 text-sm md:text-base">
              From peace rallies and cultural day celebrations to rural fieldwork camps and sports tournaments.
            </p>
          </div>

          {/* Asymmetric Photo Mosaic */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[480px]">
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group border border-neutral-200">
              <img
                src={homeContent?.campusImage1 || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000"}
                alt={homeContent?.campusCaption1 || "NEISSR Cultural Day"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <div className="text-white text-sm font-semibold">
                  {homeContent?.campusCaption1 || "Cultural Day & Traditional Naga Attires"}
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden group border border-neutral-200">
              <img
                src={homeContent?.campusImage2 || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600"}
                alt={homeContent?.campusCaption2 || "Rural Camp Fieldwork"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="text-white text-xs font-semibold">
                  {homeContent?.campusCaption2 || "10-Day Rural Camp"}
                </div>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden group border border-neutral-200">
              <img
                src={homeContent?.campusImage3 || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600"}
                alt={homeContent?.campusCaption3 || "Peace Rally"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="text-white text-xs font-semibold">
                  {homeContent?.campusCaption3 || "Peace Knit Festival"}
                </div>
              </div>
            </div>

            <div className="col-span-2 relative rounded-2xl overflow-hidden group border border-neutral-200">
              <img
                src={homeContent?.campusImage4 || "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800"}
                alt={homeContent?.campusCaption4 || "Library Research"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div className="text-white text-xs font-semibold">
                  {homeContent?.campusCaption4 || "Peace Library & Digital Research Lab"}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/student-life"
              className="inline-flex items-center gap-2 bg-[#003DA5] hover:bg-[#002B75] text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-md"
            >
              Explore Student Life & Clubs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9 — FACTS MARQUEE (Ticker) */}
      <section className="bg-[#003DA5] text-white py-4 overflow-hidden border-y border-[#C9A227]">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-sm font-semibold">
          <span>10 Student Clubs</span> <span className="text-[#C9A227]">•</span>
          <span>4 Academic Forums</span> <span className="text-[#C9A227]">•</span>
          <span>NAAC B++ Accredited</span> <span className="text-[#C9A227]">•</span>
          <span>First MSW in Nagaland</span> <span className="text-[#C9A227]">•</span>
          <span>Peace Centre inaugurated 2022</span> <span className="text-[#C9A227]">•</span>
          <span>Miss Nagaland 2023 — NEISSR Trainee</span> <span className="text-[#C9A227]">•</span>
          <span>75% Placement Rate</span> <span className="text-[#C9A227]">•</span>
          <span>UGC 2(f) Recognised</span> <span className="text-[#C9A227]">•</span>
          <span>10 Student Clubs</span> <span className="text-[#C9A227]">•</span>
          <span>4 Academic Forums</span> <span className="text-[#C9A227]">•</span>
          <span>NAAC B++ Accredited</span> <span className="text-[#C9A227]">•</span>
        </div>
      </section>

      {/* SECTION 10 — DOWNLOADS & DOCUMENTS */}
      <section className="py-20 bg-white">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div className="text-xs font-semibold text-[#C8102E] uppercase tracking-wider">
                Official Publications
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-neutral-900">
                Key Downloads & Handbooks
              </h2>
              <p className="text-neutral-600 text-sm md:text-base leading-relaxed">
                Access official prospectuses, academic calendars, examination manuals, accreditation certificates, and NIRF disclosures.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/documents"
                  className="inline-flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white px-6 py-3 rounded-full text-sm font-bold shadow-sm"
                >
                  <Download className="w-4 h-4" /> Download Prospectus
                </Link>
                <Link
                  to="/documents"
                  className="inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-6 py-3 rounded-full text-sm font-semibold"
                >
                  All Documents Repository
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {documentsList.slice(0, 4).map((doc: any) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-neutral-200 bg-[#FAF9F7] flex items-center justify-between hover:border-[#003DA5] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-neutral-900">{doc.title}</div>
                    <div className="text-xs text-neutral-500">
                      Size: {doc.fileSize || 'PDF'} | Date: {formatDate(doc.publishedAt)}
                    </div>
                  </div>
                  <Link
                    to="/documents"
                    className="p-2.5 rounded-full bg-white border border-neutral-200 text-[#003DA5] hover:bg-[#003DA5] hover:text-white transition-colors"
                    title="View Document"
                  >
                    <Download className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11 — ENQUIRY FORM & CONTACT BAND */}
      <section className="py-20 bg-[#FAF9F7] border-t border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form Left */}
            <div className="bg-white p-8 rounded-2xl border border-neutral-200 shadow-md space-y-6">
              <div>
                <div className="text-xs font-semibold text-[#C8102E] uppercase tracking-wider">
                  Admissions 2026-27
                </div>
                <h3 className="font-serif font-bold text-2xl md:text-3xl text-neutral-900 mt-1">
                  Submit an Admissions Enquiry
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Have questions regarding BSW or MSW specialisations? Send us a message directly.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmitEnquiry)} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 text-sm"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-[#C8102E] mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 text-sm"
                      placeholder="10-digit mobile number"
                    />
                    {errors.phone && (
                      <p className="text-xs text-[#C8102E] mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 text-sm"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-[#C8102E] mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Programme Interested *
                  </label>
                  <select
                    {...register('programmeInterested')}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 text-sm bg-white"
                  >
                    <option value="">Select Programme / Specialisation</option>
                    <option value="BSW">BSW — Bachelor of Social Work (3 Years)</option>
                    <option value="MSW-CD">MSW — Community Development (CD)</option>
                    <option value="MSW-YD">MSW — Youth Development (YD)</option>
                    <option value="MSW-SED">MSW — Social Entrepreneurship (SED)</option>
                    <option value="MSW-PCTS">MSW — Peace & Conflict Transformation (PCTS)</option>
                  </select>
                  {errors.programmeInterested && (
                    <p className="text-xs text-[#C8102E] mt-1">{errors.programmeInterested.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={3}
                    {...register('message')}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-[#003DA5] focus:ring-2 focus:ring-[#003DA5]/20 text-sm"
                    placeholder="Write your questions or message..."
                  ></textarea>
                  {errors.message && (
                    <p className="text-xs text-[#C8102E] mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white py-3 rounded-full font-bold text-sm shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Enquiry'}
                </button>
              </form>
            </div>

            {/* Address & Info Right */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-semibold text-[#003DA5] uppercase tracking-wider">
                  Campus Address
                </div>
                <h3 className="font-serif font-bold text-2xl md:text-3xl text-neutral-900">
                  Peace Centre Campus
                </h3>
                <div className="space-y-3 text-sm text-neutral-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#C8102E] shrink-0 mt-0.5" />
                    <span>North East Institute of Social Sciences and Research, 7th Mile, Peace Centre, Chümoukedima, Nagaland 797103, India</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-2">
                    <div className="text-xs font-bold text-[#003DA5] uppercase">Helpline Contacts</div>
                    <div className="text-sm font-semibold text-neutral-900">
                      6909617895 | 8787663564 | 8415948915 | 7085474171
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-md">
                <iframe
                  title="NEISSR Location Map Form"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.97011030432!2d93.770451!3d25.823084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3746237190000001%3A0x1d6a62371!2sNorth%20East%20Institute%20of%20Social%20Sciences%20and%20Research!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="220"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
