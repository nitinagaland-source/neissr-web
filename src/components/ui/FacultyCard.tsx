import React from 'react';
import { Link } from 'react-router-dom';
import { FacultyMember } from '../../types/neissr';
import { GraduationCap, Mail, ChevronRight, User } from 'lucide-react';

interface FacultyCardProps {
  key?: string;
  member: FacultyMember;
}

export default function FacultyCard({ member }: FacultyCardProps) {
  const displayPhoto = member.photoUrl;

  return (
    <div className="relative bg-white rounded-2xl border border-neutral-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_32px_-8px_rgba(0,61,165,0.12)] hover:border-[#003DA5]/30 transition-all duration-300 flex flex-col items-center text-center px-6 pt-16 pb-6 mt-14 group">
      
      {/* Subtle Top Gold Highlight Bar on Hover */}
      <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#C9A227] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />

      {/* Overlapping Top Circular Photo Frame */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 sm:w-26 sm:h-26 rounded-full border-4 border-white ring-1 ring-neutral-200/80 shadow-md bg-neutral-50 overflow-hidden shrink-0 transition-all duration-300 group-hover:ring-[#003DA5]">
        {displayPhoto ? (
          <img
            src={displayPhoto}
            alt={member.fullName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-neutral-100 to-neutral-200/70 text-neutral-400">
            <User className="w-10 h-10 stroke-[1.5]" />
          </div>
        )}
      </div>

      {/* Faculty Name */}
      <h3 className="font-serif font-bold text-lg sm:text-xl text-neutral-900 leading-snug group-hover:text-[#003DA5] transition-colors mt-1">
        {member.fullName}
      </h3>

      {/* Designation */}
      <p className="text-xs font-semibold text-[#003DA5] tracking-wide mt-1 min-h-[32px] flex items-center justify-center">
        {member.designation}
      </p>

      {/* Department Pill */}
      <div className="mt-2.5">
        <span className="inline-block bg-[#003DA5]/5 text-[#003DA5] border border-[#003DA5]/15 text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
          {member.department}
        </span>
      </div>

      {/* Divider */}
      <div className="w-12 h-px bg-neutral-200 my-4 group-hover:w-20 group-hover:bg-[#003DA5]/30 transition-all duration-300" />

      {/* Qualifications */}
      <div className="flex items-start justify-center gap-1.5 text-xs text-neutral-600 mb-3 px-1">
        <GraduationCap className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
        <span className="line-clamp-2 leading-relaxed font-normal">
          <span className="font-semibold text-neutral-800">Qualifications: </span>
          {member.qualifications.join(', ')}
        </span>
      </div>

      {/* Email Link */}
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 hover:text-[#C8102E] transition-colors mb-4 truncate max-w-full"
          title={`Email ${member.fullName}`}
        >
          <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span className="truncate">{member.email}</span>
        </a>
      )}

      {/* View Profile Action */}
      <div className="mt-auto pt-2 border-t border-neutral-100 w-full flex justify-center">
        <Link
          to={`/faculty/${member.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8102E] hover:text-[#003DA5] transition-colors py-1 group/btn"
        >
          <span>View Full Profile</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
