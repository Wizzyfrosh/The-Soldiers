'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, History, Sparkles } from 'lucide-react';
import { EventsTabs, EventTabType } from '../../components/EventsTabs';
import { EventCard } from '../../components/EventCard';
import { ChurchEvent } from '../../src/types';

export default function EventsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tabParam = (searchParams.get('tab') as EventTabType) || 'upcoming';
  const [activeTab, setActiveTab] = useState<EventTabType>(tabParam === 'past' ? 'past' : 'upcoming');
  const [filterCat, setFilterCat] = useState<string>('All');
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync tab with URL
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'past' || tabFromUrl === 'upcoming') {
      setActiveTab(tabFromUrl as EventTabType);
    }
  }, [searchParams]);

  const handleTabChange = (tab: EventTabType) => {
    setActiveTab(tab);
    router.push(`/events?tab=${tab}`);
  };

  // Fetch events based on active tab
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/events?tab=${activeTab}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.events) {
          setEvents(data.events);
        }
      })
      .catch((err) => console.error('Error fetching events:', err))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const categories = ['All', 'Worship', 'Youth', 'Men', 'Women', 'Community', 'Conference'];

  const filteredEvents = events.filter((ev) => filterCat === 'All' || ev.category === filterCat);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-gold-400" /> CHURCH CALENDAR & ARCHIVE
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-white">
            {activeTab === 'upcoming' ? 'Upcoming Events & Gatherings' : 'Past Events & Fellowship Archive'}
          </h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            {activeTab === 'upcoming'
              ? 'Connect, grow, and build genuine community with us.'
              : 'Look back at God’s powerful moves, past conferences, and community gatherings.'}
          </p>

          {/* Interactive Framer Motion Tabs */}
          <EventsTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </section>

      {/* Main Container */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-5 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all border ${
                filterCat === cat
                  ? 'bg-navy-900 text-gold-400 border-gold-500 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Animated Event Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6"
          >
            {isLoading ? (
              <div className="col-span-full py-20 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-slate-500 text-sm font-semibold">Loading church events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                {activeTab === 'upcoming' ? (
                  <Calendar className="w-12 h-12 text-gold-500 mx-auto mb-3 opacity-60" />
                ) : (
                  <History className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-60" />
                )}
                <h3 className="text-xl font-bold uppercase font-display text-navy-950">
                  {activeTab === 'upcoming' ? 'No Upcoming Events Scheduled' : 'No Past Events Found'}
                </h3>
                <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
                  {activeTab === 'upcoming'
                    ? 'There are currently no upcoming events under this category. Check back soon for new announcements!'
                    : 'No past events match your selected category filter in the historical archive.'}
                </p>
              </div>
            ) : (
              filteredEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  isPast={activeTab === 'past'}
                  onSelectEvent={(event) => router.push(`/events/${event.id}`)}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
