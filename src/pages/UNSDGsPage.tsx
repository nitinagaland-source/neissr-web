import React from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../lib/firebase";
import { ExternalLink, FileText, Download } from "lucide-react";

export default function UNSDGsPage() {
  const { data: docs = [] } = useQuery({
    queryKey: ["un-sdgs-docs"],
    queryFn: async () => {
      if (!isFirebaseConfigured) return [];
      const snap = await getDocs(collection(db, "un_sdgs"));
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    },
  });

  return (
    <div className="py-12 bg-[#FAF9F7] space-y-12">
      <section className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="bg-[#003DA5] text-white rounded-3xl p-8 md:p-12 shadow-md space-y-3">
          <div className="text-xs uppercase font-semibold text-[#C9A227]">Global Goals</div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold">UN 17 Sustainable Development Goals</h1>
          <p className="text-neutral-200 text-sm md:text-base max-w-2xl">NEISSR's commitment to the United Nations 2030 Agenda for Sustainable Development through Social Work education and community engagement.</p>
        </div>
      </section>
      <section className="max-w-[1440px] mx-auto px-4 md:px-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#003DA5]">Our SDG Commitment</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">As a premier Social Work institution, NEISSR integrates the UN SDGs into its curriculum, research, and community outreach. Our programmes address SDG 1 (No Poverty), SDG 3 (Good Health), SDG 4 (Quality Education), SDG 5 (Gender Equality), SDG 10 (Reduced Inequalities), SDG 16 (Peace & Justice), and SDG 17 (Partnerships).</p>
          </div>
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm space-y-3">
            <h2 className="font-serif font-bold text-xl text-[#003DA5]">Key Initiatives</h2>
            <ul className="text-sm text-neutral-600 space-y-2">
              {["Peace and Conflict Transformation Studies (SDG 16)", "Community Development Field Practicum (SDG 1, 10)", "Gender Champions Club (SDG 5)", "Green Club & Environmental Drives (SDG 13)", "Rural Camp & Village Adoption (SDG 11)"].map((item) => (
                <li key={item} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#003DA5] mt-1.5 shrink-0" />{item}</li>
              ))}
            </ul>
          </div>
        </div>
        {docs.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="font-serif font-bold text-xl text-neutral-900 mb-4">Documents & Reports</h2>
            <div className="space-y-3">
              {docs.map((doc: any) => (
                <a key={doc.id} href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl border border-neutral-100 hover:border-[#003DA5]/30 hover:bg-blue-50/50 transition-all group">
                  <FileText className="w-5 h-5 text-[#003DA5] shrink-0" />
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-neutral-800 truncate">{doc.title}</p>{doc.description && <p className="text-xs text-neutral-500 truncate">{doc.description}</p>}</div>
                  <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#003DA5]" />
                </a>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}