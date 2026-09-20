import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/common/Animations';

export const MensMinistry: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50">
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">MEN'S MINISTRY</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">The Mighty Men of Valor</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend." — Proverbs 27:17
          </p>
        </FadeIn>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <FadeIn direction="right">
            <img src="/images/mens.jpg" alt="Mighty Men" className="rounded-2xl shadow-2xl border-4 border-navy-900 h-96 w-full object-cover" />
          </FadeIn>
          <FadeIn direction="left" className="space-y-4">
            <h2 className="text-3xl font-black uppercase font-display text-navy-950">Standing As Men of Honor & Faith</h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              The Mighty Men ministry is committed to building strong, godly men who lead their homes, protect their families, and advance the Kingdom of God. We host monthly breakfasts, outdoor brotherhood events, and deep Bible studies.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Monthly Brotherhood Breakfasts (1st Saturday @ 8:30 AM)</div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Annual Men's Outdoor Retreat & BBQ</div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Tactical Bible Studies & Accountability Groups</div>
            </div>
            <div className="pt-4">
              <Link to="/events">
                <Button variant="gold" size="lg">Join The Next Men's Event</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};
