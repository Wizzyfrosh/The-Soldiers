import React, { useState } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { store } from '../../data/store';
import { SiteContent } from '../../types';
import { Button } from '../../components/common/Button';

export const AdminContent: React.FC = () => {
  const [content, setContent] = useState<SiteContent>(store.getSiteContent());
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateSiteContent(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase font-display text-navy-950">CMS Content Manager</h2>
          <p className="text-xs text-slate-500">Edit homepage headlines, announcement tickers, and seasonal highlight copy in real-time.</p>
        </div>
        {saved && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300">
            <CheckCircle2 className="w-4 h-4" /> Live Content Updated!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border-2 border-slate-200 shadow-sm space-y-6">
        
        {/* Hero Section Copy */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-sm uppercase text-gold-600 font-display border-b border-slate-100 pb-2">
            Homepage Hero Section
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Hero Main Title</label>
            <input
              type="text"
              value={content.heroTitle}
              onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-navy-950"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Hero Subheadline</label>
            <input
              type="text"
              value={content.heroSubheadline}
              onChange={(e) => setContent({ ...content, heroSubheadline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Gold Announcement Ticker Text</label>
            <input
              type="text"
              value={content.tickerMessage}
              onChange={(e) => setContent({ ...content, tickerMessage: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold font-mono text-navy-950"
            />
          </div>
        </div>

        {/* Seasonal Highlight Block Copy */}
        <div className="space-y-4 pt-4">
          <h3 className="font-extrabold text-sm uppercase text-gold-600 font-display border-b border-slate-100 pb-2">
            Yellow Seasonal Highlight Banner
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Seasonal Title</label>
            <input
              type="text"
              value={content.seasonalTitle}
              onChange={(e) => setContent({ ...content, seasonalTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-navy-950"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Seasonal Body Copy</label>
            <textarea
              rows={3}
              value={content.seasonalBody}
              onChange={(e) => setContent({ ...content, seasonalBody: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
            ></textarea>
          </div>
        </div>

        <Button type="submit" variant="gold" size="lg" icon={<Save className="w-5 h-5" />}>
          Save & Publish CMS Changes
        </Button>
      </form>

    </div>
  );
};
