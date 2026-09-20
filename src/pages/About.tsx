import React from 'react';
import { Shield, Target, BookOpen, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { Button } from '../components/common/Button';
import { Link } from 'react-router-dom';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/common/Animations';

export const About: React.FC = () => {
  return (
    <div className="py-12 bg-slate-950 text-white min-h-screen">
      
      {/* Hero Header with Liquid Glass UI */}
      <section className="relative bg-navy-950 text-white py-20 px-4 text-center border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/15 via-navy-950/80 to-navy-950 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <FadeIn className="relative z-10 max-w-4xl mx-auto space-y-4">
          <img src="/images/logo.png" alt="Logo" className="h-16 w-auto mx-auto object-contain drop-shadow-lg mb-2" />
          <span className="inline-block px-4 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-extrabold text-xs uppercase tracking-widest">
            ABOUT SOLDIERS OF JESUS CHRIST
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-white">
            The Unity of The Body of Christ
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            "That they may all be one, just as you, Father, are in me, and I in you." — John 17:21
          </p>
        </FadeIn>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Core Foundational Belief Statement (About Us) */}
        <FadeIn>
          <div className="liquid-glass rounded-3xl p-8 sm:p-12 border border-gold-500/40 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold-500 text-navy-950 flex items-center justify-center font-black shadow-gold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-gold-400 tracking-widest">FOUNDATIONAL DOCTRINE</span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase font-display text-white">
                  About Our Church & Fellowship
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
              <p>
                We believe in the unity of the body of Jesus Christ; Christianity – The Church. &lt; John 17:6-12, Philippians 2:1-30, Ephesians 4:5-32, Matthew 24:14. We welcome Catholicism, Charismatism, Pentecostalism, Evangelism, and other Christian theological part of the same body of Christ (Ecumenism); The Church.
              </p>
              <p>
                We welcome all the members of the personal Churches as a human body carrying the temple of God in which the Holy Trinity dwells and each body serving as part of the same body of Jesus Christ – The Church. You may remain in your home Church and still be a member of our ministry.
              </p>
              <div className="liquid-glass-gold p-6 rounded-2xl border border-gold-400/50 space-y-2 mt-4">
                <span className="text-xs font-black uppercase tracking-widest text-gold-300 block">
                  HOLY WORSHIP & SABBATH TRUTH
                </span>
                <p className="text-white font-medium text-base leading-relaxed">
                  As you might have noticed, our worship services are on Saturdays; the seventh day—The Sabbath (Holy Ghost Power, Miracle Services, and Holy Worship). Thou shall keep the Sabbath day holy. We always stand by the Truth! Sunday Services and activities are as advertised.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Mission & Vision Split in Sleek Liquid Glass */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Mission Statement */}
          <FadeIn direction="left">
            <div className="liquid-glass rounded-3xl p-8 sm:p-10 space-y-6 h-full flex flex-col justify-between border border-white/20 hover:border-gold-500/60 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center font-bold">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-gold-400 uppercase tracking-widest">DIVINE CALLING</span>
                    <h3 className="text-2xl font-black uppercase font-display text-white">Mission Statement</h3>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto pr-2">
                  <blockquote className="border-l-2 border-gold-400 pl-4 italic text-gold-200/90 font-medium">
                    “You did not choose me, but I chose you and appointed you so that you might go and bear fruit—fruit that will last—and so that whatever you ask in my name the Father will give you. This is my command: Love each other.”
                    <span className="block not-italic font-bold text-gold-400 mt-1">— John 15:16-17</span>
                  </blockquote>

                  <blockquote className="border-l-2 border-gold-400/60 pl-4 italic text-slate-200">
                    “I have revealed you to those whom you gave me out of the world. They were yours; you gave them to me and they have obeyed your word. Now they know that everything you have given me comes from you. For I gave them the words you gave me and they accepted them. They knew with certainty that I came from you, and they believed that you sent me. I pray for them. I am not praying for the world, but for those you have given me, for they are yours. All I have is yours, and all you have is mine. And glory has come to me through them. I will remain in the world no longer, but they are still in the world, and I am coming to you. Holy Father, protect them by the power of your name, the name you gave me, so that they may be one as we are one. While I was with them, I protected them and kept them safe by that name you gave me. None has been lost except the one doomed to destruction so that Scripture would be fulfilled.”
                    <span className="block not-italic font-bold text-gold-400 mt-1">— John 17:6-12</span>
                  </blockquote>

                  <blockquote className="border-l-2 border-gold-400/60 pl-4 italic text-slate-200">
                    “Again Jesus said, ‘Peace be with you! As the Father has sent me, I am sending you.’ And with that he breathed on them and said, ‘Receive the Holy Spirit. If you forgive anyone’s sins, their sins are forgiven; if you do not forgive them, they are not forgiven.’”
                    <span className="block not-italic font-bold text-gold-400 mt-1">— John 20:21-23</span>
                  </blockquote>

                  <blockquote className="border-l-2 border-gold-400/60 pl-4 italic text-slate-200">
                    “My message and my preaching were not with wise and persuasive words, but with a demonstration of the Spirit’s power, so that your faith might not rest on human wisdom, but on God’s power.”
                    <span className="block not-italic font-bold text-gold-400 mt-1">— 1 Corinthians 2:4-5</span>
                  </blockquote>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Fruit That Lasts • Power of The Spirit
                </span>
              </div>
            </div>
          </FadeIn>

          {/* Vision */}
          <FadeIn direction="right">
            <div className="liquid-glass rounded-3xl p-8 sm:p-10 space-y-6 h-full flex flex-col justify-between border border-white/20 hover:border-gold-500/60 transition-all">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center font-bold">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-gold-400 uppercase tracking-widest">KINGDOM VISION</span>
                    <h3 className="text-2xl font-black uppercase font-display text-white">Vision</h3>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed max-h-[500px] overflow-y-auto pr-2">
                  <blockquote className="border-l-2 border-gold-400 pl-4 italic text-gold-200/90 font-medium">
                    “You then, my son, be strong in the grace that is in Christ Jesus. And the things you have heard me say in the presence of many witnesses entrust to reliable people who will also be qualified to teach others. Join with me in suffering, like a good soldier of Christ Jesus. No one serving as a soldier gets entangled in civilian affairs, but rather tries to please his commanding officer. Similarly, anyone who competes as an athlete does not receive the victor’s crown except by competing according to the rules. The hardworking farmer should be the first to receive a share of the crops. Reflect on what I am saying, for the Lord will give you insight into all this.”
                    <span className="block not-italic font-bold text-gold-400 mt-1">— 2 Timothy 2:1-7</span>
                  </blockquote>

                  <blockquote className="border-l-2 border-gold-400/60 pl-4 italic text-slate-200">
                    “Paul, a prisoner of Christ Jesus, and Timothy our brother, To Philemon our dear friend and fellow worker— also to Apphia our sister and Archippus our fellow soldier—and to the church that meets in your home:”
                    <span className="block not-italic font-bold text-gold-400 mt-1">— Philemon 1:1-2</span>
                  </blockquote>

                  <blockquote className="border-l-2 border-gold-400/60 pl-4 italic text-slate-200">
                    “But I think it is necessary to send back to you Epaphroditus, my brother, co-worker and fellow soldier, who is also your messenger, whom you sent to take care of my needs…”
                    <span className="block not-italic font-bold text-gold-400 mt-1">— Philippians 2:25-30</span>
                  </blockquote>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Good Soldiers of Jesus Christ
                </span>
              </div>
            </div>
          </FadeIn>

        </div>

        {/* 4 Pillars in Frosted Liquid Glass */}
        <div>
          <FadeIn>
            <SectionHeader
              badge="KINGDOM PILLARS"
              title="What We Stand On"
              subtitle="Four foundational pillars anchored in Scripture and Spirit power."
            />
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {[
              { title: "ECUMENISM & UNITY", desc: "Welcoming all theological branches into the singular body of Jesus Christ – The Church." },
              { title: "SABBATH WORSHIP", desc: "Honoring the 7th Day Sabbath with Holy Ghost power, miracle services, and true worship." },
              { title: "DISCIPLESHIP & WARFARE", desc: "Standing firm as good soldiers of Jesus Christ, unentangled by the affairs of this world." },
              { title: "DEMONSTRATION OF POWER", desc: "Preaching backed by the tangible power and presence of the Holy Spirit." }
            ].map((p, idx) => (
              <StaggerItem key={idx}>
                <div className="liquid-glass p-6 rounded-2xl border border-white/15 space-y-3 h-full hover:border-gold-400/60 transition-colors">
                  <div className="text-gold-400 font-extrabold text-lg">0{idx + 1}.</div>
                  <h4 className="font-extrabold text-base uppercase font-display text-gold-400">{p.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Call to Action Banner */}
        <FadeIn>
          <div className="liquid-glass rounded-3xl p-10 sm:p-14 text-center space-y-6 border border-gold-500/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <span className="text-gold-400 text-xs font-black uppercase tracking-widest">
              JOIN OUR FELLOWSHIP
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-display text-white">
              Ready To Stand With Us In Truth?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              You are welcome to remain in your home church and still be an active soldier in this ministry. Join us this Saturday for Sabbath Worship.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link to="/plan-a-visit">
                <Button variant="gold" size="lg">Plan A Visit</Button>
              </Link>
              <Link to="/beliefs">
                <Button variant="outline" size="lg">Read Our Beliefs</Button>
              </Link>
            </div>
          </div>
        </FadeIn>

      </section>
    </div>
  );
};
