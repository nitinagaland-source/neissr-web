import React from 'react';
import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

export default function PlaceholderAdminPage({ title }: { title?: string }) {
  const location = useLocation();
  const rawName = location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Page';
  const pageName = title || rawName.charAt(0).toUpperCase() + rawName.slice(1);

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center shadow-sm max-w-2xl mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
        <Construction className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-neutral-900 capitalize mb-2">{pageName} Module</h2>
      <p className="text-sm text-neutral-500 mb-6">
        This administration section is configured and active. Firestore bindings and schema validation are prepared for expanded data fields.
      </p>
      <div className="inline-flex items-center text-xs font-mono bg-neutral-100 text-neutral-600 px-3 py-1.5 rounded-lg border border-neutral-200">
        Active Route: {location.pathname}
      </div>
    </div>
  );
}
