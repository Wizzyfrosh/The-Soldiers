import React from 'react';
import { X, Play, Calendar, User, BookOpen, Share2 } from 'lucide-react';
import { Sermon } from '../../types';

interface SermonPlayerModalProps {
  sermon: Sermon | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SermonPlayerModal: React.FC<SermonPlayerModalProps> = ({ sermon, isOpen, onClose }) => {
  if (!isOpen || !sermon) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-navy-950/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl bg-navy-900 border-2 border-gold-500/40 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-navy-950 border-b border-navy-800">
          <div>
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">{sermon.series}</span>
            <h3 className="text-lg md:text-xl font-extrabold uppercase font-display text-white line-clamp-1">
              {sermon.title}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video w-full bg-black">
          {sermon.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${sermon.youtubeId}?autoplay=1`}
              title={sermon.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : sermon.videoUrl ? (
            <video
              src={sermon.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <p className="text-sm">No video available for this sermon.</p>
            </div>
          )}
        </div>

        {/* Details Footer */}
        <div className="p-6 overflow-y-auto space-y-4 bg-navy-900">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-navy-800 pb-4 text-xs text-slate-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-gold-400" /> <span className="text-white font-medium">{sermon.speaker}</span></span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gold-400" /> {sermon.date}</span>
              {sermon.scripture && (
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-gold-400" /> Scripture: <span className="text-gold-300 font-bold">{sermon.scripture}</span></span>
              )}
            </div>
            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 font-bold uppercase tracking-wider"
            >
              <Share2 className="w-4 h-4" /> Share Sermon
            </button>
          </div>

          <div>
            <h4 className="font-bold text-sm text-gold-400 uppercase font-display mb-1">Message Overview</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{sermon.description}</p>
          </div>
        </div>

      </div>
    </div>
  );
};
