import React, { useState, useEffect } from 'react';
import { Play, Search, Filter } from 'lucide-react';
import { store } from '../data/store';
import { Sermon } from '../types';
import { Button } from '../components/common/Button';
import { FadeIn, StaggerContainer, StaggerItem } from '../components/common/Animations';

interface SermonsProps {
  onSelectSermon: (sermon: Sermon) => void;
}

const getSermonThumbnail = (sermon: Sermon): string => {
  if (sermon.thumbnail) return sermon.thumbnail;
  if (sermon.youtubeId) return `https://img.youtube.com/vi/${sermon.youtubeId}/hqdefault.jpg`;
  return '/images/worship_hero.jpg'; // fallback for uploaded video sermons
};

const getSermonHeroThumbnail = (sermon: Sermon): string => {
  if (sermon.thumbnail) return sermon.thumbnail;
  if (sermon.youtubeId) return `https://img.youtube.com/vi/${sermon.youtubeId}/maxresdefault.jpg`;
  return '/images/worship_hero.jpg';
};

export const Sermons: React.FC<SermonsProps> = ({ onSelectSermon }) => {
  const [sermons, setSermons] = useState<Sermon[]>(store.getSermons());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('All');

  // Subscribe to store for real-time updates and sync with backend
  useEffect(() => {
    store.syncWithBackend();
    const unsubscribe = store.subscribe(() => {
      setSermons(store.getSermons());
    });
    return unsubscribe;
  }, []);

  const seriesList = ['All', ...Array.from(new Set(sermons.map(s => s.series)))];


  const filteredSermons = sermons.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeries = selectedSeries === 'All' || s.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <section className="bg-navy-950 text-white py-16 px-4 text-center border-b-4 border-gold-500">
        <FadeIn>
          <div className="max-w-4xl mx-auto space-y-3">
            <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">MEDIA ARCHIVE</span>
            <h1 className="text-4xl md:text-6xl font-black uppercase font-display">Watch & Listen to Sermons</h1>
            <p className="text-slate-300 text-base max-w-xl mx-auto">
              "Faith cometh by hearing, and hearing by the word of God." — Romans 10:17
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Featured Hero Sermon */}
      {sermons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
          <div className="bg-navy-900 border-2 border-gold-500/50 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-white">
            
            <div className="lg:col-span-7 relative group cursor-pointer" onClick={() => onSelectSermon(sermons[0])}>
              <div className="relative aspect-video rounded-xl overflow-hidden border border-navy-700">
                <img
                  src={getSermonHeroThumbnail(sermons[0])}
                  alt={sermons[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-navy-950/40 group-hover:bg-navy-950/20 transition-colors flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-navy-950 ml-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <span className="px-3 py-1 bg-gold-500 text-navy-950 font-black text-xs uppercase rounded-md">FEATURED SERMON</span>
              <h2 className="text-2xl md:text-3xl font-extrabold uppercase font-display text-white">{sermons[0].title}</h2>
              <div className="space-y-1 text-xs text-slate-300">
                <p>Speaker: <span className="text-gold-400 font-bold">{sermons[0].speaker}</span></p>
                <p>Series: <span className="text-white font-medium">{sermons[0].series}</span></p>
                <p>Scripture: <span className="text-gold-300">{sermons[0].scripture}</span></p>
              </div>
              <p className="text-xs text-slate-300 line-clamp-3">{sermons[0].description}</p>
              
              <Button variant="gold" size="md" onClick={() => onSelectSermon(sermons[0])} icon={<Play className="w-4 h-4 fill-navy-950" />}>
                Watch Message Now
              </Button>
            </div>

          </div>
        </section>
      )}

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white p-4 rounded-xl border-2 border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search sermon title or speaker..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-navy-900"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-navy-900 shrink-0" />
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Series:</span>
            {seriesList.map((ser) => (
              <button
                key={ser}
                onClick={() => setSelectedSeries(ser)}
                className={`px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase whitespace-nowrap transition-colors ${
                  selectedSeries === ser
                    ? 'bg-navy-900 text-gold-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {ser}
              </button>
            ))}
          </div>

        </div>

        {/* Sermon Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon) => (
            <StaggerItem key={sermon.id}>
            <div
              onClick={() => onSelectSermon(sermon)}
              className="bg-navy-900 text-white rounded-2xl overflow-hidden border border-navy-800 shadow-xl cursor-pointer group hover:border-gold-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getSermonThumbnail(sermon)}
                    alt={sermon.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-navy-950/40 group-hover:bg-navy-950/20 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-navy-950 ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 left-2 bg-navy-950/90 text-gold-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    {sermon.series}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <span className="text-[11px] text-slate-400 block">{sermon.date}</span>
                  <h3 className="font-extrabold text-lg uppercase font-display text-white group-hover:text-gold-400 transition-colors line-clamp-1">
                    {sermon.title}
                  </h3>
                  <p className="text-xs text-gold-300 font-medium">Speaker: {sermon.speaker}</p>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">{sermon.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button variant="gold" size="sm" className="w-full" icon={<Play className="w-3.5 h-3.5 fill-navy-950" />}>
                  Watch Message
                </Button>
              </div>
            </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

    </div>
  );
};
