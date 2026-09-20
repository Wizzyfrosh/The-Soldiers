import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/common/Animations';

export const YouthMinistry: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50">
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">YOUTH & TEEN MINISTRY</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">IGNITE Youth Generation</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            "Let no man despise thy youth; but be thou an example of the believers." — 1 Timothy 4:12
          </p>
        </FadeIn>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <FadeIn direction="right">
            <img src="/images/youth.jpg" alt="IGNITE Youth" className="rounded-2xl shadow-2xl border-4 border-navy-900 h-96 w-full object-cover" />
          </FadeIn>
          <FadeIn direction="left" className="space-y-4">
            <h2 className="text-3xl font-black uppercase font-display text-navy-950">High-Energy Worship & Truth For Gen Z</h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              IGNITE Youth is where 6th to 12th graders discover their true identity in Christ. We combine electric worship, honest small group discussions, and life-changing summer camps.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Wednesday Night IGNITE Service @ 6:30 PM</div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Summer Youth Rally & Camp Trips</div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Student Leadership & Worship Band Training</div>
            </div>
            <div className="pt-4">
              <Link to="/events">
                <Button variant="gold" size="lg">Get Your Teen Connected</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};
