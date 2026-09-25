import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { store } from '../data/store';
import { ChurchEvent } from '../types';
import { Button } from '../components/common/Button';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/common/Animations';

interface EventsProps {
  onSelectEvent: (event: ChurchEvent) => void;
}

export const Events: React.FC<EventsProps> = ({ onSelectEvent }) => {
  const [events, setEvents] = useState<ChurchEvent[]>(store.getEvents());
  const [filterCat, setFilterCat] = useState<string>('All');

  useEffect(() => {
    store.syncWithBackend();
    const unsubscribe = store.subscribe(() => {
      setEvents(store.getEvents());
    });
    return unsubscribe;
  }, []);

  const categories = ['All', 'Worship', 'Youth', 'Men', 'Women', 'Community', 'Conference'];

  const filteredEvents = events.filter(e => filterCat === 'All' || e.category === filterCat);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">CHURCH CALENDAR</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Upcoming Events & Gatherings</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Connect, grow, and build genuine community with us.
          </p>
        </FadeIn>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <FadeIn delay={0.1}>
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
        </FadeIn>

        {/* Event Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <Calendar className="w-12 h-12 text-gold-500 mx-auto mb-3 opacity-60" />
              <h3 className="text-xl font-bold uppercase font-display text-navy-950">No Events Scheduled</h3>
              <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
                There are currently no events listed under this category. Please check back soon or explore other categories.
              </p>
            </div>
          ) : (
            filteredEvents.map((ev) => (
              <StaggerItem key={ev.id}>
                <div className="bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xl flex flex-col md:flex-row group hover:border-gold-500 transition-all h-full">
                  <div className="md:w-5/12 relative h-56 md:h-auto overflow-hidden">
                    <img src={ev.image || '/images/worship_hero.jpg'} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-3 left-3 bg-navy-950 text-gold-400 font-black text-[10px] uppercase px-2.5 py-1 rounded shadow">
                      {ev.category}
                    </span>
                  </div>

                  <div className="md:w-7/12 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gold-600 font-bold text-xs">
                        <Calendar className="w-4 h-4" /> {ev.date} ({ev.time})
                      </div>
                      <h3 className="text-xl font-black uppercase font-display text-navy-950 group-hover:text-gold-600 transition-colors">
                        {ev.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ev.location}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{ev.description}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">
                        {ev.registrationsCount} Attending
                      </span>
                      <Button
                        variant="gold"
                        size="sm"
                        onClick={() => onSelectEvent(ev)}
                        icon={<Ticket className="w-3.5 h-3.5" />}
                      >
                        RSVP / Register
                      </Button>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))
          )}
        </StaggerContainer>
      </section>

    </div>
  );
};
