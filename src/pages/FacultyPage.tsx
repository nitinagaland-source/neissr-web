import React, { useState } from 'react';
import { SEED_FACULTY } from '../data/seedData';
import { Search } from 'lucide-react';
import FacultyCard from '../components/ui/FacultyCard';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { FacultyMember } from '../types/neissr';

export default function FacultyPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'management' | 'teaching' | 'non-teaching'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: facultyMembers = SEED_FACULTY } = useQuery({
    queryKey: ['public-faculty'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_FACULTY;
      const snap = await getDocs(collection(db, 'faculty'));
      if (snap.empty) return SEED_FACULTY;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as FacultyMember[];
      const published = items.filter((i) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_FACULTY;
    },
  });

  const filteredFaculty = facultyMembers.filter((member) => {
    const matchesTab = activeTab === 'all' || member.type === activeTab;
    const matchesSearch =
      (member.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.designation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.department || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Faculty & Staff Directory</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            Meet the experienced academicians, practitioners, and administrators driving NEISSR&apos;s mission.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#C8102E] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Personnel ({facultyMembers.length})
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'management'
                  ? 'bg-[#C8102E] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Management
            </button>
            <button
              onClick={() => setActiveTab('teaching')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'teaching'
                  ? 'bg-[#C8102E] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Teaching Faculty
            </button>
            <button
              onClick={() => setActiveTab('non-teaching')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                activeTab === 'non-teaching'
                  ? 'bg-[#C8102E] text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Administrative Staff
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search faculty name or dept..."
              className="pl-9 pr-4 py-2 rounded-full border border-neutral-300 text-xs w-full md:w-64 focus:border-[#003DA5] focus:outline-none"
            />
          </div>
        </div>

        {/* Faculty Grid - Matching Reference Image Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pt-4">
          {filteredFaculty.map((member) => (
            <FacultyCard key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}

