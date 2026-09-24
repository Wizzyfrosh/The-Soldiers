import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, ArrowRight, Sparkles } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../common/Animations';
import { Testimony } from '../../types';

interface TestimoniesSectionProps {
  testimonies: Testimony[];
}

export const TestimoniesSection: React.FC<TestimoniesSectionProps> = ({ testimonies = [] }) => {
  // Take up to 5 testimonies for the layout
  const displayTestimonies = testimonies.slice(0, 5);

  // If we have at least 5 (or 2+), the first 4 go on the left 2x2 grid, and the 5th (or last) is the featured card on the right
  const featured = displayTestimonies.length >= 5 
    ? displayTestimonies[4] 
    : displayTestimonies[displayTestimonies.length - 1];

  const leftFour = displayTestimonies.length >= 5
    ? displayTestimonies.slice(0, 4)
    : displayTestimonies.slice(0, -1);

  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header matching uploaded design */}
        <FadeIn className="text-center max-w-4xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#0e356c] tracking-tight">
            Powerful Testimonies
          </h2>
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            God is still doing miracles as in the days of old. Experience what God has done in the lives of these brethren.{' '}
            <span className="italic text-slate-800 font-serif">
              Let the redeemed of the LORD say so, whom he hath redeemed from the hand of the enemy (Psalm 107:2).
            </span>
          </p>
        </FadeIn>

        {displayTestimonies.length === 0 ? (
          <FadeIn>
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 mt-10 max-w-xl mx-auto p-8">
              <Quote className="w-12 h-12 text-gold-500 mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold uppercase font-display text-navy-950">No Testimonies Shared Yet</h3>
              <p className="text-slate-500 text-xs mt-1">
                Be the first to share what the Lord has done! Member stories will be published here.
              </p>
            </div>
          </FadeIn>
        ) : (
          /* Asymmetric 5-card layout from screenshot: Left 4 cards in 2x2 + Right 1 large featured card */
          <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left 4 Cards: 2x2 Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              {leftFour.map((t, idx) => (
                <FadeIn key={t.id} delay={0.1 * idx} className="h-full">
                  <Link
                    to={`/testimonies/${t.id}`}
                    className="group flex flex-col h-full cursor-pointer"
                  >
                    {/* Photo with floating dark glass quote box */}
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-navy-950 shadow-sm border border-slate-100 group-hover:shadow-md transition-all">
                      <img
                        src={t.image || t.avatarUrl || '/images/worship_hero.jpg'}
                        alt={t.title || 'Testimony'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                      {/* Floating dark glass overlay block on image */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-[#172231]/90 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/10 flex items-start gap-2.5 shadow-lg">
                        <div className="w-6 h-6 rounded-md bg-[#ea580c] flex items-center justify-center shrink-0 text-white font-serif font-bold text-xs shadow-sm">
                          “
                        </div>
                        <p className="text-white text-xs font-bold leading-snug line-clamp-2 font-sans pt-0.5">
                          {t.title || t.content}
                        </p>
                      </div>
                    </div>

                    {/* Blue Title Link below card */}
                    <h4 className="text-sm font-bold text-[#144782] group-hover:text-[#0b284c] transition-colors leading-snug line-clamp-2 mt-2.5 font-sans">
                      {t.title || 'Testimony of God’s Faithfulness'}
                    </h4>
                  </Link>
                </FadeIn>
              ))}
            </div>

            {/* Right Side: 1 Large Featured Card (matching screenshot) */}
            {featured && (
              <FadeIn delay={0.3} className="lg:col-span-5 h-full">
                <Link
                  to={`/testimonies/${featured.id}`}
                  className="group block h-full min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] rounded-2xl overflow-hidden relative shadow-md group-hover:shadow-xl transition-all cursor-pointer bg-navy-950 border border-slate-100"
                >
                  {/* Full Background Photo */}
                  <img
                    src={featured.image || featured.avatarUrl || '/images/worship_hero.jpg'}
                    alt={featured.title || 'Featured Testimony'}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                  {/* Top Pill Badge: "TESTIMONIES" */}
                  <div className="relative z-10 p-5 sm:p-6 flex justify-end">
                    <span className="bg-black/50 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full border border-white/20 shadow-md">
                      TESTIMONIES
                    </span>
                  </div>

                  {/* Bottom Floating Glass Panel */}
                  <div className="relative z-10 mt-auto p-4 sm:p-6">
                    <div className="bg-[#162231]/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 space-y-3.5 shadow-2xl">
                      {/* Quote mark and dots header */}
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-lg bg-[#ea580c] flex items-center justify-center text-white font-serif font-black text-base shadow">
                          “
                        </div>
                        <span className="text-white/40 tracking-widest text-xs font-mono font-bold">•••</span>
                      </div>

                      {/* Main Headline */}
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white leading-snug font-sans group-hover:text-gold-400 transition-colors">
                        {featured.title}
                      </h3>

                      {/* Footer attribution & service watermark */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[11px] sm:text-xs">
                        <span className="font-bold uppercase tracking-wider text-slate-300 truncate max-w-[220px]">
                          {featured.name || 'Sis. Ginika Nwachukwu and Family'}
                        </span>
                        <span className="italic font-serif text-gold-400 text-xs sm:text-sm">
                          Combined Service
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            )}

          </div>
        )}

      </div>
    </section>
  );
};
