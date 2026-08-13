import React from 'react';

export default function AdminPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-2">
      {/* Page Header Skeleton */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="space-y-2">
          <div className="h-6 bg-neutral-200 rounded-md w-48" />
          <div className="h-3 bg-neutral-200 rounded-md w-64" />
        </div>
        <div className="h-9 bg-neutral-200 rounded-lg w-32" />
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-neutral-200 rounded-xl" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
        <div className="h-5 bg-neutral-200 rounded w-1/4" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-neutral-100 rounded-lg w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
