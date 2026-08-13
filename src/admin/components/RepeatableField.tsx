import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface RepeatableFieldProps<T> {
  label: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addLabel?: string;
  minItems?: number;
}

export default function RepeatableField<T>({
  label,
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel = 'Item',
  minItems = 0,
}: RepeatableFieldProps<T>) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-neutral-700">
          {label} ({items.length})
        </label>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#003DA5]/10 hover:bg-[#003DA5]/20 text-[#003DA5] text-xs font-bold rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add {addLabel}
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="relative p-4 bg-neutral-50/70 rounded-xl border border-neutral-200 group space-y-2"
          >
            <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2 mb-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                {addLabel} #{index + 1}
              </span>

              {items.length > minItems && (
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="text-neutral-400 hover:text-red-600 p-1 rounded transition-colors"
                  title={`Remove ${addLabel}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
