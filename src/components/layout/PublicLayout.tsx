import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PublicLayout() {
  const tickerItems = [
    '🎓 Admissions Open 2026-27 for BSW & MSW',
    '⭐ NAAC B++ Accredited (CGPA 2.98)',
    '🕊️ First MSW College in Nagaland offering PCTS Specialisation',
    '💼 75% 5-Year Average Placement Rate',
    '📜 UGC 2(f) Recognized Institute',
    '🏫 Peace Centre Inaugurated 2022 at 7th Mile Chümoukedima',
    '👑 Miss Nagaland 2023 — NEISSR Trainee'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F7] text-[#24221F] selection:bg-[#C8102E] selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Sticky Announcement Ticker at Very Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#003DA5] text-white text-xs py-2 border-t border-[#C9A227] overflow-hidden shadow-lg">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {tickerItems.concat(tickerItems).map((item, idx) => (
            <span key={idx} className="flex items-center gap-3 font-medium">
              <span>{item}</span>
              <span className="text-[#C9A227] font-bold">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
