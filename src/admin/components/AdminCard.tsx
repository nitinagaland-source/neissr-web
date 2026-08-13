import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface AdminCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  href?: string;
  badge?: string;
}

export default function AdminCard({
  label,
  value,
  icon: Icon,
  color = 'bg-[#003DA5]',
  href,
  badge,
}: AdminCardProps) {
  const content = (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-all flex items-start justify-between group relative overflow-hidden">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-bold font-sans text-neutral-900 tracking-tight">
            {value}
          </p>
          {badge && (
            <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200">
              {badge}
            </span>
          )}
        </div>
      </div>

      <div
        className={`w-10 h-10 rounded-lg ${color} text-white flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform`}
      >
        <Icon className="w-5 h-5 stroke-[2]" />
      </div>
    </div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return content;
}
