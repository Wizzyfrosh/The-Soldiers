import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, MapPin, ArrowRight, Shield, Heart, Sparkles, Users, Lightbulb, Palette, Music, Zap, HandHeart, Baby, UserCheck, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import { SectionHeader } from '../components/common/SectionHeader';
import { WaveDivider } from '../components/common/WaveDivider';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from '../components/common/Animations';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { EventCountdown } from '../components/home/EventCountdown';
import { TestimoniesSection } from '../components/home/TestimoniesSection';
import { LatestNewsSection } from '../components/home/LatestNewsSection';
import { store } from '../data/store';
import { ChurchEvent, Sermon, Testimony, NewsItem, CountdownEvent } from '../types';

interface HomeProps {
  onOpenGiveModal: () => void;
  onOpenPlanVisitModal: () => void;
  onSelectSermon: (sermon: Sermon) => void;
  onSelectEvent: (event: ChurchEvent) => void;
}

export const Home: React.FC<HomeProps> = ({
  onOpenGiveModal,
  onOpenPlanVisitModal,
  onSelectSermon,
  onSelectEvent
}) => {
  const [events, setEvents] = useState<ChurchEvent[]>(store.getEvents());
  const [sermons, setSermons] = useState<Sermon[]>(store.getSermons());
  const [testimonies, setTestimonies] = useState<Testimony[]>(store.getTestimonies());
  const [newsItems, setNewsItems] = useState<NewsItem[]>(store.getNews());
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(events.length === 0);
  const siteContent = store.getSiteContent();

  // Subscribe to store updates for real-time reactivity and sync with backend
  useEffect(() => {
    store.syncWithBackend().finally(() => {
      setIsLoadingEvents(false);
    });
    const unsubscribe = store.subscribe(() => {
      setEvents(store.getEvents());
      setSermons(store.getSermons());
      setTestimonies(store.getTestimonies());
      setNewsItems(store.getNews());
      setIsLoadingEvents(false);
    });
    return unsubscribe;
  }, []);

  // 10 Ministries — icon-based, dynamic-ready
  const ministries = [
    { name: 'Family Life Ministry', subtitle: 'Strengthening Homes', icon: 'users', path: '/ministries' },
    { name: 'Recreators-Inventors-Scientists Ministry', subtitle: 'Innovation & Discovery', icon: 'lightbulb', path: '/ministries' },
    { name: 'Arts & Drama Ministry', subtitle: 'Creative Expression', icon: 'palette', path: '/ministries' },
    { name: 'Dance Ministry', subtitle: 'Movement & Praise', icon: 'sparkles', path: '/ministries' },
    { name: 'Music Ministry', subtitle: 'Anointed Sound', icon: 'music', path: '/ministries' },
    { name: 'Youth Ministry', subtitle: 'IGNITE Generation', icon: 'zap', path: '/ministries/youth' },
    { name: 'Spiritual Life & Power Ministry', subtitle: 'Walking in the Spirit', icon: 'flame', path: '/ministries' },
    { name: 'Fellowship Ministry', subtitle: 'Community & Connection', icon: 'handheart', path: '/ministries' },
    { name: 'Children Ministry', subtitle: 'Kingdom Kids', icon: 'baby', path: '/ministries/children' },
    { name: 'Adult & Parental Ministry', subtitle: 'Mature in Faith', icon: 'usercheck', path: '/ministries' },
  ];

  const getMinistryIcon = (icon: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      users: <Users className="w-6 h-6" />,
      lightbulb: <Lightbulb className="w-6 h-6" />,
      palette: <Palette className="w-6 h-6" />,
      sparkles: <Sparkles className="w-6 h-6" />,
      music: <Music className="w-6 h-6" />,
      zap: <Zap className="w-6 h-6" />,
      flame: <Flame className="w-6 h-6" />,
      handheart: <HandHeart className="w-6 h-6" />,
      baby: <Baby className="w-6 h-6" />,
      usercheck: <UserCheck className="w-6 h-6" />,
    };
    return iconMap[icon] || <Heart className="w-6 h-6" />;
  };

  return (
    <div className="w-full overflow-hidden bg-slate-50">
      
      {/* SECTION 2: HERO SLIDESHOW WITH DYNAMIC SCROLL ANIMATIONS */}
      <HeroSlideshow
        onOpenPlanVisitModal={onOpenPlanVisitModal}
        onSelectSermon={() => sermons.length > 0 && onSelectSermon(sermons[0])}
        address={siteContent.address}
      />

      {/* SECTION 3: GOLD REPEATING TICKER BANNER */}
      <section id="ticker-banner" className="bg-gold-500 text-navy-950 font-black py-3 uppercase tracking-widest text-xs md:text-sm shadow-inner border-y-2 border-gold-400 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee gap-12 font-display">
          <span>⚔️ EQUIPPING THE SAINTS FOR THE BATTLE</span>
          <span>•</span>
          <span> STANDING FIRM IN FAITH</span>
          <span>•</span>
          <span> A CHURCH YOU CAN CALL HOME</span>
          <span>•</span>
          <span> SUNDAY WORSHIP 10:00 AM</span>
          <span>•</span>
          <span> EQUIPPING THE SAINTS FOR THE BATTLE</span>
          <span>•</span>
          <span> STANDING FIRM IN FAITH</span>
        </div>
      </section>

      {/* SECTION 4: WELCOME / ABOUT BRIEF SPLIT — Updated to warm cream/charcoal palette */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <FadeIn direction="left">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-navy-900 group">
                <img
                  src="/images/bishop.png"
                  alt="Bishop Ebelechukwu Elochukwu"
                  className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <span className="text-gold-400 font-bold text-xs uppercase tracking-widest">Lead Pastor</span>
                  <h4 className="text-xl font-extrabold text-white uppercase font-display">Bishop Ebelechukwu Elochukwu</h4>
                  <p className="text-xs text-slate-300">"We invite you to step into the fullness of God's calling."</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right" delay={0.2}>
            <div className="space-y-6">
              <SectionHeader
                badge="About Us"
                title="The Unity of the Body of Christ"
                subtitle="We believe in the unity of the body of Jesus Christ; Christianity – The Church. (John 17:6-12, Ephesians 4:5-32)."
                centered={false}
              />

              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <p>
                  We welcome all members of the personal Churches as a human body carrying the temple of God in which the Holy Trinity dwells. You may remain in your home Church and still be a member of our ministry. Our worship services are on Saturdays; the seventh day—The Sabbath (Holy Ghost Power, Miracle Services, and Holy Worship). We always stand by the Truth!
                </p>
              </div>

              {/* Vision & Mission cards — updated to warm cream/charcoal palette */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#F9F8F6] rounded-xl border-l-4 border-gold-500 shadow-sm">
                  <h5 className="font-extrabold text-sm font-display uppercase text-gold-600">Our Vision</h5>
                  <p className="text-xs text-[#4A4A4A] mt-1">Strong in grace, enduring as a good soldier of Christ Jesus. (2 Tim 2:1-7)</p>
                </div>
                <div className="p-4 bg-[#F9F8F6] rounded-xl border-l-4 border-gold-500 shadow-sm">
                  <h5 className="font-extrabold text-sm font-display uppercase text-gold-600">Our Mission</h5>
                  <p className="text-xs text-[#4A4A4A] mt-1">Appointed to bear lasting fruit in the power of the Holy Spirit. (John 15:16-17)</p>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Link to="/about">
                  <Button variant="navy" size="md">
                    Read Our Full Story
                  </Button>
                </Link>
                <Link to="/beliefs">
                  <Button variant="outline" size="md" className="!text-navy-950 !border-navy-900 hover:!bg-navy-900 hover:!text-white">
                    Our Doctrinal Beliefs
                  </Button>
                </Link>
              </div>

            </div>
          </FadeIn>

        </div>
      </section>

      {/* SECTION 5: "ANOINTED SERMONS" — 3 Most Recent Sermons with Watch More Button */}
      <section className="py-20 sm:py-24 bg-[#EFEFEF] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <FadeIn className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 text-[11px] font-black uppercase tracking-widest bg-navy-950 text-gold-400 rounded-full border border-navy-900 shadow-sm">
              ANOINTED PREACHING & TEACHING
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-display text-navy-950">
              Anointed Sermons
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Equipping the saints with the uncompromised Word of Truth, prophetic revelations, and supernatural Holy Ghost authority.
            </p>
          </FadeIn>

          {/* 3 Most Recent Sermon Cards */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sermons.slice(0, 3).map((sermon) => (
              <StaggerItem key={sermon.id}>
                <div
                  onClick={() => onSelectSermon(sermon)}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full"
                >
                  {/* Video Thumbnail with Play Button */}
                  <div className="relative aspect-video overflow-hidden bg-navy-950">
                    <img
                      src={
                        sermon.thumbnail ||
                        (sermon.youtubeId ? `https://img.youtube.com/vi/${sermon.youtubeId}/hqdefault.jpg` : '/images/worship_hero.jpg')
                      }
                      alt={sermon.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-navy-950/30 group-hover:bg-navy-950/10 transition-colors flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    {/* Series Badge */}
                    <div className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-md text-gold-400 font-black text-[10px] uppercase px-2.5 py-1 rounded-md border border-gold-500/30">
                      {sermon.series}
                    </div>
                  </div>

                  {/* Sermon Details */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold text-gold-600">{sermon.speaker}</span>
                        <span className="font-mono">{sermon.date}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black uppercase font-display text-navy-950 group-hover:text-gold-600 transition-colors leading-snug line-clamp-2">
                        {sermon.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {sermon.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-navy-950 group-hover:text-gold-600 uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors">
                        Watch Message <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Watch More Sermons CTA Button */}
          <div className="text-center pt-2">
            <Link to="/sermons">
              <Button variant="navy" size="lg" icon={<Play className="w-4 h-4 fill-current text-gold-400" />}>
                Watch More Sermons
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 6: FEATURED SEASONAL BLOCK (VIBRANT YELLOW SECTION WITH WAVE DIVIDER) */}
      <div className="relative bg-gold-500 text-navy-950 py-16 px-4 overflow-hidden">
        <WaveDivider fillColor="#f1f5f9" flip={true} />

        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Collage */}
            <FadeIn direction="left" className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                <img src="/images/worship_hero.jpg" alt="Summer worship" className="rounded-2xl shadow-xl h-44 w-full object-cover border-2 border-navy-950" />
                <img src="/images/youth.jpg" alt="Summer youth" className="rounded-2xl shadow-xl h-44 w-full object-cover border-2 border-navy-950 mt-4" />
                <img src="/images/womens.jpg" alt="Fellowship" className="rounded-2xl shadow-xl h-44 w-full object-cover border-2 border-navy-950 -mt-2" />
                <img src="/images/mens.jpg" alt="Brotherhood" className="rounded-2xl shadow-xl h-44 w-full object-cover border-2 border-navy-950 mt-2" />
              </div>
            </FadeIn>

            {/* Right Copy */}
            <FadeIn direction="right" delay={0.2} className="lg:col-span-7">
              <div className="space-y-6">
                <span className="inline-block px-3.5 py-1 text-xs font-black uppercase tracking-widest bg-navy-950 text-gold-400 rounded-full border border-navy-900">
                  SEASONAL HIGHLIGHT
                </span>

                <h2 className="text-3xl md:text-5xl font-black uppercase font-display leading-tight text-navy-950">
                  {siteContent.seasonalTitle}
                </h2>

                <p className="text-base md:text-lg font-bold text-navy-900">
                  {siteContent.seasonalSubheadline}
                </p>

                <p className="text-sm leading-relaxed text-navy-950 font-medium max-w-2xl">
                  {siteContent.seasonalBody}
                </p>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Button variant="navy" size="lg" onClick={onOpenPlanVisitModal}>
                    Plan A Visit This Sunday
                  </Button>
                  <Link to="/events">
                    <Button variant="outline" size="lg" className="!text-navy-950 !border-navy-950 hover:!bg-navy-950 hover:!text-gold-400">
                      View Event Calendar
                    </Button>
                  </Link>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>

        <WaveDivider fillColor="#ffffff" />
      </div>

      {/* SECTION 7: UPCOMING EVENT HERO CARD — Redesigned after uploaded image with dynamic events */}
      <section className="bg-slate-50 py-16">
        <EventCountdown
          events={events}
          onSelectEvent={onSelectEvent}
          isLoading={isLoadingEvents && events.length === 0}
        />
      </section>

      {/* SECTION 8: TESTIMONIES (5-CARD MIRACLE DISPLAY) */}
      <TestimoniesSection testimonies={testimonies.slice(0, 5)} />

      {/* SECTION 9: LATEST NEWS */}
      <LatestNewsSection newsItems={newsItems.slice(0, 3)} />

      {/* SECTION 10: LOCATION & SERVICE TIMES (WARM LIQUID GLASS) */}
      <section className="py-24 bg-[#F9F8F6] relative overflow-hidden">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 text-[11px] font-black uppercase tracking-widest bg-gold-500/20 text-gold-600 rounded-full border border-gold-500/30">
              SANCTUARY LOCATION & SERVICE HOURS
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase font-display text-[#1A1A1A]">
              Worship With Us
            </h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Step into God's presence, experience authentic fellowship, and encounter the supernatural power of the Holy Spirit.
            </p>
          </div>

          {/* Warm Liquid Glass Container */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Map Embed */}
              <FadeIn direction="left" className="lg:col-span-7">
                <div className="h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/40 shadow-xl relative group">
                  <iframe
                    title="Church Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104928.34791350478!2d-92.38573199999999!3d34.7464809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d2a138084a7e93%3A0x6b5a38ef2f9a120!2sLittle%20Rock%2C%20AR!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                    className="w-full h-full border-0 group-hover:brightness-105 transition-all"
                    loading="lazy"
                  ></iframe>

                  {/* Floating Glass Badge */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/70 backdrop-blur-md border border-white/60 p-4 rounded-2xl text-[#1A1A1A] shadow-lg">
                    <div className="flex items-center gap-2 text-gold-600 text-xs font-black uppercase tracking-wider mb-0.5">
                      <MapPin className="w-4 h-4 text-gold-500" />
                      <span>Soldiers of Jesus Christ Sanctuary</span>
                    </div>
                    <p className="text-xs text-slate-600">1709 John Barrow Rd, Little Rock, AR 72204</p>
                  </div>
                </div>
              </FadeIn>

              {/* Service Details in Warm Glass Cards */}
              <FadeIn direction="right" delay={0.2} className="lg:col-span-5">
                <div className="space-y-4">
                  
                  {/* Saturday 7th Day Sabbath Worship */}
                  <div className="bg-white/50 backdrop-blur-md border border-gold-500/30 p-5 rounded-2xl space-y-1.5 hover:bg-white/70 hover:border-gold-400 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-gold-600 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20">
                        7th Day — The Sabbath
                      </span>
                      <span className="text-xs font-bold text-gold-600">Saturdays</span>
                    </div>
                    <h4 className="font-extrabold text-base text-[#1A1A1A] uppercase font-display">
                      Sabbath Miracle & Holy Worship Service
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Holy Ghost Power, Miracle Services, and Holy Worship. "Thou shall keep the Sabbath day holy. We always stand by the Truth!"
                    </p>
                  </div>

                  {/* Sunday Activities */}
                  <div className="bg-white/50 backdrop-blur-md border border-white/70 p-5 rounded-2xl space-y-1.5 hover:bg-white/70 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        Sunday Schedule
                      </span>
                      <span className="text-xs font-bold text-slate-500">Sundays</span>
                    </div>
                    <h4 className="font-extrabold text-base text-[#1A1A1A] uppercase font-display">
                      Services & Activities
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Sunday services and ministry fellowship activities are as advertised.
                    </p>
                  </div>

                  {/* Midweek Prayer */}
                  <div className="bg-white/50 backdrop-blur-md border border-white/70 p-5 rounded-2xl space-y-1.5 hover:bg-white/70 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        Midweek Prayer Watch
                      </span>
                      <span className="text-xs font-bold text-slate-500">Wednesdays @ 7:00 PM</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Corporate intercessory prayer and deep verse-by-verse scripture study.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href="https://maps.google.com/?q=1709+John+Barrow+Rd+Little+Rock+AR+72204"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gold-500 text-navy-950 font-bold uppercase text-xs tracking-wider shadow-gold hover:bg-gold-400 transition-all"
                    >
                      <MapPin className="w-4 h-4" /> Get Directions
                    </a>
                    <Button variant="navy" size="md" onClick={onOpenPlanVisitModal}>
                      Plan Your Visit
                    </Button>
                  </div>

                </div>
              </FadeIn>

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
