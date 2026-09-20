import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/common/Animations';

export const Ministries: React.FC = () => {
  const items = [
    { title: "Men's Ministry (The Mighty Men)", subtitle: "Brotherhood, Leadership, Discipleship", img: "/images/mens.jpg", link: "/ministries/mens", desc: "Equipping men to lead their families and communities with honor and godly strength." },
    { title: "Women's Ministry (Women of Valor)", subtitle: "Sisterhood, Mentorship, Prayer", img: "/images/womens.jpg", link: "/ministries/womens", desc: "Empowering women to walk in their royal identity, spiritual gifts, and kingdom destiny." },
    { title: "Youth & Teen Ministry (IGNITE)", subtitle: "Middle & High School Fellowship", img: "/images/youth.jpg", link: "/ministries/youth", desc: "High-energy worship, relevant message, and authentic Christian community for Gen Z." },
    { title: "Children's Ministry (Kingdom Kids)", subtitle: "Infants through 5th Grade", img: "/images/children.jpg", link: "/ministries/children", desc: "Safe, exciting, scripture-filled environment where kids fall in love with Jesus." },
    { title: "Outreach & Food Pantry", subtitle: "Local Evangelism & Care", img: "/images/outreach.jpg", link: "/ministries/outreach", desc: "Feeding families in need and taking the gospel out into the streets of our city." },
    { title: "Worship & Creative Arts", subtitle: "Music, Tech, Media", img: "/images/pastor.jpg", link: "/contact", desc: "Creating an atmosphere for God's glory through sound, lights, video, and worship." }
  ];

  return (
    <div className="py-12 bg-slate-50">
      
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">MINISTRIES OVERVIEW</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Find Your Place. Serve With Purpose.</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Discover where you fit into the battalion. There is a place for every age and season of life.
          </p>
        </FadeIn>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((m, idx) => (
            <StaggerItem key={idx}>
              <div className="bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-lg group hover:border-gold-500 transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="h-56 overflow-hidden relative">
                    <img src={m.img} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent"></div>
                    <span className="absolute bottom-3 left-3 text-gold-400 font-extrabold text-xs uppercase tracking-wider">{m.subtitle}</span>
                  </div>
                  <div className="p-6 space-y-2">
                    <h3 className="text-xl font-extrabold uppercase font-display text-navy-950 group-hover:text-gold-600 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link to={m.link}>
                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase text-navy-900 group-hover:text-gold-600">
                      Explore Ministry Page <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

    </div>
  );
};
