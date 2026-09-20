import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Sparkles, Shield, ChevronDown, Calendar } from 'lucide-react';
import { Button } from '../common/Button';

interface Slide {
  id: number;
  image: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  serviceBadge: string;
}

interface HeroSlideshowProps {
  onOpenPlanVisitModal: () => void;
  onSelectSermon: () => void;
  address?: string;
}

export const HeroSlideshow: React.FC<HeroSlideshowProps> = ({
  onOpenPlanVisitModal,
  onSelectSermon,
  address = '1709 John Barrow Rd, Little Rock, AR 72204'
}) => {
  const slides: Slide[] = [
    {
      id: 0,
      image: '/images/church_welcome.jpg',
      tag: 'Welcome to Soldiers of Jesus Christ',
      title: 'A Church You Can Call Home',
      subtitle: 'Equipping the saints for victorious Christian living',
      description: 'Step into a warm, welcoming community standing firm in Christ. Experience authentic faith, genuine brotherhood, and a place where your whole family can thrive.',
      serviceBadge: `Saturdays: 7th Day Sabbath Worship (Holy Ghost Power & Miracles) • ${address}`
    },
    {
      id: 1,
      image: '/images/worship_celebration.jpg',
      tag: 'Spirit-Filled Worship & Revival',
      title: 'Encounter God’s Presence',
      subtitle: '“In His presence is fullness of joy.” — Psalm 16:11',
      description: 'Join us for heartfelt praise and worship that ushers in the tangible presence, healing, and peace of God.',
      serviceBadge: 'Saturday Sabbath Services & Sunday Activities as Advertised'
    },
    {
      id: 2,
      image: '/images/pastor.jpg',
      tag: 'Anointed Preaching & Leadership',
      title: 'Uncompromised Biblical Truth',
      subtitle: '“Preach the Word; be ready in season and out.” — 2 Timothy 4:2',
      description: 'Practical, scripture-anchored sermons by Pastor David & Sarah Vance that empower your faith and equip you to walk in daily breakthrough.',
      serviceBadge: 'Midweek Bible Study & Prayer: Wednesdays at 7:00 PM'
    },
    {
      id: 3,
      image: '/images/outreach.jpg',
      tag: 'City Evangelism & Compassion',
      title: 'Hands and Feet of Jesus',
      subtitle: 'Loving our city through practical compassion and service',
      description: 'Reaching beyond the church walls to feed families, pray with the hurting, and bring the transformational love of Christ to our community.',
      serviceBadge: 'Community Food Pantry & Outreach: Saturdays at 10:00 AM'
    },
    {
      id: 4,
      image: '/images/youth.jpg',
      tag: 'Next Generation Revival',
      title: 'Raising Up A Godly Generation',
      subtitle: '“Let no one despise your youth, but be an example.” — 1 Timothy 4:12',
      description: 'Empowering teens and young adults to stand bold in culture, discover their divine purpose, and build lasting Christian friendships.',
      serviceBadge: 'IGNITE Youth Fellowship: Wednesdays at 6:30 PM'
    },
    {
      id: 5,
      image: '/images/mens.jpg',
      tag: 'Brotherhood & Sisterhood',
      title: 'Discipleship for Victorious Living',
      subtitle: '“As iron sharpens iron, so one person sharpens another.” — Proverbs 27:17',
      description: 'Strong, biblically grounded mentorship for men, women, and marriages designed to forge resilient disciples for this generation.',
      serviceBadge: 'Monthly Men’s & Women’s Fellowships'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const slideDuration = 5500; // 5.5 seconds per slide

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  // Continuous Automatic Slideshow Loop
  useEffect(() => {
    const intervalTime = 50;
    const step = (intervalTime / slideDuration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [nextSlide]);

  const current = slides[currentIndex];

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('ticker-banner');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: 600, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero-slideshow-section"
      className="relative min-h-[85vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden pt-8 pb-16 bg-navy-950"
    >
      {/* Background Slideshow Image Layer with Subtle Dark Gradient Overlay Only on Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Subtle dark gradient overlay applied only to image layer for maximum readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
      </div>

      {/* Auto-play Timer Progress Line along top */}
      <div className="absolute top-0 inset-x-0 h-1 bg-white/15 z-30">
        <div
          className="h-full bg-gold-400 transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content Container on the Left with Transparent Background and No Border */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-full max-w-md lg:max-w-xl text-left bg-transparent border-none p-0 space-y-4"
        >
          {/* Subtle Tag Badge */}
          <motion.div
            key={`tag-${current.id}`}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border border-gold-400/40 text-gold-300 text-[11px] font-bold uppercase tracking-wider drop-shadow-xl"
          >
            <Shield className="w-3.5 h-3.5 text-gold-400" />
            <span>{current.tag}</span>
          </motion.div>

          {/* Main Slide Title with drop-shadow-xl */}
          <div className="min-h-[48px] sm:min-h-[60px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${current.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-xl"
              >
                {current.title}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Elegant Subtitle with drop-shadow-xl */}
          <div className="min-h-[26px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${current.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="text-sm sm:text-base text-gold-300 font-medium italic drop-shadow-xl"
              >
                {current.subtitle}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Description with drop-shadow-xl */}
          <div className="min-h-[42px] sm:min-h-[48px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${current.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-xs sm:text-sm text-slate-100 leading-relaxed font-normal drop-shadow-xl"
              >
                {current.description}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Service Time & Location Information with drop-shadow-xl */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge-${current.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="pt-1 flex items-center gap-2 text-xs text-slate-200 font-medium drop-shadow-xl"
            >
              <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="line-clamp-1">{current.serviceBadge}</span>
            </motion.div>
          </AnimatePresence>

          {/* Action Call to Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 drop-shadow-xl">
            <Button
              variant="gold"
              size="sm"
              onClick={onOpenPlanVisitModal}
              icon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Plan Your Visit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectSermon}
              icon={<Play className="w-3.5 h-3.5 fill-white" />}
            >
              Watch Sermons
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Sleek, Minimalist Left/Right Controls */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md shadow-lg flex items-center justify-center transition-all hover:scale-105"
      >
        <ChevronLeft className="w-5 h-5 text-slate-200" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 backdrop-blur-md shadow-lg flex items-center justify-center transition-all hover:scale-105"
      >
        <ChevronRight className="w-5 h-5 text-slate-200" />
      </button>

      {/* Elegant Bottom Dot Indicators */}
      <div className="absolute bottom-4 inset-x-0 z-30 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentIndex(idx);
                setProgress(0);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 rounded-full ${
                currentIndex === idx
                  ? 'w-6 h-1.5 bg-gold-400'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white'
              }`}
            />
          ))}
        </div>

        {/* Scroll Down Trigger */}
        <button
          onClick={scrollToNextSection}
          className="text-slate-300 hover:text-gold-400 flex items-center gap-1 text-[11px] font-medium tracking-wide transition-colors drop-shadow"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="w-3.5 h-3.5 text-gold-400 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
