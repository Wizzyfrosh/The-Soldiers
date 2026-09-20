import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/common/Animations';

export const ChildrenMinistry: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50">
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">CHILDREN'S MINISTRY</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Kingdom Kids Academy</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            "Train up a child in the way he should go: and when he is old, he will not depart from it." — Proverbs 22:6
          </p>
        </FadeIn>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <FadeIn direction="right">
            <img src="/images/children.jpg" alt="Kingdom Kids" className="rounded-2xl shadow-2xl border-4 border-navy-900 h-96 w-full object-cover" />
          </FadeIn>
          <FadeIn direction="left" className="space-y-4">
            <h2 className="text-3xl font-black uppercase font-display text-navy-950">Safe, Fun, & Scripture-Filled</h2>
            <p className="text-slate-700 text-sm leading-relaxed">
              At Kingdom Kids, we provide a secure, joy-filled environment where children from nursery through 5th grade experience the love of God through age-appropriate worship, interactive Bible lessons, and creative activities.
            </p>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Secure Check-In System & Background-Checked Volunteers</div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Nursery, Toddlers, & Elementary Classrooms</div>
              <div className="flex items-center gap-2 text-xs font-bold text-navy-900"><CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" /> Sunday Morning Classes @ 10:00 AM</div>
            </div>
            <div className="pt-4">
              <Link to="/plan-a-visit">
                <Button variant="gold" size="lg">Pre-Register Your Kids For Sunday</Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};
