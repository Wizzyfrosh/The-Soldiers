import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
import { store } from '../data/store';
import { FadeIn } from '../components/common/Animations';

interface ContactProps {
  onSuccess: (msg: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      store.addSubmission({
        type: 'CONTACT',
        name,
        email,
        phone,
        message
      });
      setIsSubmitting(false);
      setSent(true);
      onSuccess(`Thank you ${name}! Your message has been sent to our ministry team.`);
    }, 800);
  };

  return (
    <div className="py-12 bg-slate-950 text-white min-h-screen">
      
      {/* Header */}
      <section className="relative bg-navy-950 text-white py-20 px-4 text-center border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/15 via-navy-950/80 to-navy-950 pointer-events-none"></div>

        <FadeIn className="relative z-10 max-w-4xl mx-auto space-y-3">
          <span className="inline-block px-4 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 font-extrabold text-xs uppercase tracking-widest">
            GET IN TOUCH WITH LEADERSHIP
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display tracking-tight text-white">
            Contact Our Ministry Team
          </h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto font-light">
            We are here to serve you in truth and love. Reach out with any questions or prayer needs.
          </p>
        </FadeIn>
      </section>

      {/* Main Content with Liquid Glass UI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <FadeIn direction="right" className="space-y-6">
              <h2 className="text-3xl font-black uppercase font-display text-white">Church Info & Location</h2>

              <div className="space-y-4 text-sm">
                <div className="p-5 liquid-glass rounded-2xl border border-white/15 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-display uppercase text-sm">Sanctuary Address</h4>
                    <p className="text-xs text-slate-300 mt-0.5">1709 John Barrow Rd, Little Rock, AR 72204</p>
                  </div>
                </div>

                <div className="p-5 liquid-glass rounded-2xl border border-white/15 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-display uppercase text-sm">Worship Times</h4>
                    <p className="text-xs text-gold-300 font-medium mt-0.5">Saturdays (7th Day Sabbath): Holy Worship & Power</p>
                    <p className="text-xs text-slate-300">Sundays: Activities as Advertised</p>
                    <p className="text-xs text-slate-400">Wednesdays: Prayer Watch @ 7:00 PM</p>
                  </div>
                </div>

                <div className="p-5 liquid-glass rounded-2xl border border-white/15 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-display uppercase text-sm">Church Phone</h4>
                    <p className="text-xs text-slate-300 mt-0.5">(501) 555-0199</p>
                  </div>
                </div>

                <div className="p-5 liquid-glass rounded-2xl border border-white/15 flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white font-display uppercase text-sm">Email Address</h4>
                    <p className="text-xs text-slate-300 mt-0.5">info@soldiersofjesuschrist.org</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <FadeIn direction="left">
              <div className="liquid-glass rounded-3xl p-8 sm:p-10 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-black uppercase font-display text-white mb-6">Send A Direct Message</h3>

                {sent ? (
                  <div className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h4 className="text-2xl font-extrabold text-white uppercase font-display">Message Sent!</h4>
                    <p className="text-xs text-slate-300 max-w-md mx-auto">
                      Thank you for reaching out. A pastor or ministry team leader will reply to <span className="text-gold-400 font-bold">{email}</span> shortly.
                    </p>
                    <Button variant="gold" size="md" onClick={() => setSent(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Your Name</label>
                      <input
                        type="text"
                        placeholder="John Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-navy-950/80 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Email Address</label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2.5 bg-navy-950/80 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Phone (Optional)</label>
                        <input
                          type="tel"
                          placeholder="(501) 555-0199"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-2.5 bg-navy-950/80 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Your Message</label>
                      <textarea
                        rows={5}
                        placeholder="How can we assist, pray with, or serve you today?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-4 py-2.5 bg-navy-950/80 border border-white/15 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-gold-500"
                        required
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      className="w-full mt-2"
                      disabled={isSubmitting || !name || !email || !message}
                      icon={<Send className="w-4 h-4" />}
                    >
                      {isSubmitting ? 'Sending Message...' : 'Submit Message'}
                    </Button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

    </div>
  );
};
