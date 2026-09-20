import React, { useState } from 'react';
import { X, Heart, ShieldCheck, CheckCircle2, Lock, CreditCard } from 'lucide-react';
import { Button } from '../common/Button';
import { store } from '../../data/store';

interface GivingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const GivingModal: React.FC<GivingModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<number | string>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [fund, setFund] = useState<'General Fund' | 'Missions & Outreach' | 'Building Fund' | 'Youth Ministry'>('General Fund');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTx, setCompletedTx] = useState<any>(null);

  if (!isOpen) return null;

  const presets = [25, 50, 100, 250, 500];

  const finalAmount = amount === 'custom' ? parseFloat(customAmount) || 0 : (typeof amount === 'number' ? amount : 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalAmount || finalAmount <= 0) return;
    if (!donorName || !email) return;

    setIsProcessing(true);

    setTimeout(() => {
      const donation = store.addDonation({
        donorName,
        email,
        amount: finalAmount,
        frequency,
        fund
      });

      setIsProcessing(false);
      setCompletedTx(donation);
      onSuccess(`Thank you for your generous gift of $${finalAmount.toFixed(2)} to ${fund}!`);
    }, 1500);
  };

  const handleResetAndClose = () => {
    setCompletedTx(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-navy-900 border-2 border-gold-500/40 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 bg-navy-950 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gold-500/20 rounded-lg text-gold-400">
              <Heart className="w-5 h-5 fill-gold-500 text-gold-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg uppercase font-display text-white">Partner With The Mission</h3>
              <p className="text-xs text-gold-400">Generous Giving • Kingdom Impact</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {completedTx ? (
          <div className="p-8 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-2xl font-black uppercase font-display text-white">Donation Successful!</h4>
            <p className="text-sm text-slate-300 mt-2">
              Receipt <span className="font-mono text-gold-400">#{completedTx.id}</span> sent to <span className="font-medium text-white">{completedTx.email}</span>
            </p>

            <div className="my-6 p-4 bg-navy-950 rounded-xl border border-navy-800 text-left space-y-2 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Amount:</span>
                <span className="font-bold text-gold-400 text-lg">${completedTx.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Frequency:</span>
                <span className="capitalize text-white font-medium">{completedTx.frequency}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Designation:</span>
                <span className="text-white font-medium">{completedTx.fund}</span>
              </div>
            </div>

            <Button variant="gold" className="w-full" onClick={handleResetAndClose}>
              Done & Return to Site
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Frequency Toggle */}
            <div className="grid grid-cols-2 p-1 bg-navy-950 rounded-xl border border-navy-800">
              <button
                type="button"
                onClick={() => setFrequency('one-time')}
                className={`py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  frequency === 'one-time'
                    ? 'bg-gold-500 text-navy-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Give One-Time
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`py-2 text-xs font-bold uppercase rounded-lg transition-all ${
                  frequency === 'monthly'
                    ? 'bg-gold-500 text-navy-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Give Monthly 🔄
              </button>
            </div>

            {/* Presets Grid */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Select Amount ($)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {presets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => { setAmount(val); setCustomAmount(''); }}
                    className={`py-2.5 rounded-xl font-extrabold text-base transition-all border ${
                      amount === val
                        ? 'bg-gold-500 text-navy-950 border-gold-400 shadow-gold scale-105'
                        : 'bg-navy-950 text-white border-navy-800 hover:border-gold-500/50'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmount('custom')}
                  className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border ${
                    amount === 'custom'
                      ? 'bg-gold-500 text-navy-950 border-gold-400 scale-105'
                      : 'bg-navy-950 text-white border-navy-800 hover:border-gold-500/50'
                  }`}
                >
                  Custom
                </button>
              </div>

              {amount === 'custom' && (
                <div className="mt-3">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-400 font-bold">$</span>
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-navy-950 border-2 border-gold-500 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500"
                      min="1"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Fund Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Fund Designation
              </label>
              <select
                value={fund}
                onChange={(e: any) => setFund(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-gold-500"
              >
                <option value="General Fund">General Tithes & Offerings</option>
                <option value="Missions & Outreach">Missions & Community Outreach</option>
                <option value="Building Fund">Building & Kingdom Expansion</option>
                <option value="Youth Ministry">Youth & NextGen Ministry</option>
              </select>
            </div>

            {/* Donor Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  required
                />
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-between p-3 bg-navy-950/60 rounded-xl border border-navy-800/80 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Powered by Stripe
              </span>
            </div>

            {/* Submit CTA */}
            <Button
              type="submit"
              variant="gold"
              size="lg"
              className="w-full text-base"
              disabled={isProcessing || !finalAmount || !donorName || !email}
              icon={isProcessing ? <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin"></div> : <ShieldCheck className="w-5 h-5" />}
            >
              {isProcessing ? 'Processing Secure Gift...' : `Give $${finalAmount.toFixed(2)} ${frequency === 'monthly' ? '/ Month' : 'Now'}`}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};
