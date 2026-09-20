import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/common/Animations';

interface PlanVisitProps {
  onOpenPlanVisitModal: () => void;
}

export const PlanVisit: React.FC<PlanVisitProps> = ({ onOpenPlanVisitModal }) => {
  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">VIP NEWCOMER EXPERIENCE</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Plan Your Visit</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            We know visiting a new church can be intimidating. We're saving a seat and a gift just for you!
          </p>
        </FadeIn>
      </section>

      {/* 4 Step Concierge Experience */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: "01", title: "RESERVE YOUR SPOT", desc: "Fill out the quick 1-minute form to let us know you're coming." },
            { step: "02", title: "VIP FRONT PARKING", desc: "Pull up to designated VIP visitor parking right near the front entrance." },
            { step: "03", title: "WARM GREETER TEAM", desc: "Our host team will meet you at the doors with a gift bag and tour." },
            { step: "04", title: "FAST KIDS CHECK-IN", desc: "Pre-register your children so Sunday check-in takes less than 30 seconds." }
          ].map((s, idx) => (
            <StaggerItem key={idx}>
              <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-lg space-y-2 h-full">
                <span className="text-3xl font-black text-gold-500 font-display">{s.step}</span>
                <h3 className="text-lg font-extrabold uppercase font-display text-navy-950">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA Banner */}
        <FadeIn>
          <div className="bg-navy-900 text-white rounded-2xl p-10 text-center space-y-6 border-2 border-gold-500/40">
            <span className="text-gold-400 text-xs font-black uppercase tracking-widest">SUNDAY WORSHIP AT 10:00 AM</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase font-display">Ready To Join Us This Sunday?</h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              Click below to reserve your VIP visitor spot and welcome pack.
            </p>
            <Button variant="gold" size="lg" onClick={onOpenPlanVisitModal} icon={<Sparkles className="w-5 h-5" />}>
              Schedule My VIP Visit Now
            </Button>
          </div>
        </FadeIn>

      </section>

    </div>
  );
};
