import React, { useState } from 'react';
import { X, Calendar, Sparkles, CheckCircle2, User, Gift, Clock, MapPin } from 'lucide-react';
import { Button } from '../common/Button';
import { store } from '../../data/store';

interface PlanVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (msg: string) => void;
}

export const PlanVisitModal: React.FC<PlanVisitModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visitDate, setVisitDate] = useState('This Sunday @ 10:00 AM');
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [needsParking, setNeedsParking] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    setIsSubmitting(true);
    setTimeout(() => {
      store.addSubmission({
        type: 'PLAN_VISIT',
        name,
        email,
        phone,
        message: `Plan Visit on ${visitDate}. Adults: ${adults}, Kids: ${kids}. VIP Parking: ${needsParking ? 'Yes' : 'No'}`
      });
      setIsSubmitting(false);
      setConfirmed(true);
      onSuccess(`VIP Visit scheduled for ${name}!`);
    }, 1200);
  };

  const handleClose = () => {
    setConfirmed(false);
    setName('');
    setEmail('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-navy-900 border-2 border-gold-500/40 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-navy-950 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gold-500/20 rounded-lg text-gold-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base uppercase font-display text-white">Plan Your Visit (VIP Concierge)</h3>
              <p className="text-xs text-gold-400">We Can't Wait To Welcome You Home</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmed ? (
          <div className="p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-500/40">
              <Gift className="w-10 h-10 text-gold-400" />
            </div>
            <h4 className="text-2xl font-black uppercase font-display text-white">VIP Reserved!</h4>
            <p className="text-sm text-slate-300 mt-2">
              We have reserved a VIP parking spot and welcome gift pack for <span className="text-gold-400 font-bold">{name}</span>.
            </p>

            <div className="my-6 p-4 bg-navy-950 rounded-xl border border-gold-500/30 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Voucher Code:</span>
                <span className="font-mono text-gold-400 font-bold text-sm bg-navy-900 px-2 py-0.5 rounded border border-gold-500/40">SOLDIER-VIP-2026</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-gold-500 shrink-0" /> Service Time: {visitDate}
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-gold-500 shrink-0" /> 1709 John Barrow Rd, Little Rock, AR
              </div>
            </div>

            <Button variant="gold" className="w-full" onClick={handleClose}>
              Got It & Return
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Select Sunday</label>
              <select
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500"
              >
                <option value="This Sunday @ 10:00 AM">This Coming Sunday @ 10:00 AM</option>
                <option value="Next Sunday @ 10:00 AM">Next Sunday @ 10:00 AM</option>
                <option value="In Two Weeks @ 10:00 AM">In Two Weeks @ 10:00 AM</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Marcus & Sarah Johnson"
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
                  placeholder="marcus@example.com"
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
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Adults</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={adults}
                  onChange={(e) => setAdults(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Children (Kids Ministry)</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={kids}
                  onChange={(e) => setKids(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="vipParking"
                checked={needsParking}
                onChange={(e) => setNeedsParking(e.target.checked)}
                className="w-4 h-4 accent-gold-500 rounded"
              />
              <label htmlFor="vipParking" className="text-xs text-slate-300">
                Reserve VIP Front-Row Guest Parking Space 🚗
              </label>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full text-base mt-2"
              disabled={isSubmitting || !name || !email}
            >
              {isSubmitting ? 'Reserving VIP Visit...' : 'Reserve My VIP Visit & Gift'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
