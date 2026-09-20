import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'navy' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'gold',
  size = 'md',
  icon,
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider font-display';

  const variantStyles = {
    gold: 'bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold shadow-gold hover:shadow-lg focus:ring-gold-500 border border-gold-400',
    navy: 'bg-navy-900 hover:bg-navy-800 text-white shadow-navy focus:ring-navy-900 border border-navy-700',
    outline: 'bg-transparent hover:bg-white/10 text-white border-2 border-white hover:border-gold-400 hover:text-gold-400 focus:ring-white',
    ghost: 'bg-transparent hover:bg-slate-200/50 text-navy-900 hover:text-gold-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-md focus:ring-red-500'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5 font-extrabold'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
