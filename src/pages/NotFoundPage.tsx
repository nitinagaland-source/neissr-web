import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#FAF9F7] px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 p-8 text-center space-y-6 shadow-md">
        <div className="w-16 h-16 rounded-full bg-[#003DA5]/10 text-[#003DA5] flex items-center justify-center mx-auto text-2xl font-bold font-serif">
          404
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-neutral-900">
            Page Not Found
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed">
            The page or document you are looking for may have been moved, renamed, or is currently undergoing administrative updates.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-[#003DA5] hover:bg-[#002B75] text-white px-6 py-2.5 rounded-full text-xs font-bold transition-all"
          >
            <Home className="w-4 h-4" /> Go to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-6 py-2.5 rounded-full text-xs font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
