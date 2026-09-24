import React, { useState } from 'react';
import { X, Calendar, MapPin, Users, CheckCircle, Ticket } from 'lucide-react';
import { ChurchEvent } from '../../types';
import { Button } from '../common/Button';
import { store } from '../../data/store';

interface EventRegistrationModalProps {
  event: ChurchEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const EventRegistrationModal: React.FC<EventRegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    store.registerForEvent(event.id, { name, email, phone, guestsCount })
      .then(() => {
        setIsSubmitting(false);
        setConfirmed(true);
        onSuccess(`RSVP Confirmed for ${event.title}!`);
      })
      .catch((err) => {
        setIsSubmitting(false);
        alert(err.message || 'Failed to complete registration.');
      });
  };

  const handleClose = () => {
    setConfirmed(false);
    setName('');
    setEmail('');
    setPhone('');
    setGuestsCount(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-navy-900 border-2 border-gold-500/40 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-navy-950 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <Ticket className="w-5 h-5 text-gold-400" />
            <h3 className="font-extrabold text-base uppercase font-display text-white">Event Registration</h3>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {confirmed ? (
          <div className="p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black uppercase font-display text-white">You're Registered!</h4>
            <p className="text-sm text-slate-300 mt-2">
              Confirmation ticket sent to <span className="text-gold-400 font-medium">{email}</span>
            </p>

            <div className="my-6 p-4 bg-navy-950 rounded-xl border border-navy-800 text-left space-y-2 text-xs">
              <p className="font-bold text-sm text-gold-400 font-display">{event.title}</p>
              <div className="flex items-center gap-2 text-slate-300">
                <Calendar className="w-4 h-4 text-gold-500 shrink-0" /> {event.date} • {event.time}
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" /> {event.location}
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-gold-500 shrink-0" /> Attendees: {guestsCount} Ticket(s)
              </div>
            </div>

            <Button variant="gold" className="w-full" onClick={handleClose}>
              Close & View Events
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-4 bg-navy-950 rounded-xl border border-navy-800">
              <h4 className="font-extrabold text-base text-gold-400 font-display uppercase">{event.title}</h4>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-300">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold-500" /> {event.date} ({event.time})</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gold-500" /> {event.location}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Number of Attendees</label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                  <option key={n} value={n}>{n} Ticket{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full text-base mt-2"
              disabled={isSubmitting || !name || !email}
            >
              {isSubmitting ? 'Confirming RSVP...' : 'Complete RSVP Registration'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
