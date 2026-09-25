import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Heart, Radio } from 'lucide-react';
import { Button } from '../common/Button';

interface NavbarProps {
  onOpenGiveModal: () => void;
  onOpenPlanVisitModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenGiveModal, onOpenPlanVisitModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [ministriesOpen, setMinistriesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setMinistriesOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Beliefs', path: '/beliefs' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Events', path: '/events' },
    { name: 'Prayer Request', path: '/prayer' },
    { name: 'Give', path: '/give' },
    { name: 'Contact', path: '/contact' }
  ];

  const ministryItems = [
    { name: "Overview", path: "/ministries" },
    { name: "Men's (Mighty Men)", path: "/ministries/mens" },
    { name: "Women's (Women of Valor)", path: "/ministries/womens" },
    { name: "Youth & Teens", path: "/ministries/youth" },
    { name: "Children (Kingdom Kids)", path: "/ministries/children" },
    { name: "Outreach & Missions", path: "/ministries/outreach" },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-2xl">
      {/* Top Notification Ribbon */}
      <div className="bg-gold-500 text-navy-950 text-xs font-black py-1.5 px-4 flex items-center justify-between uppercase tracking-widest border-b border-gold-400">
        <div className="flex items-center gap-2 mx-auto md:mx-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="font-extrabold text-[11px] md:text-xs">
            JOIN US LIVE ON YOUTUBE & FACEBOOK
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px]">
          <Link to="/prayer" className="hover:underline font-bold text-navy-950">
            NEED PRAYER?
          </Link>
          <span className="opacity-50">|</span>
          <Link to="/sermons" className="hover:underline flex items-center gap-1 font-bold">
            <Radio className="w-3.5 h-3.5 text-navy-950 animate-pulse" /> WATCH LIVE
          </Link>
          <span className="opacity-50">|</span>
          <Link to="/plan-a-visit" className="hover:underline font-bold">
            FIRST TIME? CLICK HERE
          </Link>
        </div>
      </div>

      {/* Main Sticky Navy Header */}
      <nav className={`transition-all duration-300 ${scrolled ? 'bg-navy-950/95 backdrop-blur-md py-3 shadow-navy border-b border-navy-800' : 'bg-navy-900 py-4 border-b border-navy-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/images/logo.png"
              alt="Soldiers of Jesus Christ Logo"
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform drop-shadow-lg"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-5">
            <Link
              to="/"
              className={`text-xs uppercase font-extrabold tracking-wider transition-colors hover:text-gold-400 ${isActive('/') ? 'text-gold-400 font-black border-b-2 border-gold-500 pb-1' : 'text-slate-200'}`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`text-xs uppercase font-extrabold tracking-wider transition-colors hover:text-gold-400 ${isActive('/about') ? 'text-gold-400 font-black border-b-2 border-gold-500 pb-1' : 'text-slate-200'}`}
            >
              About
            </Link>
            <Link
              to="/beliefs"
              className={`text-xs uppercase font-extrabold tracking-wider transition-colors hover:text-gold-400 ${isActive('/beliefs') ? 'text-gold-400 font-black border-b-2 border-gold-500 pb-1' : 'text-slate-200'}`}
            >
              Beliefs
            </Link>

            {/* Ministries Dropdown */}
            <div className="relative group" onMouseEnter={() => setMinistriesOpen(true)} onMouseLeave={() => setMinistriesOpen(false)}>
              <button
                className={`flex items-center gap-1 text-xs uppercase font-extrabold tracking-wider transition-colors hover:text-gold-400 py-1 ${location.pathname.startsWith('/ministries') ? 'text-gold-400 font-black border-b-2 border-gold-500' : 'text-slate-200'}`}
              >
                Ministries <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {ministriesOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 animate-fade-in">
                  <div className="bg-navy-900 border-2 border-gold-500/40 rounded-xl shadow-2xl p-2 space-y-1 backdrop-blur-md">
                    {ministryItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-3.5 py-2 rounded-lg text-xs font-bold text-slate-200 hover:bg-gold-500 hover:text-navy-950 transition-colors uppercase"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/sermons"
              className={`text-xs uppercase font-extrabold tracking-wider transition-colors hover:text-gold-400 ${isActive('/sermons') ? 'text-gold-400 font-black border-b-2 border-gold-500 pb-1' : 'text-slate-200'}`}
            >
              Sermons
            </Link>
            <Link
              to="/events"
              className={`text-xs uppercase font-extrabold tracking-wider transition-colors hover:text-gold-400 ${isActive('/events') ? 'text-gold-400 font-black border-b-2 border-gold-500 pb-1' : 'text-slate-200'}`}
            >
              Events
            </Link>
            <Link
              to="/prayer"
              className={`text-xs uppercase font-extrabold tracking-wider transition-colors hover:text-gold-400 ${isActive('/prayer') ? 'text-gold-400 font-black border-b-2 border-gold-500 pb-1' : 'text-slate-200'}`}
            >
              Prayer
            </Link>
            <Link
              to="/contact"
              className={`text-xs uppercase font-extrabold tracking-wider transition-colors hover:text-gold-400 ${isActive('/contact') ? 'text-gold-400 font-black border-b-2 border-gold-500 pb-1' : 'text-slate-200'}`}
            >
              Contact
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenGiveModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-wider text-gold-400 hover:text-white hover:bg-navy-800 transition-colors border border-gold-500/40 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-gold-500 fill-gold-500" /> Give
            </button>
            <Link to="/plan-a-visit">
              <Button variant="gold" size="sm">
                Plan Your Visit
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={onOpenGiveModal}
              className="p-2 text-gold-400 hover:text-white"
              title="Give Now"
            >
              <Heart className="w-5 h-5 fill-gold-500" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:text-gold-400 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-7 h-7 text-gold-400" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="xl:hidden bg-navy-950 border-b-2 border-gold-500/40 px-4 pt-4 pb-6 space-y-3 animate-fade-in">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider ${
                    isActive(link.path)
                      ? 'bg-gold-500 text-navy-950 font-black'
                      : 'text-white hover:bg-navy-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-navy-800 space-y-1">
              <p className="px-4 text-[11px] font-bold text-gold-400 uppercase tracking-widest mb-1">Ministries</p>
              {ministryItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block px-4 py-1.5 text-xs text-slate-300 hover:text-gold-400 uppercase"
                >
                  • {item.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-navy-800 flex flex-col gap-2">
              <Link to="/plan-a-visit" className="w-full">
                <Button variant="gold" size="md" className="w-full">
                  Plan Your Visit
                </Button>
              </Link>
              <Button variant="outline" size="md" className="w-full" onClick={onOpenGiveModal}>
                Online Giving
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
