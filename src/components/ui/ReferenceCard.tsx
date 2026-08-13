import React from 'react';
import { Link } from 'react-router-dom';

export interface ReferenceCardProps {
  key?: string | number;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  gradient?: 'blue' | 'purple' | 'pink' | 'emerald' | 'amber' | 'indigo' | 'navy' | 'crimson';
  customGradient?: string;
  children?: React.ReactNode;
  buttonText?: string;
  buttonLink?: string;
  onButtonClick?: () => void;
  className?: string;
  badge?: string;
  date?: string;
}

const GRADIENTS = {
  blue: 'from-[#3B82F6] via-[#60A5FA] to-[#38BDF8]',
  purple: 'from-[#8B5CF6] via-[#A855F7] to-[#C084FC]',
  pink: 'from-[#EC4899] via-[#F43F5E] to-[#FB7185]',
  emerald: 'from-[#10B981] via-[#34D399] to-[#06B6D4]',
  amber: 'from-[#F59E0B] via-[#FBBF24] to-[#F97316]',
  indigo: 'from-[#6366F1] via-[#818CF8] to-[#3B82F6]',
  navy: 'from-[#003DA5] via-[#1E40AF] to-[#3B82F6]',
  crimson: 'from-[#C8102E] via-[#E11D48] to-[#F43F5E]'
};

const GLOW_SHADOWS = {
  blue: 'shadow-[0_15px_30px_rgba(59,130,246,0.22)] hover:shadow-[0_22px_45px_rgba(59,130,246,0.35)]',
  purple: 'shadow-[0_15px_30px_rgba(139,92,246,0.22)] hover:shadow-[0_22px_45px_rgba(139,92,246,0.35)]',
  pink: 'shadow-[0_15px_30px_rgba(236,72,153,0.22)] hover:shadow-[0_22px_45px_rgba(236,72,153,0.35)]',
  emerald: 'shadow-[0_15px_30px_rgba(16,185,129,0.22)] hover:shadow-[0_22px_45px_rgba(16,185,129,0.35)]',
  amber: 'shadow-[0_15px_30px_rgba(245,158,11,0.22)] hover:shadow-[0_22px_45px_rgba(245,158,11,0.35)]',
  indigo: 'shadow-[0_15px_30px_rgba(99,102,241,0.22)] hover:shadow-[0_22px_45px_rgba(99,102,241,0.35)]',
  navy: 'shadow-[0_15px_30px_rgba(0,61,165,0.22)] hover:shadow-[0_22px_45px_rgba(0,61,165,0.35)]',
  crimson: 'shadow-[0_15px_30px_rgba(200,16,46,0.22)] hover:shadow-[0_22px_45px_rgba(200,16,46,0.35)]'
};

export default function ReferenceCard({
  title,
  subtitle,
  icon,
  gradient = 'blue',
  customGradient,
  children,
  buttonText,
  buttonLink,
  onButtonClick,
  className = '',
  badge,
  date
}: ReferenceCardProps) {
  const gradientClass = customGradient || GRADIENTS[gradient] || GRADIENTS.blue;
  const glowClass = GLOW_SHADOWS[gradient] || GLOW_SHADOWS.blue;

  const renderButton = () => {
    if (!buttonText) return null;

    const btnClasses =
      'inline-flex items-center justify-center bg-white text-neutral-800 shadow-md hover:shadow-xl border border-neutral-100 rounded-full px-8 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 hover:bg-[#003DA5] hover:text-white cursor-pointer';

    if (buttonLink) {
      return (
        <Link to={buttonLink} className={btnClasses}>
          {buttonText}
        </Link>
      );
    }

    return (
      <button onClick={onButtonClick} className={btnClasses}>
        {buttonText}
      </button>
    );
  };

  return (
    <div
      className={`relative group flex flex-col justify-between bg-white rounded-3xl overflow-hidden border border-neutral-100/60 transition-all duration-300 hover:-translate-y-2 ${glowClass} ${className}`}
    >
      {/* Top Header Section with Organic Gradient */}
      <div
        className={`relative pt-8 pb-14 px-6 text-center text-white bg-gradient-to-br ${gradientClass} overflow-hidden`}
      >
        {/* Badge or Date Tag Header Bar */}
        {(badge || date) && (
          <div className="flex items-center justify-between gap-2 text-[10px] font-bold tracking-wider uppercase mb-3 text-white/95">
            {badge && (
              <span className="bg-white/25 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/30 shadow-sm">
                {badge}
              </span>
            )}
            {date && <span className="ml-auto text-white/90 font-medium">{date}</span>}
          </div>
        )}

        {/* Card Title */}
        <h3 className="font-sans font-bold text-2xl tracking-tight text-white drop-shadow-sm">
          {title}
        </h3>

        {subtitle && (
          <p className="text-xs text-white/85 mt-1 font-light tracking-wide max-w-xs mx-auto">
            {subtitle}
          </p>
        )}

        {/* Organic Wave Divider SVG (Double layer) */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none">
          <svg
            className="relative block w-full h-10 text-white fill-current"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,120 L0,120 Z"
              opacity="0.3"
            ></path>
            <path d="M0,30 C200,85 400,15 600,65 C800,115 1000,35 1200,55 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      {/* White Card Body */}
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between text-center space-y-6 bg-white">
        <div className="text-neutral-600 text-xs md:text-sm leading-relaxed space-y-2">
          {children}
        </div>

        {/* Bottom Floating Pill Button */}
        {buttonText && <div className="pt-2 flex justify-center">{renderButton()}</div>}
      </div>
    </div>
  );
}
