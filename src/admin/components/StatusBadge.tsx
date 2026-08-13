import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = (status || '').toLowerCase();

  let styles = 'bg-neutral-100 text-neutral-600 border-neutral-200';
  let label = status;

  if (normalized === 'published' || normalized === 'active') {
    styles = 'bg-green-50 text-green-700 border-green-200';
    label = 'Published';
  } else if (normalized === 'draft') {
    styles = 'bg-neutral-100 text-neutral-600 border-neutral-200';
    label = 'Draft';
  } else if (normalized === 'new') {
    styles = 'bg-blue-50 text-[#003DA5] border-blue-200 font-bold';
    label = 'New';
  } else if (normalized === 'read') {
    styles = 'bg-neutral-100 text-neutral-500 border-neutral-200';
    label = 'Read';
  } else if (normalized === 'disabled') {
    styles = 'bg-red-50 text-red-600 border-red-200';
    label = 'Disabled';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styles}`}
    >
      {label}
    </span>
  );
}
