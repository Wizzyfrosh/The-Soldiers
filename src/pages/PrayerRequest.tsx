import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '../components/common/Button';
import { store } from '../data/store';
import { FadeIn } from '../components/common/Animations';

interface PrayerRequestProps {
  onSuccess: (msg: string) => void;
}

export const PrayerRequest: React.FC<PrayerRequestProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [requestText, setRequestText] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !requestText) return;

    setIsSubmitting(true);
    setTimeout(() => {
      store.addSubmission({
        type: 'PRAYER_REQUEST',
        name,
        email,
        message: requestText,
        isPrivate
      });
      setIsSubmitting(false);
      setSubmitted(true);
      onSuccess(`Your prayer request has been submitted to the intercessory team.`);
    }, 1000);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn className="max-w-4xl mx-auto space-y-3">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">INTERCESSORY PRAYER WATCH</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Submit A Prayer Request</h1>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            "The effectual fervent prayer of a righteous man availeth much." — James 5:16
          </p>
        </FadeIn>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16">
        <FadeIn>
          <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-xl">
            
            {submitted ? (
              <div className="text-center space-y-4 py-8">
                <div className="w-16 h-16 bg-gold-500/20 text-gold-600 rounded-full flex items-center justify-center mx-auto border border-gold-500/40">
                  <Shield className="w-10 h-10 text-gold-500" />
                </div>
                <h3 className="text-2xl font-black uppercase font-display text-navy-950">We Are Praying With You</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your prayer request has been logged. Our pastoral staff and intercessory prayer watch team will be standing in faith for your breakthrough.
                </p>
                <Button variant="navy" size="md" onClick={() => setSubmitted(false)}>
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-navy-900 text-white rounded-xl text-xs space-y-1">
                  <span className="font-bold text-gold-400 uppercase">Confidentiality Guarantee</span>
                  <p className="text-slate-300">You can choose whether your prayer request is kept strictly confidential with Prophet Ebelechukwu or shared with our trusted intercessory team.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-navy-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-navy-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Prayer Details</label>
                  <textarea
                    rows={5}
                    placeholder="Share your prayer request, healing need, or testimony..."
                    value={requestText}
                    onChange={(e) => setRequestText(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-navy-900"
                    required
                  ></textarea>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="confidential"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-4 h-4 accent-gold-500 rounded"
                  />
                  <label htmlFor="confidential" className="text-xs text-slate-700 font-medium">
                    Keep strictly confidential (Pastors Only) 🔒
                  </label>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  className="w-full mt-2"
                  disabled={isSubmitting || !name || !requestText}
                >
                  {isSubmitting ? 'Submitting Prayer Request...' : 'Submit Prayer Request'}
                </Button>
              </form>
            )}

          </div>
        </FadeIn>
      </section>

    </div>
  );
};
