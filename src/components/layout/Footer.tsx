import React from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Facebook, Instagram, Heart } from 'lucide-react';

interface FooterProps {
  onOpenGiveModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGiveModal }) => {
  return (
    <footer className="bg-[#1A1A1A] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Row: Church Name, Tagline, Quick Links, Social Icons & Support */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-white/10">
          
          {/* Brand & Tagline */}
          <div className="text-center lg:text-left space-y-2 max-w-md">
            <Link to="/" className="inline-flex items-center gap-3 justify-center lg:justify-start">
              <img
                src="/images/logo.png"
                alt="Soldiers of Jesus Christ Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-extrabold text-base uppercase font-display tracking-tight text-white">
                SOLDIERS OF JESUS CHRIST
              </span>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed">
              Equipping the saints for victorious Christian living, holy fellowship, and standing firm in biblical truth.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <nav aria-label="Footer Quick Links" className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase font-bold tracking-wider text-slate-300">
            <Link to="/" className="hover:text-gold-400 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link>
            <Link to="/beliefs" className="hover:text-gold-400 transition-colors">Beliefs</Link>
            <Link to="/sermons" className="hover:text-gold-400 transition-colors">Sermons</Link>
            <Link to="/events" className="hover:text-gold-400 transition-colors">Events</Link>
            <Link to="/ministries" className="hover:text-gold-400 transition-colors">Ministries</Link>
            <Link to="/prayer" className="hover:text-gold-400 transition-colors">Prayer</Link>
            <Link to="/contact" className="hover:text-gold-400 transition-colors">Contact</Link>
          </nav>

          {/* Social Icons & Support Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube Channel"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-gold-400 flex items-center justify-center transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Page"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-gold-400 flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-gold-400 flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={onOpenGiveModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gold-500 text-navy-950 text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition-all shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-navy-950" /> Give
            </button>
          </div>

        </div>

        {/* Bottom Row: Copyright & Legal Links (NO Admin Link) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-xs text-slate-400">
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
