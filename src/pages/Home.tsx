import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Calendar, MapPin, ArrowRight, Shield, Heart, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/common/Button';
import { SectionHeader } from '../components/common/SectionHeader';
import { WaveDivider } from '../components/common/WaveDivider';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn } from '../components/common/Animations';
import { HeroSlideshow } from '../components/home/HeroSlideshow';
import { store } from '../data/store';
import { ChurchEvent, Sermon } from '../types';

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
  const [events] = useState<ChurchEvent[]>(store.getEvents());
  const [sermons] = useState<Sermon[]>(store.getSermons());
  const siteContent = store.getSiteContent();

  const ministries = [
    { name: "Men's Ministry", subtitle: "Mighty Men of Valor", img: "/images/mens.jpg", path: "/ministries/mens" },
    { name: "Women's Ministry", subtitle: "Daughters of Destiny", img: "/images/womens.jpg", path: "/ministries/womens" },
    { name: "Youth & Teens", subtitle: "IGNITE Generation", img: "/images/youth.jpg", path: "/ministries/youth" },
    { name: "Children's Ministry", subtitle: "Kingdom Kids Academy", img: "/images/children.jpg", path: "/ministries/children" },
    { name: "Outreach & Missions", subtitle: "Food Bank & Evangelism", img: "/images/outreach.jpg", path: "/ministries/outreach" },
    { name: "Worship & Arts", subtitle: "Anointed Praise Team", img: "/images/pastor.jpg", path: "/ministries" }
  ];

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

      {/* SECTION 4: WELCOME / ABOUT BRIEF SPLIT */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <FadeIn direction="left">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-navy-900 group">
                <img
                  src="/images/pastor.jpg"
                  alt="Pastor Preaching"
                  className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent p-6 flex flex-col justify-end">
                  <span className="text-gold-400 font-bold text-xs uppercase tracking-widest">Lead Pastor</span>
                  <h4 className="text-xl font-extrabold text-white uppercase font-display">Pastor David & Sarah Vance</h4>
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

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-navy-900 text-white rounded-xl border-l-4 border-gold-500">
                  <h5 className="font-extrabold text-sm font-display uppercase text-gold-400">Our Vision</h5>
                  <p className="text-xs text-slate-300 mt-1">Strong in grace, enduring as a good soldier of Christ Jesus. (2 Tim 2:1-7)</p>
                </div>
                <div className="p-4 bg-navy-900 text-white rounded-xl border-l-4 border-gold-500">
                  <h5 className="font-extrabold text-sm font-display uppercase text-gold-400">Our Mission</h5>
                  <p className="text-xs text-slate-300 mt-1">Appointed to bear lasting fruit in the power of the Holy Spirit. (John 15:16-17)</p>
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

      {/* SECTION 5: "FIND YOUR PLACE. SERVE WITH PURPOSE." (MINISTRY GRID - LIQUID GLASS) */}
      <section className="py-24 bg-gradient-to-b from-[#0A1D37] via-[#071324] to-[#0A1D37] relative overflow-hidden text-white">
        {/* Ambient glow */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <FadeIn>
            <SectionHeader
              badge="DISCOVER YOUR PLACE"
              title="Find Your Place. Serve with Purpose."
              subtitle="Every soldier needs a battalion. Discover where you fit in the fight to grow, serve, and stand firm."
            />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((min, idx) => (
              <StaggerItem key={idx}>
                <div
                  className="group relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/15 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-gold-400 flex flex-col justify-between h-full"
                >
                  <div className="h-60 overflow-hidden relative">
                    <img
                      src={min.img}
                      alt={min.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  </div>

                  <div className="p-6 relative z-10 -mt-16 space-y-2">
                    <span className="text-[11px] font-bold text-gold-400 uppercase tracking-widest block drop-shadow">{min.subtitle}</span>
                    <h3 className="text-2xl font-black uppercase font-display text-white group-hover:text-gold-300 transition-colors drop-shadow-md">
                      {min.name}
                    </h3>
                    
                    <div className="pt-3">
                      <Link to={min.path}>
                        <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gold-400 group-hover:text-gold-300">
                          Explore Ministry <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

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

      {/* SECTION 7: UPCOMING EVENTS & REGISTRATION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          
          <FadeIn>
            <SectionHeader
              badge="UPCOMING EVENTS"
              title="#SoldiersInAction Events"
              subtitle="We invite you, your family, and friends to join us at our upcoming events."
            />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {events.map((ev) => (
              <StaggerItem key={ev.id}>
                <div className="bg-navy-900 text-white rounded-2xl overflow-hidden shadow-xl border border-navy-800 flex flex-col justify-between group h-full">
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img src={ev.image} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute top-3 left-3 bg-gold-500 text-navy-950 font-black text-[10px] uppercase px-2.5 py-1 rounded-md shadow">
                        {ev.category}
                      </span>
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-1.5 text-gold-400 text-xs font-bold">
                        <Calendar className="w-3.5 h-3.5" /> {ev.date}
                      </div>
                      <h4 className="font-extrabold text-base uppercase font-display line-clamp-2 text-white group-hover:text-gold-400 transition-colors">
                        {ev.title}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-2">{ev.description}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Button
                      variant="gold"
                      size="sm"
                      className="w-full"
                      onClick={() => onSelectEvent(ev)}
                    >
                      Register Now
                    </Button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.3}>
            <div className="mt-12 text-center">
              <Link to="/events">
                <Button variant="navy" size="md">
                  View All Upcoming Events & Conferences
                </Button>
              </Link>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* SECTION 8: LOCATION & SERVICE TIMES (LIQUID GLASS UI) */}
      <section className="py-24 relative overflow-hidden text-white bg-[#071324]">
        {/* Subtle background image texture with dark navy overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/worship_hero.jpg"
            alt="Sanctuary background"
            className="w-full h-full object-cover object-center opacity-15"
          />
          <div className="absolute inset-0 bg-[#0A1D37]/90 backdrop-blur-sm"></div>
        </div>

        {/* Ambient lighting */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none z-0"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-800/20 rounded-full blur-3xl pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 text-[11px] font-black uppercase tracking-widest bg-navy-900 border border-gold-500/40 text-gold-400 rounded-full">
              SANCTUARY LOCATION & SERVICE HOURS
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase font-display text-white">
              Worship With Us
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Step into God's presence, experience authentic fellowship, and encounter the supernatural power of the Holy Spirit.
            </p>
          </div>

          {/* Liquid Glass Container */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Interactive High-End Liquid Glass Map Embed */}
              <FadeIn direction="left" className="lg:col-span-7">
                <div className="h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative group">
                  <iframe
                    title="Church Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104928.34791350478!2d-92.38573199999999!3d34.7464809!2m3!1f0!0f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d2a138084a7e93%3A0x6b5a38ef2f9a120!2sLittle%20Rock%2C%20AR!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                    className="w-full h-full border-0 filter grayscale contrast-125 brightness-90 group-hover:brightness-95 transition-all"
                    loading="lazy"
                  ></iframe>

                  {/* Floating Liquid Glass Badge */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-white shadow-xl">
                    <div className="flex items-center gap-2 text-gold-400 text-xs font-black uppercase tracking-wider mb-0.5">
                      <MapPin className="w-4 h-4 text-gold-400" />
                      <span>Soldiers of Jesus Christ Sanctuary</span>
                    </div>
                    <p className="text-xs text-slate-200">1709 John Barrow Rd, Little Rock, AR 72204</p>
                  </div>
                </div>
              </FadeIn>

              {/* Service Details in Liquid Glass Cards */}
              <FadeIn direction="right" delay={0.2} className="lg:col-span-5">
                <div className="space-y-4">
                  
                  {/* Saturday 7th Day Sabbath Worship */}
                  <div className="bg-white/10 backdrop-blur-md border border-gold-500/40 p-5 rounded-2xl space-y-1.5 hover:border-gold-400 transition-colors shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20">
                        7th Day — The Sabbath
                      </span>
                      <span className="text-xs font-bold text-gold-300">Saturdays</span>
                    </div>
                    <h4 className="font-extrabold text-base text-white uppercase font-display">
                      Sabbath Miracle & Holy Worship Service
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Holy Ghost Power, Miracle Services, and Holy Worship. "Thou shall keep the Sabbath day holy. We always stand by the Truth!"
                    </p>
                  </div>

                  {/* Sunday Activities */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl space-y-1.5 hover:border-white/30 transition-colors shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                        Sunday Schedule
                      </span>
                      <span className="text-xs font-bold text-slate-300">Sundays</span>
                    </div>
                    <h4 className="font-extrabold text-base text-white uppercase font-display">
                      Services & Activities
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Sunday services and ministry fellowship activities are as advertised.
                    </p>
                  </div>

                  {/* Midweek Prayer */}
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl space-y-1.5 hover:border-white/30 transition-colors shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                        Midweek Prayer Watch
                      </span>
                      <span className="text-xs font-bold text-slate-300">Wednesdays @ 7:00 PM</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
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
                    <Button variant="outline" size="md" onClick={onOpenPlanVisitModal}>
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
