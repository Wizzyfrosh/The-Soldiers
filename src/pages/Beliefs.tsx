import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Shield } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/common/Animations';

export const Beliefs: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const beliefs = [
    {
      title: "1. THE UNITY OF THE BODY OF CHRIST (ECUMENISM)",
      scripture: "John 17:6-12, Philippians 2:1-30, Ephesians 4:5-32, Matthew 24:14",
      content: "We believe in the unity of the body of Jesus Christ; Christianity – The Church. We welcome Catholicism, Charismatism, Pentecostalism, Evangelism, and all other Christian theological parts of the same body of Christ. Every believer's body carries the temple of God in which the Holy Trinity dwells."
    },
    {
      title: "2. THE 7TH DAY SABBATH & HOLY WORSHIP",
      scripture: "Exodus 20:8-11, Mark 2:27-28",
      content: "Our worship services are held on Saturdays; the seventh day—The Sabbath (Holy Ghost Power, Miracle Services, and Holy Worship). 'Thou shall keep the Sabbath day holy.' We always stand by the Truth! Sunday services and activities are as advertised."
    },
    {
      title: "3. THE HOLY BIBLE",
      scripture: "2 Timothy 3:16-17",
      content: "We believe the Bible to be the inspired, infallible, authoritative Word of God. It is our supreme guide for faith, doctrine, and daily life."
    },
    {
      title: "4. THE HOLY TRINITY",
      scripture: "Matthew 28:19",
      content: "We believe in one eternal God, existing in three persons: God the Father, God the Son (Jesus Christ), and God the Holy Spirit."
    },
    {
      title: "5. THE LORD JESUS CHRIST",
      scripture: "John 14:6, 1 Corinthians 15:3-4",
      content: "We believe in the deity of Christ, His virgin birth, His sinless life, His miracles, His vicarious and atoning death on the cross, His bodily resurrection, His ascension to the right hand of the Father, and His personal return in power and glory."
    },
    {
      title: "6. SALVATION BY GRACE THROUGH FAITH",
      scripture: "Ephesians 2:8-9",
      content: "Salvation is received through repentance from sin and faith in Jesus Christ alone. It is a free gift of God, not earned by human good works."
    },
    {
      title: "7. THE HOLY SPIRIT & DEMONSTRATION OF POWER",
      scripture: "Acts 1:8, 1 Corinthians 2:4-5, John 20:21-23",
      content: "We believe in the present ministry of the Holy Spirit, who indwells Christians, empowering them to live a holy life, exercise spiritual gifts, heal the sick, and witness boldly with demonstrations of the Spirit's power."
    },
    {
      title: "8. SPIRITUAL WARFARE & THE SOLDIER'S CALLING",
      scripture: "2 Timothy 2:1-7, Ephesians 6:10-18",
      content: "We believe believers are called to endure hardship as good soldiers of Christ Jesus, standing firm against darkness with truth, righteousness, faith, salvation, and the sword of the Word."
    }
  ];

  return (
    <div className="py-12 bg-slate-950 text-white min-h-screen">
      
      {/* Header */}
      <section className="relative bg-navy-950 text-white py-20 px-4 text-center border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/15 via-navy-950/80 to-navy-950 pointer-events-none"></div>

        <FadeIn className="relative z-10 max-w-4xl mx-auto space-y-3">
          <span className="inline-block px-4 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-extrabold text-xs uppercase tracking-widest">
            DOCTRINAL STANDING & BIBLICAL TRUTH
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-white">
            What We Believe
          </h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto font-light">
            Grounded in eternal Scripture, standing firm in divine truth and Kingdom unity.
          </p>
        </FadeIn>
      </section>

      {/* Accordion List in Liquid Glass */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <StaggerContainer className="space-y-4">
          {beliefs.map((b, idx) => {
            const isOpen = openIdx === idx;
            return (
              <StaggerItem key={idx}>
                <div
                  className="liquid-glass rounded-2xl border border-white/15 overflow-hidden shadow-xl transition-all"
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gold-400 uppercase tracking-wider block">{b.scripture}</span>
                      <h3 className="text-base sm:text-lg font-black uppercase font-display text-white">{b.title}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-navy-900 border border-gold-500/30 text-gold-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-white/10 text-sm text-slate-200 leading-relaxed liquid-glass-card rounded-b-2xl">
                      <p>{b.content}</p>
                    </div>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

    </div>
  );
};
