import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Facebook, Instagram, Heart, BookOpen, MessageSquareHeart, Clock, ArrowRight, Shield } from 'lucide-react';

interface FooterProps {
  onOpenGiveModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGiveModal }) => {
  return (
    <footer className="bg-navy-950 text-white border-t border-navy-800 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gold-500/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 pb-12 border-b border-navy-800">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Soldiers of Jesus Christ Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="font-extrabold text-base uppercase font-display tracking-tight text-white">
                SOLDIERS OF JESUS CHRIST
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Equipping the saints for victorious Christian living, holy fellowship, and standing firm in biblical truth.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube Channel"
                className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 text-slate-300 hover:text-white hover:border-gold-400 flex items-center justify-center transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Page"
                className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 text-slate-300 hover:text-white hover:border-gold-400 flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
                className="w-8 h-8 rounded-lg bg-navy-900 border border-navy-700 text-slate-300 hover:text-white hover:border-gold-400 flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: What We Believe (Beliefs Section) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gold-400">
              <BookOpen className="w-4 h-4 text-gold-400" />
              <h4 className="font-black text-xs uppercase tracking-widest font-display text-gold-400">
                What We Believe
              </h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              We stand unashamedly upon the infallible Word of God, salvation through Jesus Christ, and the transformational power of the Holy Spirit.
            </p>
            <Link
              to="/beliefs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-400 hover:text-gold-300 transition-colors uppercase pt-1 group"
            >
              <span>Read Statement of Faith</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Column 3: Prayer & Pastoral Care (Prayer Section) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gold-400">
              <MessageSquareHeart className="w-4 h-4 text-gold-400" />
              <h4 className="font-black text-xs uppercase tracking-widest font-display text-gold-400">
                Prayer & Intercession
              </h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Have a need, illness, or spiritual battle? Our intercessory prayer watch team stands in agreement with you before the Throne of Grace.
            </p>
            <Link
              to="/prayer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gold-500/10 border border-gold-500/40 text-gold-400 hover:bg-gold-500 hover:text-navy-950 text-xs font-black uppercase tracking-wider transition-all"
            >
              Submit Prayer Request
            </Link>
          </div>

          {/* Column 4: Gathering Times & Giving */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gold-400">
              <Clock className="w-4 h-4 text-gold-400" />
              <h4 className="font-black text-xs uppercase tracking-widest font-display text-gold-400">
                Worship Gatherings
              </h4>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5">
              <li>
                <span className="font-bold text-white block">Sunday Celebration:</span>
                <span className="text-slate-400">10:00 AM • Worship & The Word</span>
              </li>
              <li>
                <span className="font-bold text-white block">Wednesday Prayer Watch:</span>
                <span className="text-slate-400">7:00 PM • Intercessory Service</span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={onOpenGiveModal}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 text-navy-950 text-xs font-black uppercase tracking-wider hover:bg-gold-400 transition-all shadow-gold cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-navy-950" /> Online Giving
              </button>
            </div>
          </div>

        </div>

        {/* Secondary Links Row */}
        <div className="py-6 border-b border-navy-800/60 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
          <Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link>
          <Link to="/beliefs" className="hover:text-gold-400 transition-colors">Our Beliefs</Link>
          <Link to="/sermons" className="hover:text-gold-400 transition-colors">Sermons</Link>
          <Link to="/events" className="hover:text-gold-400 transition-colors">Events</Link>
          <Link to="/ministries" className="hover:text-gold-400 transition-colors">Ministries</Link>
          <Link to="/prayer" className="hover:text-gold-400 transition-colors">Prayer Request</Link>
          <Link to="/plan-a-visit" className="hover:text-gold-400 transition-colors">Plan A Visit</Link>
          <Link to="/contact" className="hover:text-gold-400 transition-colors">Contact</Link>
        </div>

        {/* Bottom Row: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Soldiers of Jesus Christ. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <span className="opacity-30">•</span>
            <Link to="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
