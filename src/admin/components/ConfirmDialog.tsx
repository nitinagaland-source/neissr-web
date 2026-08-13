import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, Loader2, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  dangerous?: boolean;
  confirmLabel?: string;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  loading = false,
  dangerous = true,
  confirmLabel = 'Delete',
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(val) => !val && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl z-50 border border-neutral-200 space-y-4 animate-in zoom-in-95 duration-200 focus:outline-none">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  dangerous ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-[#003DA5]'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <Dialog.Title className="text-lg font-bold text-neutral-900 font-sans">
                {title}
              </Dialog.Title>
            </div>
            <button
              onClick={onCancel}
              disabled={loading}
              className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Dialog.Description className="text-sm text-neutral-600 leading-relaxed">
            {description}
          </Dialog.Description>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-colors disabled:opacity-50 ${
                dangerous
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#003DA5] hover:bg-[#002B75]'
              }`}
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {loading ? 'Deleting...' : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
