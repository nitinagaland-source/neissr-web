import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Menu,
  X,
  ChevronDown,
  ArrowRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';
import { Link as RouterLink } from 'react-router-dom';

export default function Header() {
  const { data: siteSettings } = useQuery({
    queryKey: ['settings-general'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return null;
      const snap = await getDoc(doc(db, 'settings', 'general'));
      return snap.exists() ? snap.data() : null;
    },
  });

  const helpline = siteSettings?.contactPhone || "6909617895 | 8787663564 | 8415948915 | 7085474171";
  const contactEmail = siteSettings?.contactEmail || "contact.neissr@gmail.com";
  const fbUrl = siteSettings?.facebookUrl || "https://www.facebook.com/NEISSR/";
  const instaUrl = siteSettings?.instagramUrl || "https://www.instagram.com/neissr_official/";
  const ytUrl = siteSettings?.youtubeUrl || "https://www.youtube.com/@neissr";

  const [isScrolled, setIsScroll] = useState(false);
  const [mobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileAccordion = (key: string) => {
    setMobileAccordion(mobileAccordion === key ? null : key);
  };

  return (
    <header className="w-full z-50 sticky top-0 transition-all duration-300 relative"><Link to="/" className="hidden lg:flex absolute left-[5%] top-[46px] z-[60] items-start gap-5 group"><img src="https://i.ibb.co/fYhSSyW4/channels4-profile-1.jpg" alt="NEISSR Logo" referrerPolicy="no-referrer" className="w-24 h-24 xl:w-28 xl:h-28 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform" /><div className="relative w-[340px] h-32"><div className="absolute left-0 top-[38px] font-serif font-bold text-2xl xl:text-3xl text-white leading-none tracking-tight">NEISSR</div><p className="absolute left-0 top-[66px] text-[9px] xl:text-[10px] text-white/90 font-medium tracking-[0.03em] whitespace-nowrap">North East Institute of Social Sciences and Research</p><p className="absolute left-0 top-[84px] text-[10px] xl:text-[11px] text-white/90 font-semibold tracking-[0.12em] uppercase whitespace-nowrap">Excel in Knowledge & Service</p></div></Link>
      {/* Row 1 — Top utility bar */}
      <div className="bg-[#2563eb] text-white text-xs py-1.5 px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wide text-center sm:text-left">
            <Phone className="w-3.5 h-3.5 text-[#C9A227] shrink-0" />
            <span>Admission Helpline: {helpline}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-1 hover:text-[#C9A227] transition-colors"
              title="Email NEISSR"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{contactEmail}</span>
            </a>
            <div className="h-3 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-3">
              <a href={fbUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A227] transition-colors" aria-label="Facebook">
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href={instaUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A227] transition-colors" aria-label="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href={ytUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A227] transition-colors" aria-label="YouTube">
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 — Tagline bar */}
      <div className="hidden lg:block bg-[#2563eb]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-1.5 text-center">
          <p className="text-white font-bold text-base font-serif tracking-wide">
            Institute for Peace Building, Research & Dialogue
          </p>
        </div>
      </div>

      {/* Utility links bar */}
      <div className="hidden lg:block bg-[#2563eb]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-1.5 flex items-center justify-center gap-7">
          {[
            { label: "UN SDGs", to: "/un-sdgs" },
            { label: "UBA", to: "/uba" },
            { label: "NSS", to: "/nss" },
            { label: "NCC", to: "/ncc" },
            { label: "Newsletters", to: "/newsletters" },
          ].map((link) => (
            <Link key={link.to} to={link.to} className="text-sm font-semibold text-white/80 hover:text-white transition-colors tracking-widest uppercase">
              {link.label}
            </Link>
          ))}           <Link to="/admissions" className="inline-flex items-center gap-2 bg-[#C8102E] hover:bg-[#a50d25] text-white px-4 py-1.5 rounded-md font-semibold text-sm shadow-sm transition-all">Admissions Open <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
      </div>

      {/* Row 3 — Main nav bar */}
      <nav className={`bg-[#1e2a4a] transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-2 flex items-center justify-between">          {/* Branding spacer */}           <div className="hidden lg:block w-[420px] shrink-0" />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            {/* About */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('about')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-1 font-medium text-sm text-white hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-all">
                About <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'about' && (
                <div className="absolute top-full left-0 w-64 bg-[#2563eb] rounded-xl shadow-xl border border-[#2563eb] p-2 z-50 animate-fadeIn">
                  <Link to="/about" className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg transition-colors">About NEISSR & Vision</Link>
                  <Link to="/about/messages" className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg transition-colors">Leadership Messages</Link>
                </div>
              )}
            </div>

            {/* Academics */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('academics')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-1 font-medium text-sm text-white hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-all">
                Academics <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'academics' && (
                <div className="absolute top-full left-0 w-80 bg-[#2563eb] rounded-xl shadow-xl border border-[#2563eb] p-3 z-50 animate-fadeIn">
                  <div className="text-xs font-semibold uppercase text-white/80 px-3 py-1">Degree Programmes</div>
                  <Link to="/academics/bsw" className="block px-3 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg">BSW — Bachelor of Social Work</Link>
                  <Link to="/academics/msw" className="block px-3 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg">MSW — Master of Social Work</Link>
                  <Link to="/academics/manuals" className="block px-3 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg">Academic Manuals</Link>
                  <div className="h-px bg-white/40 my-2" />
                  <div className="text-xs font-semibold uppercase text-white/80 px-3 py-1">MSW Specialisations</div>
                  <Link to="/academics/msw/community-development" className="block px-3 py-1.5 text-xs text-white hover:text-white hover:bg-[#1d4ed8] rounded-lg">Community Development (CD)</Link>
                  <Link to="/academics/msw/youth-development" className="block px-3 py-1.5 text-xs text-white hover:text-white hover:bg-[#1d4ed8] rounded-lg">Youth Development (YD)</Link>
                  <Link to="/academics/msw/social-entrepreneurship" className="block px-3 py-1.5 text-xs text-white hover:text-white hover:bg-[#1d4ed8] rounded-lg">Social Entrepreneurship (SED)</Link>
                  <Link to="/academics/msw/peace-conflict-studies" className="block px-3 py-1.5 text-xs text-white hover:text-white hover:bg-[#1d4ed8] rounded-lg">Peace & Conflict Transformation (PCTS)</Link>
                </div>
              )}
            </div>

            {/* Documents */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('documents')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-1 font-medium text-sm text-white hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-all">
                Documents <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'documents' && (
                <div className="absolute top-full left-0 w-64 bg-[#2563eb] rounded-xl shadow-xl border border-[#2563eb] p-2 z-50 animate-fadeIn">
                  <Link to="/documents" className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg">Prospectus & Calendar</Link>
                  <Link to="/nirf" className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg">NIRF Reports</Link>
                  <Link to="/naac" className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg">NAAC Accreditation B++</Link>
                  <Link to="/mandatory-disclosures" className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg">Mandatory Disclosures</Link>
                </div>
              )}
            </div>

            {/* IQAC */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('iqac')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-1 font-medium text-sm text-white hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-all">
                IQAC <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'iqac' && (
                <div className="absolute top-full left-0 w-64 bg-[#2563eb] rounded-xl shadow-xl border border-[#2563eb] p-2 z-50 animate-fadeIn max-h-96 overflow-y-auto">
                  {[
                    { id: 'about', label: 'About IQAC' },
                    { id: 'policy', label: 'Quality Assurance Policy' },
                    { id: 'functions', label: 'Functions' },
                    { id: 'composition', label: 'Composition' },
                    { id: 'activities', label: 'Major Activities' },
                    { id: 'meeting-minutes', label: 'Meeting Minutes' },
                    { id: 'naac', label: 'NAAC Compliance' },
                    { id: 'best-practices', label: 'Best Practices' },
                    { id: 'aqar', label: 'AQAR' },
                    { id: 'nirf', label: 'NIRF Reports' },
                    { id: 'annual-reports', label: 'Annual Reports' },
                    { id: 'mandatory-disclosures', label: 'Mandatory Disclosures' },
                    { id: 'feedback', label: 'Feedback' },
                  ].map((s) => (
                    <Link key={s.id} to={`/iqac/${s.id}`} onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg transition-colors">
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Student Services (includes Student Life items) */}
            <div className="relative" onMouseEnter={() => setActiveDropdown('student-services')} onMouseLeave={() => setActiveDropdown(null)}>
              <button className="flex items-center gap-1 font-medium text-sm text-white hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-all">
                Student Services <ChevronDown className="w-4 h-4" />
              </button>
              {activeDropdown === 'student-services' && (
                <div className="absolute top-full left-0 w-64 bg-[#2563eb] rounded-xl shadow-xl border border-[#2563eb] p-2 z-50 animate-fadeIn max-h-96 overflow-y-auto">
                  <Link to="/student-services" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-sm font-semibold text-[#003DA5] hover:bg-blue-50 rounded-lg border-b border-neutral-100 mb-1">
                    View All Services →
                  </Link>
                  <div className="text-xs font-semibold uppercase text-blue-100 px-4 py-1 mt-1">Campus Life</div>
                  <Link to="/student-life" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg transition-colors">Campus Life Overview</Link>
                  <Link to="/student-life/clubs" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg transition-colors">Clubs (10 Active Clubs)</Link>
                  <Link to="/student-life/forums" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg transition-colors">Academic Forums</Link>
                  <Link to="/achievements" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg transition-colors">Student Achievements</Link>
                  <Link to="/gallery" onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg transition-colors">Photo Gallery</Link>
                  <div className="h-px bg-neutral-100 my-1" />
                  <div className="text-xs font-semibold uppercase text-blue-100 px-4 py-1">Support Services</div>
                  {[
                    { id: 'scholarship', label: 'Scholarship' },
                    { id: 'counselling', label: 'Counselling Centre' },
                    { id: 'anti-ragging', label: 'Anti-Ragging Committee' },
                    { id: 'grievance', label: 'Grievance Redressal' },
                    { id: 'welfare', label: 'Student Welfare' },
                    { id: 'womens-cell', label: "Women's Empowerment Cell" },
                    { id: 'internal-complaints', label: 'Internal Complaints Committee' },
                    { id: 'alumni', label: 'Alumni Association' },
                    { id: 'library', label: 'Library' },
                    { id: 'placement', label: 'Placement Cell' },
                    { id: 'coaching', label: 'Coaching Centre' },
                    { id: 'health-care', label: 'Health Care' },
                  ].map((s) => (
                    <Link key={s.id} to={`/student-services/${s.id}`} onClick={() => setActiveDropdown(null)} className="block px-4 py-2 text-sm text-white hover:bg-[#1d4ed8] hover:text-white rounded-lg transition-colors">
                      {s.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/faculty" className="font-medium text-sm text-white hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-all">Faculty</Link>
            <Link to="/placement" className="font-medium text-sm text-white hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-all">Placements</Link>
            <Link to="/infrastructure" className="font-medium text-sm text-white hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-all">Infrastructure</Link>
            <Link to="/contact" className="font-medium text-sm text-white hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-all">Contact</Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white flex flex-col pt-16 pb-8 px-6 overflow-y-auto animate-fadeIn">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
            <div className="font-serif font-bold text-xl text-[#003DA5]">NEISSR Menu</div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-neutral-600 hover:text-black">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 py-4 space-y-4">
            <Link to="/" className="block font-semibold text-lg text-neutral-800 py-2 border-b border-neutral-100">Home</Link>

            <div>
              <button onClick={() => toggleMobileAccordion('about')} className="w-full flex justify-between items-center py-2 font-semibold text-lg text-neutral-800 border-b border-neutral-100">
                <span>About</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileAccordion === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'about' && (
                <div className="pl-4 py-2 space-y-2 bg-neutral-50 rounded-lg my-1">
                  <Link to="/about" className="block text-sm font-medium text-neutral-700 py-1">About NEISSR</Link>
                  <Link to="/about/messages" className="block text-sm font-medium text-neutral-700 py-1">Leadership Messages</Link>
                </div>
              )}
            </div>

            <div>
              <button onClick={() => toggleMobileAccordion('academics')} className="w-full flex justify-between items-center py-2 font-semibold text-lg text-neutral-800 border-b border-neutral-100">
                <span>Academics</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileAccordion === 'academics' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'academics' && (
                <div className="pl-4 py-2 space-y-2 bg-neutral-50 rounded-lg my-1">
                  <Link to="/academics/bsw" className="block text-sm font-medium text-neutral-800 py-1">BSW Programme</Link>
                  <Link to="/academics/msw" className="block text-sm font-medium text-neutral-800 py-1">MSW Programme</Link>
                  <Link to="/academics/manuals" className="block text-sm font-medium text-neutral-800 py-1">Academic Manuals</Link>
                  <Link to="/academics/msw/community-development" className="block text-xs text-neutral-600 py-1">Community Development (CD)</Link>
                  <Link to="/academics/msw/youth-development" className="block text-xs text-neutral-600 py-1">Youth Development (YD)</Link>
                  <Link to="/academics/msw/social-entrepreneurship" className="block text-xs text-neutral-600 py-1">Social Entrepreneurship (SED)</Link>
                  <Link to="/academics/msw/peace-conflict-studies" className="block text-xs text-neutral-600 py-1">Peace & Conflict Studies (PCTS)</Link>
                </div>
              )}
            </div>

            <div>
              <button onClick={() => toggleMobileAccordion('iqac')} className="w-full flex justify-between items-center py-2 font-semibold text-lg text-neutral-800 border-b border-neutral-100">
                <span>IQAC</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileAccordion === 'iqac' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'iqac' && (
                <div className="pl-4 py-2 space-y-1 bg-neutral-50 rounded-lg my-1">
                  {[
                    { id: 'about', label: 'About IQAC' },
                    { id: 'policy', label: 'Quality Policy' },
                    { id: 'functions', label: 'Functions' },
                    { id: 'activities', label: 'Major Activities' },
                    { id: 'naac', label: 'NAAC Compliance' },
                    { id: 'aqar', label: 'AQAR' },
                    { id: 'nirf', label: 'NIRF Reports' },
                    { id: 'mandatory-disclosures', label: 'Mandatory Disclosures' },
                  ].map((s) => (
                    <Link key={s.id} to={`/iqac/${s.id}`} className="block text-sm font-medium text-neutral-700 py-1.5">{s.label}</Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button onClick={() => toggleMobileAccordion('student-services')} className="w-full flex justify-between items-center py-2 font-semibold text-lg text-neutral-800 border-b border-neutral-100">
                <span>Student Services</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${mobileAccordion === 'student-services' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'student-services' && (
                <div className="pl-4 py-2 space-y-1 bg-neutral-50 rounded-lg my-1">
                  <Link to="/student-services" className="block text-sm font-semibold text-[#003DA5] py-1.5 border-b border-neutral-200 mb-1">View All →</Link>
                  <p className="text-xs font-semibold uppercase text-neutral-400 py-1">Campus Life</p>
                  <Link to="/student-life" className="block text-xs font-medium text-neutral-700 py-1">Campus Life Overview</Link>
                  <Link to="/student-life/clubs" className="block text-xs font-medium text-neutral-700 py-1">Clubs</Link>
                  <Link to="/student-life/forums" className="block text-xs font-medium text-neutral-700 py-1">Academic Forums</Link>
                  <Link to="/achievements" className="block text-xs font-medium text-neutral-700 py-1">Student Achievements</Link>
                  <Link to="/gallery" className="block text-xs font-medium text-neutral-700 py-1">Photo Gallery</Link>
                  <p className="text-xs font-semibold uppercase text-neutral-400 py-1 mt-1">Support Services</p>
                  {[
                    { id: 'scholarship', label: 'Scholarship' },
                    { id: 'counselling', label: 'Counselling' },
                    { id: 'anti-ragging', label: 'Anti-Ragging' },
                    { id: 'grievance', label: 'Grievance Redressal' },
                    { id: 'welfare', label: 'Student Welfare' },
                    { id: 'womens-cell', label: "Women's Cell" },
                    { id: 'alumni', label: 'Alumni' },
                    { id: 'library', label: 'Library' },
                    { id: 'placement', label: 'Placement' },
                  ].map((s) => (
                    <Link key={s.id} to={`/student-services/${s.id}`} className="block text-xs font-medium text-neutral-700 py-1">{s.label}</Link>
                  ))}
                </div>
              )}
            </div>

            <Link to="/faculty" className="block font-semibold text-lg text-neutral-800 py-2 border-b border-neutral-100">Faculty</Link>
            <Link to="/placement" className="block font-semibold text-lg text-neutral-800 py-2 border-b border-neutral-100">Placements</Link>
            <Link to="/documents" className="block font-semibold text-lg text-neutral-800 py-2 border-b border-neutral-100">Documents</Link>
            <Link to="/contact" className="block font-semibold text-lg text-neutral-800 py-2 border-b border-neutral-100">Contact</Link>
          </div>

          <div className="pt-4">
            <Link to="/admissions" className="w-full inline-flex items-center justify-center gap-2 bg-[#C8102E] text-white py-3.5 rounded-full font-bold text-base shadow-md">
              Admissions Open 2026-27 <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}





































