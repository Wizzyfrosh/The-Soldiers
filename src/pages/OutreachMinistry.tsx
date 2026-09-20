import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/common/Animations';

export const OutreachMinistry: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50">
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">OUTREACH & MISSIONS</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Hands & Feet of Jesus</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            "Go ye into all the world, and preach the gospel to every creature." — Mark 16:15
          </p>
        </FadeIn>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <FadeIn direction="right">
            <img
              src="/images/outreach.jpg"
              alt="Outreach Food Bank"
              className="rounded-2xl shadow-2xl border-4 border-navy-900 h-96 w-full object-cover"
            />
          </FadeIn>
          <FadeIn direction="left" className="space-y-4">
            <h2 className="text-3xl font-black uppercase font-display text-navy-950">Serving Our City & The Nations</h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              We believe church isn't just within four walls. Through our weekly community food bank, street evangelism teams, and international mission partnerships, we take the love of Christ directly to those in need.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900">
                <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Weekly Community Food Distribution (Saturdays @ 10:00 AM)
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900">
                <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> City Evangelism & Prayer Walks
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900">
                <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Global Mission Trips & Church Planting Support
              </div>
            </div>
            <div className="pt-4">
              <Link to="/contact">
                <Button variant="gold" size="lg">Volunteer With Outreach</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};
