import React from 'react';
import { Calendar, MapPin, Ticket, Clock, CheckCircle2 } from 'lucide-react';
import { ChurchEvent } from '../../types';

interface EventCardProps {
  event: ChurchEvent;
  isPast?: boolean;
  onSelectEvent?: (event: ChurchEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isPast = false, onSelectEvent }) => {
  const isEventPast = isPast || (event.endDate ? new Date(event.endDate) < new Date() : false);

  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 flex flex-col md:flex-row h-full group ${
        isEventPast
          ? 'border-slate-200 shadow-md hover:border-slate-300 bg-slate-50/50'
          : 'border-slate-200 shadow-xl hover:border-gold-500 hover:shadow-2xl'
      }`}
    >
      {/* Event Image Container */}
      <div className="md:w-5/12 relative h-56 md:h-auto overflow-hidden bg-slate-900">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800'}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isEventPast
              ? 'grayscale opacity-70 group-hover:scale-100'
              : 'group-hover:scale-105'
          }`}
        />
        
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-navy-950/90 backdrop-blur-md text-gold-400 font-black text-[10px] uppercase px-3 py-1 rounded-full border border-gold-500/30 shadow-md">
          {event.category}
        </span>

        {/* PAST EVENT Badge (Top-Right) */}
        {isEventPast && (
          <span className="absolute top-3 right-3 bg-slate-900/95 text-slate-300 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700 shadow-lg flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-slate-400" /> PAST EVENT
          </span>
        )}
      </div>

      {/* Event Info Content */}
      <div className="md:w-7/12 p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Date & Time */}
          <div className={`flex items-center gap-2 font-bold text-xs ${isEventPast ? 'text-slate-500' : 'text-gold-600'}`}>
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>{event.date}</span>
            {event.time && <span className="text-slate-400">• {event.time}</span>}
          </div>

          {/* Title */}
          <h3 className={`text-xl font-black uppercase font-display transition-colors line-clamp-2 ${
            isEventPast ? 'text-slate-600 group-hover:text-slate-800' : 'text-navy-950 group-hover:text-gold-600'
          }`}>
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Description */}
          <p className={`text-xs leading-relaxed line-clamp-3 ${isEventPast ? 'text-slate-500' : 'text-slate-600'}`}>
            {event.description}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500">
            {event.registrationsCount} Attending
          </span>

          {isEventPast ? (
            <button
              onClick={() => onSelectEvent?.(event)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              View Details
            </button>
          ) : (
            <button
              onClick={() => onSelectEvent?.(event)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-navy-950 bg-gold-400 hover:bg-gold-500 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Ticket className="w-3.5 h-3.5" />
              RSVP / Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
