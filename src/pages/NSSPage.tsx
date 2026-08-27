import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";
import { ExternalLink, FileText } from "lucide-react";

export default function NSSPage() {
  const { data: docs = [] } = useQuery({
    queryKey: ["nss-docs"],
    queryFn: async () => {
      if (!isFirebaseConfigured) return [];
      const snap = await getDocs(collection(db, "nss"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#1a7a4a] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Not Me But You</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">National Service Scheme (NSS)</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">NEISSR's NSS unit develops students' personality and character through community service, instilling the values of social responsibility and national development.</p>
        </div>
      </section>
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#1a7a4a]">About NSS at NEISSR</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">The NSS unit at NEISSR engages students in meaningful community service activities including blood donation camps, cleanliness drives, health awareness programmes, and disaster relief operations. Our motto "Not Me But You" reflects the spirit of selfless service.</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#1a7a4a]">Activities</h2>
            <ul className="text-sm text-neutral-600 space-y-2">
              {["Annual Special Camp in adopted villages","Blood Donation Drives","Swachh Bharat Abhiyan participation","Health & Hygiene Awareness","Tree Plantation Drives","Disaster Relief & Rescue Training"].map((item) => (
                <li key={item} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#1a7a4a] mt-1.5 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
        {docs.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="font-serif font-bold text-xl text-neutral-900 mb-4">NSS Documents & Reports</h2>
            <div className="space-y-3">
              {docs.map((doc: any) => (
                <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:border-[#1a7a4a]/30 hover:bg-green-50/50 transition-all group">
                  <FileText className="w-5 h-5 text-[#1a7a4a] shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-neutral-800 truncate">{doc.title}</p>{doc.description && <p className="text-xs text-neutral-500 truncate">{doc.description}</p>}</div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#1a7a4a]" />
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}