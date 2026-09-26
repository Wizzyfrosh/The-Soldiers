'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export interface HeroSlide {
  image: string;
  headline: string;
  subheadline: string;
  badge?: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  ctaPrimaryAction?: () => void;
  ctaSecondaryAction?: () => void;
}

export interface HeroSlideshowProps {
  slides?: HeroSlide[];
  onPlanVisit?: () => void;
  onWatchSermon?: () => void;
  onOpenPlanVisitModal?: () => void;
  onSelectSermon?: () => void;
  address?: string;
}

// Fallback slides if no CMS/database slides are provided via props
const defaultSlides: HeroSlide[] = [
  {
    image: '/images/church_welcome.jpg',
    headline: 'SOLDIERS OF JESUS CHRIST',
    subheadline: 'Equipping the saints for victorious Christian living and standing firm in faith.',
    badge: 'Welcome to Soldiers of Jesus Christ',
    ctaPrimaryText: 'Plan Your Visit',
    ctaSecondaryText: 'Watch Latest Sermon',
  },
  {
    image: '/images/worship_hero.jpg',
    headline: 'ENCOUNTER GOD’S PRESENCE',
    subheadline: 'Spirit-filled worship and heartfelt praise that ushers in healing, power, and revival.',
    badge: 'Spirit-Filled Worship',
    ctaPrimaryText: 'Plan Your Visit',
    ctaSecondaryText: 'Watch Latest Sermon',
  },
  {
    image: '/images/pastor2.jpg',
    headline: 'UNCOMPROMISED BIBLICAL TRUTH',
    subheadline: 'Practical, scripture-anchored teaching empowering you to walk in daily breakthrough.',
    badge: 'Anointed Preaching',
    ctaPrimaryText: 'Plan Your Visit',
    ctaSecondaryText: 'Watch Latest Sermon',
  },
  {
    image: '/images/outreach.jpg',
    headline: 'HANDS AND FEET OF JESUS',
    subheadline: 'Loving our city through practical compassion, community outreach, and transformative love.',
    badge: 'City Evangelism & Outreach',
    ctaPrimaryText: 'Plan Your Visit',
    ctaSecondaryText: 'Watch Latest Sermon',
  },
];

// Framer Motion Variants: Push & Exit slide animation
const imageVariants: Variants = {
  initial: {
    x: '100%',
  },
  animate: {
    x: '0%',
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    x: '-100%',
    transition: {
      duration: 1.2,
      ease: [0.7, 0, 0.84, 0],
    },
  },
};

const textVariants: Variants = {
  initial: {
    opacity: 0,
    x: -50,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: {
      duration: 1.2,
      ease: 'easeIn',
    },
  },
};

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  slides: propSlides,
  onPlanVisit,
  onWatchSermon,
  onOpenPlanVisitModal,
  onSelectSermon,
}) => {
  // Use passed slides via props (from CMS/DB) or fallback if empty
  const slides = propSlides && propSlides.length > 0 ? propSlides : defaultSlides;

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play interval: 5000ms (5s) per slide
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [currentIndex, slides.length]);

  // Guard against out-of-bounds indices if slides array changes dynamically
  const activeSlideIndex = currentIndex % slides.length;
  const currentSlide = slides[activeSlideIndex];

  const handlePrimaryClick = currentSlide.ctaPrimaryAction || onPlanVisit || onOpenPlanVisitModal;
  const handleSecondaryClick = currentSlide.ctaSecondaryAction || onWatchSermon || onSelectSermon;

  return (
    <section className="relative h-[70vh] md:h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeSlideIndex}
          className="absolute inset-0 h-full w-full overflow-hidden"
        >
          {/* Background Image with independent push & exit slide transition */}
          <motion.div
            variants={imageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 h-full w-full"
          >
            <motion.img
              src={currentSlide.image}
              alt={currentSlide.headline}
              className="absolute inset-0 w-full h-full object-cover object-[70%_center] md:object-center"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          </motion.div>

          {/* Text Content Container (Centered on Mobile with px-4, Left-Aligned on Desktop with max-w-xl) */}
          <div className="relative z-10 flex h-full w-full items-center">
            <div className="w-full px-4 sm:px-12 md:px-16 lg:px-24">
              <motion.div
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="mx-auto flex max-w-xl flex-col items-center text-center md:mx-0 md:items-start md:text-left"
              >
                {/* Optional Badge */}
                {currentSlide.badge && (
                  <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-300 backdrop-blur-md">
                    {currentSlide.badge}
                  </span>
                )}

                {/* Bold Headline */}
                <h1 className="text-4xl font-extrabold uppercase tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-lg leading-tight font-display">
                  {currentSlide.headline}
                </h1>

                {/* Subheadline */}
                <p className="mt-4 text-base font-medium text-slate-200 sm:text-lg lg:text-xl drop-shadow leading-relaxed">
                  {currentSlide.subheadline}
                </p>

                {/* Two Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handlePrimaryClick}
                    className="inline-flex items-center justify-center rounded-lg bg-gold-400 px-8 py-3.5 text-base font-bold text-navy-950 shadow-lg transition-all duration-200 hover:bg-gold-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {currentSlide.ctaPrimaryText || 'Plan Your Visit'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSecondaryClick}
                    className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-8 py-3.5 text-base font-bold text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {currentSlide.ctaSecondaryText || 'Watch Latest Sermon'}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dots at Bottom Center */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center space-x-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400 ${
                index === activeSlideIndex
                  ? 'w-8 bg-gold-400 shadow-md'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSlideshow;
