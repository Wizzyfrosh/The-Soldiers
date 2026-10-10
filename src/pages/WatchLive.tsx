import React, { useState, useEffect } from 'react';
import { Radio, Clock, MapPin, ChevronRight, Wifi, WifiOff } from 'lucide-react';

interface StreamInfo {
  title: string;
  playbackId: string | null;
  isLive: boolean;
}

export const WatchLive: React.FC = () => {
  const [stream, setStream] = useState<StreamInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const res = await fetch('/api/livestream');
        if (res.ok) {
          const data = await res.json();
          setStream(data.stream);
        }
      } catch (err) {
        console.warn('Failed to load stream info:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStream();

    // Poll for live status every 30 seconds
    const interval = setInterval(fetchStream, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-navy-950">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-b from-navy-900 to-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#F5A623_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase ${
              stream?.isLive
                ? 'bg-red-600/20 text-red-400 border border-red-500/30 animate-pulse'
                : 'bg-slate-700/40 text-slate-400 border border-slate-600/30'
            }`}>
              {stream?.isLive ? (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                  <Radio className="w-4 h-4" />
                  We're Live Now
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  Currently Offline
                </>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase font-display text-white tracking-tight">
            {stream?.title || 'Watch Live'}
          </h1>
          <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Join us for live worship and the Word of God. Stream our services from anywhere in the world.
          </p>
        </div>
      </div>

      {/* Video Player Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-4 pb-16">
        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
          {loading ? (
            <div className="aspect-video flex items-center justify-center bg-navy-900">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto"></div>
                <p className="text-slate-400 text-sm">Loading stream...</p>
              </div>
            </div>
          ) : stream?.isLive && stream?.playbackId ? (
            /* Live Mux Player using iframe embed */
            <div className="aspect-video">
              <iframe
                src={`https://stream.mux.com/${stream.playbackId}`}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={stream.title}
              />
            </div>
          ) : (
            /* Offline State */
            <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-navy-900 via-navy-950 to-black relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#F5A623_1px,transparent_1px)] [background-size:32px_32px]"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              <div className="relative text-center space-y-5 px-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-navy-800 border-2 border-navy-700 flex items-center justify-center">
                  <WifiOff className="w-9 h-9 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-display">
                    No Active Stream
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">
                    We're not currently streaming. Check back during our scheduled service times to watch live.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Service Times Info */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="bg-navy-900/80 backdrop-blur border border-navy-800 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-white tracking-wide">Service Times</h3>
              <p className="text-slate-400 text-sm mt-1">Sundays at 10:00 AM EST</p>
              <p className="text-slate-500 text-xs mt-0.5">Midweek Bible Study: Wednesdays at 7:00 PM</p>
            </div>
          </div>

          <div className="bg-navy-900/80 backdrop-blur border border-navy-800 rounded-2xl p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-white tracking-wide">In Person</h3>
              <p className="text-slate-400 text-sm mt-1">Soldiers of Jesus Christ Church</p>
              <p className="text-slate-500 text-xs mt-0.5">Baltimore City, USA</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-slate-500 text-sm mb-4">
            Have a prayer request? We'd love to pray with you.
          </p>
          <a
            href="/prayer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-navy-950 font-bold text-sm uppercase hover:bg-gold-400 transition-colors shadow-gold"
          >
            Submit a Prayer Request
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
