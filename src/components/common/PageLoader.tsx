import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageLoaderProps {
  duration?: number;
}

/**
 * Global PageLoader: A sleek, professional spinner that displays briefly
 * during initial page load and then smoothly fades out.
 */
export const PageLoader: React.FC<PageLoaderProps> = ({ duration = 8000 }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="global-page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy-950/98 backdrop-blur-md pointer-events-none select-none"
        >
          {/* Professional Dual-Ring Glowing Spinner */}
          <div className="relative flex items-center justify-center">
            {/* Outer Ambient Glow */}
            <div className="absolute w-28 h-28 rounded-full bg-gold-500/20 blur-2xl animate-pulse" />

            {/* Base Background Track Ring */}
            <div className="w-20 h-20 rounded-full border-2 border-navy-800" />

            {/* Primary Spinning Gold Gradient Arc */}
            <div className="absolute w-20 h-20 rounded-full border-2 border-transparent border-t-gold-500 border-r-gold-400 animate-spin" />

            {/* Secondary Inner Reverse-Spinning Accent Ring */}
            <div
              className="absolute w-12 h-12 rounded-full border-2 border-transparent border-b-gold-400/80 border-l-gold-500/60 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.2s' }}
            />

            {/* Center Radiant Core */}
            <div className="absolute w-3 h-3 rounded-full bg-gold-400 shadow-[0_0_15px_#F5A623]" />
          </div>

          {/* Branding & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 flex flex-col items-center text-center px-4"
          >
            <span className="text-xs font-black uppercase tracking-[0.3em] text-gold-400 font-display">
              Soldiers of Jesus Christ
            </span>
            <span className="text-[11px] text-slate-400 mt-1.5 tracking-wider font-medium">
              Equipping the Saints &bull; Preparing Your Experience
            </span>

            {/* Subtle Sleek 8-second Progress Bar */}
            <div className="w-48 h-1 bg-navy-800/80 rounded-full overflow-hidden mt-4 border border-navy-700/50">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-300 rounded-full shadow-[0_0_8px_rgba(245,166,35,0.6)]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Reusable Standalone Professional Spinner Component
 */
export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <div className={`${sizeMap[size]} rounded-full border-gold-500/20`} />
      <div className={`absolute ${sizeMap[size]} rounded-full border-transparent border-t-gold-500 border-r-gold-400 animate-spin`} />
    </div>
  );
};

export default PageLoader;
