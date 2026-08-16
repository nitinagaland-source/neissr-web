import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEED_DOCUMENTS } from '../data/seedData';
import { formatDate } from '../lib/date';
import { Download, FileText, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { DocumentItem } from '../types/neissr';

export default function DocumentsPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  );
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: documentsList = SEED_DOCUMENTS } = useQuery({
    queryKey: ['public-documents'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED_DOCUMENTS;
      const snap = await getDocs(collection(db, 'documents'));
      if (snap.empty) return SEED_DOCUMENTS;
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as DocumentItem[];
      const published = items.filter((i) => i.status === 'published' || !i.status);
      return published.length > 0 ? published : SEED_DOCUMENTS;
    },
  });

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'prospectus', label: 'Prospectus' },
    { id: 'academic-calendar', label: 'Academic Calendar' },
    { id: 'examination-manual', label: 'Examination Manual' },
    { id: 'nirf', label: 'NIRF Reports' },
    { id: 'naac', label: 'NAAC Accreditation' },
    { id: 'affiliations', label: 'Affiliations & Recognition' },
    { id: 'mandatory-disclosures', label: 'Mandatory Disclosures' },
    { id: 'magazines', label: 'Magazines' }
  ];

  const filteredDocs = documentsList.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Documents & Resources Repository</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            Official prospectuses, academic calendars, examination guidelines, NIRF reports, and NAAC accreditation certificates.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#C8102E] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search document title..."
              className="pl-9 pr-4 py-2 rounded-full border border-neutral-300 text-xs w-full md:w-64 focus:border-[#003DA5] focus:outline-none"
            />
          </div>
        </div>

        {/* Documents Table / List */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-100 font-serif font-bold text-xl text-neutral-900">
            Available Downloads ({filteredDocs.length})
          </div>

          <div className="divide-y divide-neutral-100">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-6 hover:bg-[#FAF9F7] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#003DA5] shrink-0" />
                    <h2 className="font-serif font-bold text-lg text-neutral-900">{doc.title}</h2>
                  </div>
                  <p className="text-xs text-neutral-600 pl-7">{doc.description}</p>
                  <div className="text-[11px] text-neutral-400 pl-7">
                    Category: <span className="font-semibold uppercase text-neutral-600">{doc.category}</span> | Published: {formatDate(doc.publishedAt)} | Size: {doc.fileSize || 'PDF'}
                  </div>
                </div>

                {doc.fileUrl ? (
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#003DA5] hover:bg-[#002B75] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                ) : (
                  <span className="text-xs text-neutral-400 italic px-4 py-2 border border-neutral-200 rounded-full">
                    Document Coming Soon
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
