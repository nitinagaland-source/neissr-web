import React from 'react';
import { Download, BookOpen } from 'lucide-react';

export default function MagazinePage() {
  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">College Annual Publication</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Eureka Magazine 2023-24</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">
            4th Edition themed &quot;New Awakening&quot; capturing student creative writing, articles, field logs, and photo essays.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-neutral-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-64 bg-[#003DA5] text-white rounded-2xl flex flex-col justify-between p-6 shadow-xl border-4 border-[#C9A227] shrink-0">
              <div>
                <div className="font-serif italic text-3xl font-bold">EUREKA</div>
                <div className="text-[10px] uppercase tracking-widest text-[#C9A227] mt-1">4th Edition</div>
              </div>
              <div className="text-xs font-semibold">New Awakening</div>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif text-3xl font-bold text-neutral-900">
                Eureka Magazine 2023-24
              </h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Published annually by the Literary & Media Clubs of NEISSR, Eureka features research articles, personal reflection essays on fieldwork, tribal folk tales, poems, and annual reports of all 10 student clubs.
              </p>
              <div className="pt-2">
                <a
                  href="/documents"
                  className="inline-flex items-center gap-2 bg-[#C8102E] text-white px-6 py-3 rounded-full font-bold text-xs hover:bg-[#9A0C24]"
                >
                  <Download className="w-4 h-4" /> Download PDF Magazine (8.5 MB)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
