import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";
import { ExternalLink, FileText, BookOpen } from "lucide-react";

export default function LessonPlanPage() {
  const { data: docs = [] } = useQuery({
    queryKey: ["lesson-plans-docs"],
    queryFn: async () => {
      if (!isFirebaseConfigured) return [];
      const snap = await getDocs(collection(db, "lesson_plans"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Academic Resource</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Lesson Plans</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">Semester-wise lesson plans for BSW and MSW programmes at NEISSR.</p>
        </div>
      </section>
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        {docs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#003DA5]/10 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6 text-[#003DA5]" />
            </div>
            <h2 className="font-serif font-bold text-xl text-neutral-800">Lesson Plans Coming Soon</h2>
            <p className="text-xs text-neutral-500">Lesson plans will be uploaded here. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((doc: any) => (
              <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm hover:shadow-md hover:border-[#003DA5]/30 transition-all group space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#003DA5]/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#003DA5]" />
                </div>
                <div>
                  <p className="font-bold text-neutral-800 text-sm group-hover:text-[#003DA5] transition-colors">{doc.title}</p>
                  {doc.description && <p className="text-xs text-neutral-500 mt-1">{doc.description}</p>}
                  {doc.publishedAt && <p className="text-xs text-neutral-400 mt-2">{doc.publishedAt}</p>}
                </div>
                <div className="flex items-center gap-1 text-xs text-[#003DA5] font-semibold">
                  View Document <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}