import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  centered = true,
  dark = false
}) => {
  return (
    <div className={`mb-10 ${centered ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'}`}>
      {badge && (
        <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-widest bg-gold-500/20 text-gold-600 rounded-full mb-3 border border-gold-500/30">
          {badge}
        </span>
      )}
      <h2 className={`text-3xl md:text-5xl font-extrabold uppercase font-display tracking-tight ${dark ? 'text-white' : 'text-navy-950'}`}>
        {title}
      </h2>
      <div className={`h-1.5 w-20 bg-gold-500 mt-4 rounded-full ${centered ? 'mx-auto' : ''}`}></div>
      {subtitle && (
        <p className={`mt-4 text-base md:text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};
