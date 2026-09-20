import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/common/Animations';

export const WomensMinistry: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50">
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">WOMEN'S MINISTRY</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Women of Valor</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            "Strength and honour are her clothing; and she shall rejoice in time to come." — Proverbs 31:25
          </p>
        </FadeIn>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <FadeIn direction="right">
            <img src="/images/womens.jpg" alt="Women of Valor" className="rounded-2xl shadow-2xl border-4 border-navy-900 h-96 w-full object-cover" />
          </FadeIn>
          <FadeIn direction="left" className="space-y-4">
            <h2 className="text-3xl font-black uppercase font-display text-navy-950">Empowered Sisters in Christ</h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              Women of Valor is a sanctuary of encouragement, sisterhood, and deep spiritual growth. Through mentoring, retreats, and prayer circles, we equip women to walk boldly in their royal calling.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Bi-Weekly Sisterhood Worship & Tea (Tuesdays @ 6:30 PM)</div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Fall Women's Retreat: "Crowned In Glory"</div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Titus 2 Mentorship Program</div>
            </div>
            <div className="pt-4">
              <Link to="/events">
                <Button variant="gold" size="lg">Explore Women's Events</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};
