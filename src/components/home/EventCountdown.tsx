import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChurchEvent, CountdownEvent } from '../../types';

export interface EventCountdownProps {
  events?: ChurchEvent[];
  event?: ChurchEvent | CountdownEvent | null;
  onSelectEvent?: (event: ChurchEvent) => void;
  isLoading?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  mins: number;
  secs: number;
}

const getTimeLeft = (targetDate: string, targetTime?: string): TimeLeft => {
  try {
    let dateObj: Date;
    // Attempt to combine date and time if available
    if (targetTime && /^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
      const timeMatch = targetTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1], 10);
        const minute = parseInt(timeMatch[2], 10);
        const isPM = timeMatch[3].toUpperCase() === 'PM';
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        const [year, month, day] = targetDate.split('-').map(Number);
        dateObj = new Date(year, month - 1, day, hour, minute);
      } else {
        dateObj = new Date(`${targetDate}T09:00:00`);
      }
    } else {
      dateObj = new Date(targetDate);
    }

    const diff = dateObj.getTime() - Date.now();
    if (isNaN(diff) || diff <= 0) {
      return { days: 0, hours: 0, mins: 0, secs: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      mins: Math.floor((diff / (1000 * 60)) % 60),
      secs: Math.floor((diff / 1000) % 60),
    };
  } catch {
    return { days: 0, hours: 0, mins: 0, secs: 0 };
  }
};

const parseEventDate = (dateStr: string) => {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = d.getDate();
      const month = d.toLocaleString('en-US', { month: 'long' });
      const monthShort = d.toLocaleString('en-US', { month: 'short' });
      const year = d.getFullYear();
      return { day: String(day), month, monthShort, year: String(year) };
    }
  } catch {}

  // Fallback regex parsing (e.g. "2026-10-03")
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = parseInt(parts[2], 10);
    return {
      day: String(day),
      month: months[monthIndex] || 'October',
      monthShort: monthsShort[monthIndex] || 'Oct',
      year
    };
  }

  return { day: '03', month: 'October', monthShort: 'Oct', year: '2026' };
};

export const EventCountdown: React.FC<EventCountdownProps> = ({
  events = [],
  event: singleEvent,
  onSelectEvent,
  isLoading = false
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Determine active event
  const currentEvent: ChurchEvent | CountdownEvent | null =
    events.length > 0 ? events[activeIndex % events.length] : (singleEvent || null);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    if (!currentEvent) return { days: 0, hours: 0, mins: 0, secs: 0 };
    const timeVal = 'time' in currentEvent ? currentEvent.time : undefined;
    return getTimeLeft(currentEvent.date, timeVal);
  });

  useEffect(() => {
    if (!currentEvent) return;
    const timeVal = 'time' in currentEvent ? currentEvent.time : undefined;
    setTimeLeft(getTimeLeft(currentEvent.date, timeVal));

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(currentEvent.date, timeVal));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentEvent]);

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-[#1c1d22] rounded-3xl p-8 sm:p-12 animate-pulse min-h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-slate-500">
            <Calendar className="w-8 h-8 animate-spin text-gold-500" />
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Loading Upcoming Church Events...</span>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!currentEvent) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-[#1c1d22] rounded-3xl p-8 sm:p-12 text-center text-white border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded-full text-[11px] font-black uppercase tracking-widest">
              CHURCH CALENDAR
            </span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Stay Tuned For Upcoming Gatherings
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              We are currently preparing our next church-wide conferences, revival nights, and community outreaches. Check back soon or join us for our regular weekend worship services!
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Link
                to="/events"
                className="px-6 py-2.5 bg-gold-500 text-navy-950 font-bold uppercase text-xs rounded-xl hover:bg-gold-400 transition-all shadow-md"
              >
                Browse All Gatherings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { day, month, monthShort, year } = parseEventDate(currentEvent.date);
  const eventTime = 'time' in currentEvent && currentEvent.time ? currentEvent.time : '8:00 AM - 12:00 PM';
  const eventImage = 'image' in currentEvent ? currentEvent.image : undefined;

  const handleNext = () => {
    if (events.length > 1) {
      setActiveIndex((prev) => (prev + 1) % events.length);
    }
  };

  const handlePrev = () => {
    if (events.length > 1) {
      setActiveIndex((prev) => (prev - 1 + events.length) % events.length);
    }
  };

  const handleOpenDetail = () => {
    if (onSelectEvent && 'category' in currentEvent) {
      onSelectEvent(currentEvent as ChurchEvent);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
    >
      {/* Main Card Container — Deep Charcoal / Black matching uploaded image */}
      <div className="bg-[#1b1c21] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/5 relative overflow-hidden">
        
        {/* Top Header Row: Title & Subtitle on Left, Countdown on Right */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/10">
          
          {/* Top Left: Next Upcoming Event (Serif Style) */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-serif italic font-normal text-2xl sm:text-3xl text-white/80 tracking-tight">
                Next
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
                Upcoming Event
              </h2>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm font-sans tracking-wide">
              Local Date: {monthShort} {day} {year} <span className="text-white/30 mx-1.5">|</span> Local Time: {eventTime}
            </p>
          </div>

          {/* Top Right: Countdown Timer (DAYS, HOURS, MINUTES, SECONDS) */}
          <div className="flex items-center gap-6 sm:gap-8 self-start sm:self-auto">
            <div className="flex items-center gap-4 sm:gap-6">
              
              {/* Days */}
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tabular-nums tracking-tight">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-slate-400 mt-1">
                  DAYS
                </span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tabular-nums tracking-tight">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-slate-400 mt-1">
                  HOURS
                </span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tabular-nums tracking-tight">
                  {timeLeft.mins}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-slate-400 mt-1">
                  MINUTES
                </span>
              </div>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tabular-nums tracking-tight">
                  {timeLeft.secs}
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-slate-400 mt-1">
                  SECONDS
                </span>
              </div>

            </div>

            {/* Event Navigation Arrows (if multiple events exist in DB) */}
            {events.length > 1 && (
              <div className="hidden sm:flex items-center gap-1.5 pl-4 border-l border-white/10">
                <button
                  onClick={handlePrev}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="Previous Event"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-400 font-mono px-1">
                  {activeIndex + 1}/{events.length}
                </span>
                <button
                  onClick={handleNext}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  title="Next Event"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Main Body Section: Ribbon Badge + Event Title/Link on Left, Flyer Poster on Right */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Middle Left: Ribbon Bookmark Badge & Event Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:max-w-2xl relative">
            
            {/* Blue Ribbon / Bookmark Badge (exact 3D ribbon fold as in screenshot) */}
            <div className="relative shrink-0">
              <div className="bg-[#2563eb] text-white px-5 py-4 rounded-r-xl shadow-lg flex items-center gap-3.5 relative z-10 -ml-6 sm:-ml-8 lg:-ml-10">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none font-sans">
                  {day}
                </span>
                <div className="flex flex-col text-left font-bold text-xs sm:text-sm leading-tight">
                  <span className="text-white uppercase font-sans tracking-wide">{month}</span>
                  <span className="text-white/80 text-[11px] sm:text-xs font-normal font-mono">{year}</span>
                </div>
              </div>
              {/* Fold ribbon corner underneath on bottom-left for realistic 3D appearance */}
              <div className="absolute -bottom-2.5 left-0 w-0 h-0 border-t-[10px] border-t-blue-950 border-l-[10px] border-l-transparent z-0 -ml-6 sm:-ml-8 lg:-ml-10" />
            </div>

            {/* Event Title & "— EVENT DETAIL" Link */}
            <div className="space-y-3 flex-1">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-white leading-snug font-sans">
                {currentEvent.title}
              </h3>

              <div>
                {'category' in currentEvent && onSelectEvent ? (
                  <button
                    onClick={handleOpenDetail}
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300 hover:text-gold-400 transition-colors pt-1 cursor-pointer"
                  >
                    <span>— EVENT DETAIL</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                ) : (
                  <Link
                    to="/events"
                    className="group inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-300 hover:text-gold-400 transition-colors pt-1"
                  >
                    <span>— EVENT DETAIL</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                )}
              </div>
            </div>

          </div>

          {/* Right Side: Event Flyer / Poster Image Display */}
          <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-[340px] sm:max-w-[380px] h-[260px] sm:h-[300px] lg:h-[320px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-navy-950">
              {eventImage ? (
                <img
                  src={eventImage}
                  alt={currentEvent.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                /* Elegant anointed fallback poster matching church aesthetic */
                <div className="w-full h-full bg-gradient-to-br from-navy-900 via-navy-950 to-black p-6 flex flex-col justify-between text-center relative border border-gold-500/20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="space-y-1 z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gold-400 bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/20 inline-block">
                      SOLDIERS OF JESUS CHRIST
                    </span>
                    <h4 className="text-lg font-black font-display uppercase text-white mt-2 leading-tight">
                      {currentEvent.title}
                    </h4>
                  </div>

                  <div className="my-auto py-2 z-10">
                    <Sparkles className="w-8 h-8 text-gold-400 mx-auto opacity-70 animate-pulse" />
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 font-sans z-10 border-t border-white/10 pt-3">
                    <div className="text-gold-400 font-bold">{monthShort} {day}, {year}</div>
                    <div className="text-slate-400 text-[11px]">{eventTime}</div>
                  </div>
                </div>
              )}

              {/* Category pill on image */}
              {'category' in currentEvent && (
                <div className="absolute top-3 right-3 bg-navy-950/80 backdrop-blur-md text-gold-400 font-black text-[10px] uppercase px-2.5 py-1 rounded-lg border border-gold-500/30 shadow-md">
                  {currentEvent.category}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Mobile event switcher if multiple events */}
        {events.length > 1 && (
          <div className="sm:hidden mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-white flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </button>
            <span className="text-xs text-slate-400 font-mono">
              Event {activeIndex + 1} of {events.length}
            </span>
            <button
              onClick={handleNext}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-white flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
};
