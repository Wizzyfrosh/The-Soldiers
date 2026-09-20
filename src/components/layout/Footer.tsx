import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Youtube, Facebook, Instagram, Heart, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenGiveModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGiveModal }) => {
  return (
    <footer className="bg-navy-950 text-white border-t border-white/10 pt-12 pb-8 relative overflow-hidden">
      {/* Subtle Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Belief */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Soldiers of Jesus Christ Logo"
                className="h-9 w-auto object-contain drop-shadow"
              />
              <span className="font-extrabold text-base uppercase font-display tracking-tight text-white">
                SOLDIERS OF JESUS CHRIST
              </span>
            </Link>

            <p className="text-slate-300 text-xs leading-relaxed">
              We believe in the unity of the body of Jesus Christ; Christianity – The Church. Standing firm in truth, love, and the power of the Holy Spirit.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube Channel"
                className="w-8 h-8 rounded-lg liquid-glass-card text-slate-300 hover:text-white hover:border-gold-400 flex items-center justify-center transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook Page"
                className="w-8 h-8 rounded-lg liquid-glass-card text-slate-300 hover:text-white hover:border-gold-400 flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Profile"
                className="w-8 h-8 rounded-lg liquid-glass-card text-slate-300 hover:text-white hover:border-gold-400 flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Service Schedule */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-widest text-gold-400 font-display">
              Worship Services
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl liquid-glass-card space-y-0.5">
                <span className="text-gold-400 font-bold block text-[11px] uppercase">Saturdays (7th Day Sabbath)</span>
                <p className="text-white font-medium">Holy Ghost Power, Miracle Services & Holy Worship</p>
              </div>
              <div className="p-3 rounded-xl liquid-glass-card space-y-0.5">
                <span className="text-slate-300 font-bold block text-[11px] uppercase">Sunday Services</span>
                <p className="text-white font-medium">Activities as Advertised</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Wednesdays: Prayer Watch at 7:00 PM</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-widest text-gold-400 font-display">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs uppercase font-bold text-slate-300">
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">About Us</Link></li>
              <li><Link to="/beliefs" className="hover:text-gold-400 transition-colors">Our Beliefs</Link></li>
              <li><Link to="/sermons" className="hover:text-gold-400 transition-colors">Sermon Broadcasts</Link></li>
              <li><Link to="/events" className="hover:text-gold-400 transition-colors">Upcoming Events</Link></li>
              <li><Link to="/ministries" className="hover:text-gold-400 transition-colors">Ministries</Link></li>
              <li><Link to="/prayer" className="hover:text-gold-400 transition-colors">Prayer Request</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Contact Church</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Giving */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs uppercase tracking-widest text-gold-400 font-display">
              Sanctuary & Giving
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>1709 John Barrow Rd, Little Rock, AR 72204</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <span>(501) 555-0199</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <span>info@soldiersofjesuschrist.org</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenGiveModal}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 text-navy-950 text-xs font-black uppercase tracking-wider shadow-gold hover:bg-gold-400 transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-navy-950" /> Support The Mission
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Soldiers of Jesus Christ. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
            <span className="opacity-30">•</span>
            <Link to="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
            <span className="opacity-30">•</span>
            <Link to="/admin" className="hover:text-gold-400 transition-colors font-bold text-slate-500">Admin Portal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
