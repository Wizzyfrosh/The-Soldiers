import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { store } from '../data/store';
import { Testimony } from '../types';
import { FadeIn } from '../components/common/Animations';

export const TestimonyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [testimony, setTestimony] = useState<Testimony | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimony = async () => {
      setLoading(true);

      // Try from store first
      const cached = store.getTestimonies().find(t => t.id === id);
      if (cached) {
        setTestimony(cached);
        setLoading(false);
        return;
      }

      // Fetch from API
      try {
        const res = await api.testimonies.getById(id!);
        if (res.testimony) {
          setTestimony(res.testimony);
        }
      } catch (err) {
        console.error('Failed to fetch testimony:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTestimony();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-medium">Loading testimony...</p>
        </div>
      </div>
    );
  }

  if (!testimony) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Quote className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-black uppercase font-display text-navy-950">Testimony Not Found</h2>
          <p className="text-slate-500 text-sm">This testimony may have been removed or doesn't exist.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-gold-600 font-bold text-sm hover:text-gold-500 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[400px] md:h-[500px] w-full overflow-hidden"
      >
        <img
          src={testimony.image || testimony.avatarUrl || '/images/worship_hero.jpg'}
          alt={testimony.title || testimony.name || 'Testimony'}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />
        
        {/* Back nav */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-gold-500 text-navy-950 rounded-md">
                POWERFUL TESTIMONY
              </span>
              <span className="text-xs text-white/80 font-mono">
                {new Date(testimony.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase font-display text-white leading-tight">
              {testimony.title || testimony.name || 'A Story of Faith'}
            </h1>
          </div>
        </div>
      </motion.div>

      {/* Testimony Content */}
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 md:p-12 relative">
            {/* Decorative quote icon */}
            <div className="absolute -top-5 left-8">
              <div className="w-10 h-10 rounded-xl bg-gold-500 flex items-center justify-center shadow-gold">
                <Quote className="w-5 h-5 text-navy-950" />
              </div>
            </div>

            <div className="pt-4">
              {(testimony.content || testimony.quote || '').split('\n').map((paragraph, idx) => (
                paragraph.trim() && (
                  <p key={idx} className="text-[#2A2A2A] text-base leading-relaxed mb-4 italic">
                    {paragraph}
                  </p>
                )
              ))}
            </div>

            {/* Author attribution */}
            {testimony.name && (
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
                {testimony.avatarUrl ? (
                  <img
                    src={testimony.avatarUrl}
                    alt={testimony.name}
                    className="w-14 h-14 rounded-full object-cover border-3 border-gold-500/30 shadow-md"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-navy-900 flex items-center justify-center text-white font-bold text-lg uppercase shadow-md">
                    {testimony.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-extrabold text-[#1A1A1A] uppercase font-display">{testimony.name}</h4>
                  {testimony.role && <p className="text-sm text-slate-500">{testimony.role}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Back button */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-gold-400 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-navy-800 transition-colors shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Testimonies
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
