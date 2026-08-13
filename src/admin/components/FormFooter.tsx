import React from 'react';
import { Loader2, Save } from 'lucide-react';

interface FormFooterProps {
  onCancel: () => void;
  saving?: boolean;
  isDirty?: boolean;
  saveLabel?: string;
}

export default function FormFooter({
  onCancel,
  saving = false,
  isDirty = false,
  saveLabel = 'Save Changes',
}: FormFooterProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 z-20 flex items-center justify-between shadow-lg -mx-6 md:-mx-8 -mb-6 md:-mb-8 mt-8">
      <div className="flex items-center gap-2">
        {isDirty ? (
          <span className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Unsaved changes
          </span>
        ) : (
          <span className="text-xs text-neutral-400 font-medium">All changes saved</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-[#C8102E] hover:bg-[#9A0C24] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? 'Saving...' : saveLabel}
        </button>
      </div>
    </div>
  );
}
