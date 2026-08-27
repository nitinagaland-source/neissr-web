import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";
import { ExternalLink, FileText } from "lucide-react";

export default function NCCPage() {
  const { data: docs = [] } = useQuery({
    queryKey: ["ncc-docs"],
    queryFn: async () => {
      if (!isFirebaseConfigured) return [];
      const snap = await getDocs(collection(db, "ncc"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#1a3a6a] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Unity & Discipline</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">National Cadet Corps (NCC)</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">NEISSR's NCC wing develops disciplined, patriotic, and socially responsible youth leaders committed to national service and community development.</p>
        </div>
      </section>
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#1a3a6a]">About NCC at NEISSR</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">The NCC unit at NEISSR trains cadets in discipline, leadership, and national service. Students participate in camps, parades, and community service activities that complement their Social Work education with values of unity, discipline, and civic responsibility.</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#1a3a6a]">Activities & Training</h2>
            <ul className="text-sm text-neutral-600 space-y-2">
              {["Annual Training Camps","Republic Day & Independence Day Parades","Community Service Drives","Trekking & Adventure Activities","Leadership Training Workshops","Social Awareness Campaigns"].map((item) => (
                <li key={item} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#1a3a6a] mt-1.5 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
        {docs.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="font-serif font-bold text-xl text-neutral-900 mb-4">NCC Documents & Reports</h2>
            <div className="space-y-3">
              {docs.map((doc: any) => (
                <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:border-[#1a3a6a]/30 hover:bg-blue-50/50 transition-all group">
                  <FileText className="w-5 h-5 text-[#1a3a6a] shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-neutral-800 truncate">{doc.title}</p>{doc.description && <p className="text-xs text-neutral-500 truncate">{doc.description}</p>}</div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#1a3a6a]" />
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}