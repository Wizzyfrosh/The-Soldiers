import React from 'react';
import { Heart, Lock, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { FadeIn } from '../components/common/Animations';

interface GiveProps {
  onOpenGiveModal: () => void;
}

export const Give: React.FC<GiveProps> = ({ onOpenGiveModal }) => {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      
      {/* Hero */}
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">KINGDOM STEWARDSHIP</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Partner With The Mission</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            "Every man according as he purposeth in his heart, so let him give; not grudgingly, or of necessity: for God loveth a cheerful giver." — 2 Corinthians 9:7
          </p>
        </FadeIn>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7">
            <FadeIn direction="right" className="space-y-6">
              <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-600 rounded-full text-xs font-black uppercase tracking-wider">
                WHY WE GIVE
              </span>

              <h2 className="text-3xl md:text-4xl font-black uppercase font-display text-navy-950">
                Fueling Local Outreach & Global Impact
              </h2>

              <p className="text-slate-700 text-sm leading-relaxed">
                Your generous financial tithes and offerings directly power our local community food bank, youth ministry camps, media broadcasting, and global church planting initiatives. We believe in high accountability, transparent stewardship, and Kingdom excellence.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-gold-600 uppercase">General Fund</span>
                  <p className="text-xs text-slate-600">Daily operations, pastoral care, and weekend worship services.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border-2 border-slate-200 shadow-sm space-y-1">
                  <span className="text-xs font-bold text-gold-600 uppercase">Missions & Food Bank</span>
                  <p className="text-xs text-slate-600">Feeding over 200 families weekly & supporting missionaries.</p>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="gold" size="lg" onClick={onOpenGiveModal} icon={<Heart className="w-5 h-5 fill-navy-950" />}>
                  Give Securely Online Now
                </Button>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-5">
            <FadeIn direction="left">
              <div className="bg-navy-900 text-white rounded-2xl p-8 border-2 border-gold-500/50 shadow-2xl space-y-6 text-center">
                <div className="w-14 h-14 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center mx-auto border border-gold-500/40">
                  <Lock className="w-7 h-7" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-black uppercase font-display text-white">Online Giving Portal</h3>
                  <p className="text-xs text-slate-300 mt-1">Fast, secure 256-bit encrypted transactions.</p>
                </div>

                <div className="space-y-2 text-xs text-slate-300 text-left bg-navy-950 p-4 rounded-xl border border-navy-800">
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> One-time or recurring monthly donations</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Debit, Credit, or Bank ACH transfer</div>
                  <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant digital tax receipt via email</div>
                </div>

                <Button variant="gold" size="lg" className="w-full" onClick={onOpenGiveModal}>
                  Open Giving Calculator
                </Button>
              </div>
            </FadeIn>
          </div>

        </div>

      </section>

    </div>
  );
};
