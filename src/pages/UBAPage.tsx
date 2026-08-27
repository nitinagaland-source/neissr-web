import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";
import { ExternalLink, FileText } from "lucide-react";

export default function UBAPage() {
  const { data: docs = [] } = useQuery({
    queryKey: ["uba-docs"],
    queryFn: async () => {
      if (!isFirebaseConfigured) return [];
      const snap = await getDocs(collection(db, "uba"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#C8102E] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Government of India Initiative</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">Unnat Bharat Abhiyan (UBA)</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">Transforming rural India through higher education institutions. NEISSR's UBA activities focus on community development, sustainable livelihoods, and village transformation.</p>
        </div>
      </section>
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{title:"Village Adoption",desc:"NEISSR has adopted villages in Nagaland under UBA, conducting participatory rural appraisals and community needs assessments."},{title:"Student Engagement",desc:"BSW and MSW students participate in UBA activities as part of their field practicum and rural camp programmes."},{title:"Documentation",desc:"Regular reports, activity logs, and impact assessments are submitted to the UBA portal and maintained for institutional records."}].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-2">
              <h3 className="font-bold text-[#C8102E] text-base">{item.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        {docs.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="font-serif font-bold text-xl text-neutral-900 mb-4">UBA Documents & Reports</h2>
            <div className="space-y-3">
              {docs.map((doc: any) => (
                <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:border-[#C8102E]/30 hover:bg-red-50/50 transition-all group">
                  <FileText className="w-5 h-5 text-[#C8102E] shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-neutral-800 truncate">{doc.title}</p>{doc.description && <p className="text-xs text-neutral-500 truncate">{doc.description}</p>}</div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#C8102E]" />
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}