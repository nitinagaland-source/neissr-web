import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { FileText, ChevronRight, Loader2, BookOpen } from 'lucide-react';

function getOpenUrl(url: string): string {
  if (!url) return url;
  const match = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (match) return `https://drive.google.com/file/d/${match[1]}/view`;
  return url;
}

interface Block { title: string; color: string; items: { name: string; url: string; size?: string }[]; }
interface ManualsData { title: string; introHtml?: string; blocks: Block[]; }

const BORDER_COLORS: Record<string, string> = {
  green: 'border-l-green-500 bg-green-50',
  orange: 'border-l-orange-500 bg-orange-50',
  blue: 'border-l-blue-500 bg-blue-50',
  red: 'border-l-red-500 bg-red-50',
  purple: 'border-l-purple-500 bg-purple-50',
  amber: 'border-l-amber-500 bg-amber-50',
};
const HEADER_COLORS: Record<string, string> = {
  green: 'text-green-700', orange: 'text-orange-700', blue: 'text-blue-700',
  red: 'text-red-700', purple: 'text-purple-700', amber: 'text-amber-700',
};

const SEED: ManualsData = {
  title: 'Academic Manuals',
  introHtml: '<p>Download academic manuals, syllabi, and reference materials for BSW and MSW programmes at NEISSR.</p>',
  blocks: [
    { title: 'BSW MANUALS & SYLLABI', color: 'blue', items: [] },
    { title: 'MSW MANUALS & SYLLABI', color: 'green', items: [] },
  ],
};

export default function AcademicManualsPage() {
  const { data, isLoading } = useQuery<ManualsData>({
    queryKey: ['academic-manuals'],
    queryFn: async () => {
      if (!isFirebaseConfigured) return SEED;
      const snap = await getDoc(doc(db, 'academic_manuals', 'main'));
      if (snap.exists()) return snap.data() as ManualsData;
      return SEED;
    },
  });

  const content = data || SEED;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#003DA5] via-[#0052CC] to-[#003DA5] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-blue-200 mb-3">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/academics" className="hover:text-white">Academics</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white font-semibold">Academic Manuals</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-8 h-8 text-blue-200" />
            <h1 className="text-2xl md:text-4xl font-serif font-bold">{content.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-10">
        {/* Intro */}
        {content.introHtml && (
          <div
            className="prose prose-base max-w-none text-neutral-700 mb-8
              prose-p:mb-4 prose-headings:text-[#003DA5] prose-headings:font-serif"
            dangerouslySetInnerHTML={{ __html: content.introHtml }}
          />
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#003DA5] animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {content.blocks?.length === 0 && (
              <div className="text-center py-16 bg-neutral-50 rounded-xl border-2 border-dashed border-neutral-200">
                <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">No manuals uploaded yet. Check back soon.</p>
              </div>
            )}
            {content.blocks?.map((block, bi) => (
              <div key={bi} className={`border-l-4 ${BORDER_COLORS[block.color] || BORDER_COLORS.blue} rounded-r-lg p-6 shadow-sm`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${HEADER_COLORS[block.color] || HEADER_COLORS.blue}`}>
                  {block.title}
                </h3>
                {block.items?.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">No documents added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {block.items.map((item, ii) => (
                      <div key={ii} className="flex items-center justify-between py-3 px-4 bg-white rounded-md border border-neutral-100 hover:border-[#003DA5] transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className="w-4 h-4 text-[#C8102E] shrink-0" />
                          <span className="text-sm font-medium text-neutral-800 truncate">{item.name}</span>
                        </div>
                        <a
                          href={getOpenUrl(item.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#003DA5] hover:bg-[#002d7a] text-white text-xs font-semibold rounded shrink-0 ml-3 transition-colors"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
