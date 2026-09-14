import React from 'react';

export interface SectionHeaderDecorProps {
  variant?: 'craft-lotus' | 'terracotta-diamond' | 'dokra-pattern' | 'artisan-badge' | 'mandala-accent' | 'minimal-chisel';
  icon?: 'craft-lotus' | 'terracotta-diamond' | 'dokra-pattern' | 'artisan-badge' | 'mandala-accent' | 'minimal-chisel';
  badge?: string;
  badgeText?: string;
  heading?: string;
  subheading?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  theme?: 'light' | 'dark';
}

export const SectionHeaderDecor: React.FC<SectionHeaderDecorProps> = ({
  variant,
  icon,
  badge,
  badgeText,
  heading,
  subheading,
  align = 'center',
  className = '',
  theme = 'light',
}) => {
  const activeVariant = icon || variant || 'terracotta-diamond';
  const effectiveBadge = badgeText || badge;
  const isDark = theme === 'dark';
  const isCenter = align === 'center';
  const isRight = align === 'right';

  const lineColor = isDark ? 'border-amber-400/40' : 'border-amber-500/30';
  const iconColor = isDark ? 'text-amber-400' : 'text-amber-600';
  const badgeBg = isDark 
    ? 'bg-amber-400/10 text-amber-300 border-amber-400/30' 
    : 'bg-amber-50 text-amber-900 border-amber-200';
  const headingColor = isDark ? 'text-white' : 'text-slate-950';
  const subColor = isDark ? 'text-slate-300' : 'text-slate-600';

  const renderMotif = () => {
    switch (activeVariant) {
      case 'craft-lotus':
        return (
          <div className={`flex items-center gap-2.5 ${isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'} w-full max-w-xs sm:max-w-sm`}>
            <div className={`h-px flex-1 border-t ${lineColor}`} />
            <svg className={`w-4 h-4 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C9 7 4 10 4 14a8 8 0 0 0 16 0c0-4-5-7-8-12z" />
              <path d="M12 22V12" />
              <path d="M7 15c2 2 5 2 5 2s3 0 5-2" />
            </svg>
            <div className={`h-px flex-1 border-t ${lineColor}`} />
          </div>
        );

      case 'dokra-pattern':
        return (
          <div className={`flex items-center gap-2 ${isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'}`}>
            <span className={`w-6 sm:w-10 h-px border-t ${lineColor}`} />
            <div className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rotate-45 border ${isDark ? 'border-amber-400 bg-amber-400/40' : 'border-amber-600 bg-amber-500'}`} />
              <span className={`w-2.5 h-2.5 rotate-45 border-2 ${isDark ? 'border-amber-300 bg-transparent' : 'border-amber-700 bg-transparent'}`} />
              <span className={`w-1.5 h-1.5 rotate-45 border ${isDark ? 'border-amber-400 bg-amber-400/40' : 'border-amber-600 bg-amber-500'}`} />
            </div>
            <span className={`w-6 sm:w-10 h-px border-t ${lineColor}`} />
          </div>
        );

      case 'artisan-badge':
        return (
          <div className={`flex items-center gap-2 ${isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'}`}>
            <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-amber-400/40' : 'bg-amber-500/50'}`} />
            <span className={`w-6 sm:w-10 h-px border-t ${lineColor}`} />
            <span className={`w-2 h-2 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} />
            <span className={`w-6 sm:w-10 h-px border-t ${lineColor}`} />
            <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-amber-400/40' : 'bg-amber-500/50'}`} />
          </div>
        );

      case 'mandala-accent':
        return (
          <div className={`flex items-center gap-2.5 ${isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'} w-full max-w-xs sm:max-w-md`}>
            <div className={`h-px flex-1 border-t ${lineColor}`} />
            <svg className={`w-5 h-5 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
              <circle cx="12" cy="12" r="4" />
              <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
            </svg>
            <div className={`h-px flex-1 border-t ${lineColor}`} />
          </div>
        );

      case 'minimal-chisel':
        return (
          <div className={`flex items-center gap-1.5 ${isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'}`}>
            <span className={`w-3.5 h-1 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} />
            <span className={`w-8 h-px ${isDark ? 'bg-amber-400/40' : 'bg-amber-600/30'}`} />
          </div>
        );

      case 'terracotta-diamond':
      default:
        return (
          <div className={`flex items-center gap-2 ${isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'}`}>
            <span className={`w-6 sm:w-12 h-px border-t ${lineColor}`} />
            <div className="flex items-center gap-1.5">
              <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-amber-400/60' : 'bg-amber-600/60'}`} />
              <svg className={`w-3.5 h-3.5 shrink-0 ${iconColor}`} viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12,2 22,12 12,22 2,12" />
              </svg>
              <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-amber-400/60' : 'bg-amber-600/60'}`} />
            </div>
            <span className={`w-6 sm:w-12 h-px border-t ${lineColor}`} />
          </div>
        );
    }
  };

  // If this is just a decorative divider line without heading
  if (!heading && !subheading) {
    return (
      <div className={`flex flex-col ${isCenter ? 'items-center justify-center' : isRight ? 'items-end' : 'items-start'} gap-1.5 mb-3 pointer-events-none select-none ${className}`}>
        {effectiveBadge && (
          <span className={`px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest rounded-full border mb-1 ${badgeBg}`}>
            {effectiveBadge}
          </span>
        )}
        {renderMotif()}
      </div>
    );
  }

  // Full section header with heading, subheading, badge, and craft motif
  return (
    <div className={`flex flex-col ${isCenter ? 'items-center text-center mx-auto max-w-3xl' : isRight ? 'items-end text-right' : 'items-start text-left max-w-3xl'} space-y-2.5 ${className}`}>
      
      {/* Badge + Motif row */}
      <div className={`flex flex-col ${isCenter ? 'items-center' : isRight ? 'items-end' : 'items-start'} gap-1.5`}>
        {effectiveBadge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-2xs">
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} />
            <span className={isDark ? 'text-amber-300' : 'text-amber-800'}>{effectiveBadge}</span>
          </div>
        )}
        {renderMotif()}
      </div>

      {/* Main Heading */}
      {heading && (
        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${headingColor} font-serif-heading tracking-tight leading-tight`}>
          {heading}
        </h2>
      )}

      {/* Subheading */}
      {subheading && (
        <p className={`text-xs sm:text-sm md:text-base ${subColor} leading-relaxed font-normal`}>
          {subheading}
        </p>
      )}
    </div>
  );
};
