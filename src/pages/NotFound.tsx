import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, Play } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ScaleIn } from '../components/common/Animations';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-navy-950 text-white">
      <ScaleIn className="max-w-md w-full">
        <div className="bg-navy-900 border-2 border-gold-500/40 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 bg-gold-500/20 text-gold-400 rounded-full flex items-center justify-center mx-auto border border-gold-500/40">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-4xl font-black text-gold-400 font-display">404</span>
            <h1 className="text-2xl font-black uppercase font-display text-white">Page Not Found</h1>
            <p className="text-xs text-slate-300">
              The page you are looking for might have been moved or does not exist. Let's get you back on track!
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Link to="/" className="w-full">
              <Button variant="gold" size="md" className="w-full" icon={<Home className="w-4 h-4" />}>
                Return To Homepage
              </Button>
            </Link>
            <Link to="/sermons" className="w-full">
              <Button variant="outline" size="md" className="w-full" icon={<Play className="w-4 h-4 fill-white" />}>
                Watch Sermons
              </Button>
            </Link>
          </div>
        </div>
      </ScaleIn>
    </div>
  );
};
