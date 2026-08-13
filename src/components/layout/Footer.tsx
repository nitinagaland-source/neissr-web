import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  ArrowUpRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../../lib/firebase';

export default function Footer() {
  const { data: siteSettings } = useQuery({
    queryKey: ['settings-general'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return null;
      const snap = await getDoc(doc(db, 'settings', 'general'));
      return snap.exists() ? snap.data() : null;
    },
  });

  const address = siteSettings?.address || "7th Mile, Peace Centre, Chümoukedima, Nagaland 797103, India";
  const contactPhone = siteSettings?.contactPhone || "6909617895 | 8787663564";
  const contactEmail = siteSettings?.contactEmail || "contact.neissr@gmail.com";
  return (
    <footer className="bg-[#14130F] text-white pt-12 pb-6 border-t-4 border-[#C8102E]">
      {/* Embedded Google Maps Section */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mb-12">
        <div className="bg-neutral-900 p-2 rounded-2xl overflow-hidden shadow-xl border border-neutral-800">
          <div className="flex items-center justify-between p-3 px-4 text-xs font-semibold uppercase text-neutral-300">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C8102E]" /> Peace Centre Campus Location
            </span>
            <span>7th Mile, Chümoukedima, Nagaland 797103</span>
          </div>
          <iframe
            title="NEISSR Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.97011030432!2d93.770451!3d25.823084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3746237190000001%3A0x1d6a62371!2sNorth%20East%20Institute%20of%20Social%20Sciences%20and%20Research!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="260"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
          ></iframe>
        </div>
      </div>

      {/* 4-Column Footer Grid */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-neutral-800">
        {/* Column 1: Logo & Contact */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/fYhSSyW4/channels4-profile-1.jpg"
              alt="NEISSR Logo"
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border-2 border-[#C8102E]"
            />
            <div>
              <div className="font-serif font-bold text-2xl text-white">NEISSR</div>
              <p className="text-xs text-[#C9A227] tracking-wider uppercase font-semibold">
                Excel in Knowledge & Service
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            North East Institute of Social Sciences and Research — Nagaland&apos;s premier Social Work college. Affiliated to Nagaland University. Managed by Catholic Diocese of Kohima.
          </p>
          <div className="space-y-2 text-xs text-neutral-300 pt-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C8102E] shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C9A227] shrink-0" />
              <span className="hover:text-white transition-colors">
                {contactPhone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#003DA5] shrink-0" />
              <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">
                {contactEmail}
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-serif font-semibold text-lg text-white mb-4 border-l-2 border-[#C8102E] pl-3">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li>
              <Link to="/" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                Home Page
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                About Institute & Vision
              </Link>
            </li>
            <li>
              <Link to="/academics" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                Academics (BSW & MSW)
              </Link>
            </li>
            <li>
              <Link to="/admissions" className="hover:text-white min-h-[44px] flex items-center transition-colors text-[#C8102E] font-medium">
                Admissions 2026-27 Open
              </Link>
            </li>
            <li>
              <Link to="/faculty" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                Faculty & Staff Directory
              </Link>
            </li>
            <li>
              <Link to="/placement" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                Placement Cell & Records
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                Contact & Helplines
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Resources & Accreditations */}
        <div>
          <h3 className="font-serif font-semibold text-lg text-white mb-4 border-l-2 border-[#003DA5] pl-3">
            Resources
          </h3>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            <li>
              <Link to="/documents" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                Downloadable Documents
              </Link>
            </li>
            <li>
              <Link to="/nirf" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                NIRF Ranking Data
              </Link>
            </li>
            <li>
              <Link to="/naac" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                NAAC Grade B++ Accreditation
              </Link>
            </li>
            <li>
              <Link to="/mandatory-disclosures" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                Mandatory Disclosures & Affiliations
              </Link>
            </li>
            <li>
              <Link to="/magazine" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                Eureka Magazine 2023-24
              </Link>
            </li>
            <li>
              <Link to="/infrastructure" className="hover:text-white min-h-[44px] flex items-center transition-colors">
                Peace Library & Campus Facilities
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Follow Us & Connect */}
        <div>
          <h3 className="font-serif font-semibold text-lg text-white mb-4 border-l-2 border-[#C9A227] pl-3">
            Follow Us & Connect
          </h3>
          <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
            Stay connected with the latest social work initiatives, campus news, and peace activities.
          </p>
          <div className="flex items-center gap-3 mb-6">
            <a
              href="https://www.facebook.com/NEISSR/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-[#003DA5] text-white flex items-center justify-center transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/contact.neissr/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-[#C8102E] text-white flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/@NEISSR"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          <div className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800">
            <div className="text-xs font-semibold text-[#C9A227] uppercase">Affiliation & Codes</div>
            <div className="text-[11px] text-neutral-400 mt-1">
              AISHE Code: <span className="text-white font-medium">C-54342</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              UGC Recognition: <span className="text-white font-medium">Section 2(f)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Strip */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-500 gap-3">
        <div>© 2026 NEISSR. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <Link to="/contact" className="hover:text-neutral-300 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/contact" className="hover:text-neutral-300 transition-colors">
            Terms of Service
          </Link>
          <a
            href="https://www.kristujayanti.edu.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-300 transition-colors inline-flex items-center gap-1"
          >
            Ref Layout Spec <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
