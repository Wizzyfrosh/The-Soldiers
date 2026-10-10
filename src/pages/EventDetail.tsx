import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket, Clock, AlertCircle, ArrowLeft, Users } from 'lucide-react';
import { store } from '../data/store';
import { ChurchEvent } from '../types';

interface EventDetailProps {
  onSelectEvent?: (event: ChurchEvent) => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({ onSelectEvent }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<ChurchEvent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setIsLoading(true);

    store.syncWithBackend().then(() => {
      const allEvents = store.getEvents();
      const found = allEvents.find((e) => e.id === id);

      if (isMounted) {
        // Return 404 only for events that don't exist or have status === "DRAFT"
        if (!found || found.status === 'DRAFT') {
          setIsNotFound(true);
        } else {
          setEvent(found);
        }
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin w-10 h-10 border-4 border-gold-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-slate-400 text-sm font-semibold">Retrieving event details...</p>
        </div>
      </div>
    );
  }

  if (isNotFound || !event) {
    return (
      <div className="min-h-screen bg-navy-950 text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-900/80 border border-slate-800 p-8 rounded-3xl text-center shadow-2xl backdrop-blur-md">
          <AlertCircle className="w-16 h-16 text-gold-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black uppercase font-display text-white mb-2">Event Not Found</h1>
          <p className="text-slate-400 text-xs mb-6">
            The event you are looking for does not exist, has been draft-restricted, or was removed.
          </p>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-400 text-navy-950 font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-gold-500 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Events
          </button>
        </div>
      </div>
    );
  }

  // Determine if event has ended
  const now = new Date();
  const endDateObj = event.endDate ? new Date(event.endDate) : (event.startDate ? new Date(event.startDate) : new Date(event.date));
  const isPastEvent = !isNaN(endDateObj.getTime()) && endDateObj < now;

  // Format date range
  const startDateFormatted = event.startDate
    ? new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : event.date;
  const endDateFormatted = event.endDate
    ? new Date(event.endDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
    : event.date;

  const dateRangeDisplay = startDateFormatted === endDateFormatted
    ? startDateFormatted
    : `${startDateFormatted} — ${endDateFormatted}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/events')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events Calendar
        </button>

        {/* 3. Event Ended Banner (Top) */}
        {isPastEvent && (
          <div className="bg-slate-900/90 border-2 border-slate-700 text-slate-300 p-4 rounded-2xl flex items-center gap-3 shadow-lg backdrop-blur-md">
            <Clock className="w-5 h-5 text-gold-400 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-extrabold uppercase tracking-wide text-white">This Event Has Ended</h4>
              <p className="text-xs text-slate-400">
                This gathering took place in the past. It remains available in our church archive for historical reference.
              </p>
            </div>
          </div>
        )}

        {/* Hero Image with Grayscale for past events */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl h-80 md:h-96">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=1200'}
            alt={event.title}
            className={`w-full h-full object-cover ${isPastEvent ? 'grayscale opacity-70' : ''}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Badges on Hero */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-gold-500 text-navy-950 font-black text-xs uppercase px-3.5 py-1.5 rounded-full shadow-lg">
              {event.category}
            </span>
            {isPastEvent && (
              <span className="bg-slate-900 text-slate-300 font-extrabold text-xs uppercase px-3.5 py-1.5 rounded-full border border-slate-700 shadow-lg">
                PAST EVENT
              </span>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <h1 className="text-3xl md:text-5xl font-black uppercase font-display text-white tracking-wide">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Glass-Panel Card: Date Range & Details */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-800">
            {/* Glass-Panel Date Range */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Date & Time</span>
                <p className="text-sm font-bold text-white mt-0.5">{dateRangeDisplay}</p>
                {event.time && <p className="text-xs text-slate-400 mt-0.5">{event.time}</p>}
              </div>
            </div>

            {/* Location Panel */}
            <div className="bg-slate-800/50 border border-slate-700/60 p-4 rounded-2xl flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Location</span>
                <p className="text-sm font-bold text-white mt-0.5">{event.location}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-black uppercase font-display text-gold-400">About This Gathering</h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Attendance & RSVP Section */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
              <Users className="w-4 h-4 text-gold-400" />
              <span>{event.registrationsCount} People Attended / Registered</span>
            </div>

            {/* Hide Register button and countdown for past events */}
            {!isPastEvent && (
              <button
                onClick={() => onSelectEvent ? onSelectEvent(event) : alert(`Registering for ${event.title}`)}
                className="w-full sm:w-auto px-8 py-3.5 bg-gold-400 hover:bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" /> Register For Event
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
