import React from 'react';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { FadeIn } from '../components/common/Animations';

export const Pastor: React.FC = () => {
  return (
    <div className="py-12 bg-slate-50">
      
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">LEADERSHIP</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Meet Our Spiritual Leader</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Prophet Ebelechukwu Elochukwu — Serving with passion, prophetic anointing, integrity, and Kingdom vision.
          </p>
        </FadeIn>
      </section>

      {/* Main Bio Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5">
            <FadeIn direction="right">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-navy-900">
                <img src="/images/bishop.png" alt="Prophet Ebelechukwu Elochukwu" className="w-full h-[480px] object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-navy-950/90 p-4 border-t border-gold-500">
                  <h4 className="font-extrabold text-lg text-white uppercase font-display">Prophet Ebelechukwu Elochukwu</h4>
                  <p className="text-xs text-gold-400 font-bold">General Overseer & Lead Prophet</p>
                </div>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7">
            <FadeIn direction="left" className="space-y-6">
              <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-600 rounded-full text-xs font-black uppercase tracking-wider">
                A MESSAGE FROM PROPHET EBELECHUKWU
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold uppercase font-display text-navy-950">
                "Welcome to a Place of Healing, Purpose, & Victory"
              </h2>

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  "When God laid the blueprint for <strong>Soldiers of Jesus Christ</strong> on our hearts, He gave us a clear mandate: build a sanctuary where the broken find healing, where the weary are refueled, and where ordinary believers are equipped to become extraordinary soldiers in God's army."
                </p>
                <p>
                  "We don't believe in passive church-going. We believe in active, victorious Christian living with a tangible demonstration of the Holy Spirit's power. Whether you are stepping into a church for the first time or searching for deeper discipleship, we welcome you with open arms."
                </p>
              </div>

              <div className="p-6 bg-navy-900 text-white rounded-xl border-l-4 border-gold-500 space-y-2">
                <span className="text-xs text-gold-400 font-bold uppercase">PROPHET'S FAVORITE SCRIPTURE</span>
                <p className="font-display font-extrabold text-lg italic text-gold-300">
                  "Thou therefore endure hardness, as a good soldier of Jesus Christ."
                </p>
                <span className="text-xs text-slate-400 block">— 2 Timothy 2:3</span>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link to="/plan-a-visit">
                  <Button variant="gold" size="lg">Plan A Visit With Prophet Ebelechukwu</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="navy" size="lg">Send A Message To The Prophet</Button>
                </Link>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

    </div>
  );
};
