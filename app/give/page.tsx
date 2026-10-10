'use client';

import React, { useState } from 'react';
import { Heart, Lock, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function GivePage() {
  const [frequency, setFrequency] = useState<'ONE_TIME' | 'MONTHLY'>('ONE_TIME');
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [fund, setFund] = useState('General Ministry Fund');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const presetAmounts = [25, 50, 100, 250, 500, 1000];

  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    if (val && !isNaN(parseFloat(val))) {
      setAmount(parseFloat(val));
    }
  };

  const handleStripeCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;

    if (!finalAmount || finalAmount < 1) {
      setError('Please choose or enter an amount of at least $1.00');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalAmount,
          frequency,
          fund,
          donorName: donorName.trim() || undefined,
          donorEmail: donorEmail.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize checkout.');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Payment initiation failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      {/* Hero */}
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">KINGDOM STEWARDSHIP</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Partner With The Mission</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto">
            "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Corinthians 9:7
          </p>
        </div>
      </section>

      {/* Main Donation Container */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Why We Give Info */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-600 rounded-full text-xs font-black uppercase tracking-wider">
              WHY WE GIVE
            </span>
            <h2 className="text-3xl font-black uppercase font-display text-navy-950 leading-tight">
              Fueling Local Outreach & Global Impact
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              Your financial seeds directly power community food distributions, youth revivals, media broadcasts, and missionary outreach. Every contribution is handled with transparent stewardship and Kingdom excellence.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-navy-950">Bank-Grade 256-Bit Encryption</h4>
                  <p className="text-xs text-slate-500">All transactions are processed directly by Stripe PCI-compliant infrastructure.</p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase text-navy-950">Immediate Tax Receipts</h4>
                  <p className="text-xs text-slate-500">Automated digital receipts sent directly to your email address for tax deductions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Stripe Giving Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black uppercase text-navy-950 font-display">Give Online</h3>
                  <p className="text-xs text-slate-500">Choose your gift frequency and amount below.</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-[11px] font-bold text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Stripe Secure</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
                  {error}
                </div>
              )}

              <form onSubmit={handleStripeCheckout} className="space-y-6">
                
                {/* 1. Frequency Toggle */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Giving Frequency
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFrequency('ONE_TIME')}
                      className={`py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        frequency === 'ONE_TIME'
                          ? 'bg-navy-950 text-gold-400 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      One-Time Gift
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency('MONTHLY')}
                      className={`py-2.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                        frequency === 'MONTHLY'
                          ? 'bg-navy-950 text-gold-400 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Monthly Partnership
                    </button>
                  </div>
                </div>

                {/* 2. Preset Amounts */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Select Gift Amount (USD)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {presetAmounts.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => handleSelectPreset(preset)}
                        className={`py-3 rounded-xl border text-sm font-black transition-all cursor-pointer ${
                          amount === preset && !customAmount
                            ? 'border-gold-500 bg-gold-50 text-navy-950 ring-2 ring-gold-400'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-800'
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Custom Amount Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Or Enter Custom Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      step="any"
                      min="1"
                      placeholder="Custom amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                    />
                  </div>
                </div>

                {/* 4. Fund Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Direct Contribution To
                  </label>
                  <select
                    value={fund}
                    onChange={(e) => setFund(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  >
                    <option value="General Ministry Fund">General Ministry Fund</option>
                    <option value="Missions & Outreach">Missions & Food Bank Outreach</option>
                    <option value="Building & Expansion Fund">Building & Sanctuary Expansion</option>
                    <option value="Youth & Children Ministry">Youth & Children Revival</option>
                  </select>
                </div>

                {/* 5. Optional Donor Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Your Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bro. David Okon"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Your Email (Receipt)
                    </label>
                    <input
                      type="email"
                      placeholder="david@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Submit to Stripe */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-navy-950 hover:bg-navy-900 text-gold-400 font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 border border-gold-500/30 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Redirecting to Stripe...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5 fill-gold-400" />
                      <span>
                        Give ${customAmount || amount} {frequency === 'MONTHLY' ? 'Monthly' : 'Now'}
                      </span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  🔒 Payments securely handled by Stripe. Your billing statement will show "Soldiers of Jesus Christ".
                </p>
              </form>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
