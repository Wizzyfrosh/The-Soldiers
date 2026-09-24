import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cross, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';
import { store } from '../../data/store';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@soldiersofjesuschrist.org');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.auth.login(email, password);
      store.setCurrentUser(res.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5A623_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center text-navy-950 shadow-gold">
            <Cross className="w-8 h-8 stroke-[2.5]" />
          </div>
        </div>
        <h2 className="mt-5 text-center text-2xl sm:text-3xl font-black uppercase font-display tracking-tight text-white">
          SJC Leadership Hub
        </h2>
        <p className="mt-2 text-center text-xs sm:text-sm text-slate-400 font-medium">
          Authorized personnel only. Equipping the saints for the Kingdom battle.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-navy-900/90 border border-navy-800 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm transition-all"
                  placeholder="admin@soldiersofjesuschrist.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-extrabold uppercase tracking-wider text-navy-950 bg-gold-500 hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 shadow-gold transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In to Admin Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-8 pt-6 border-t border-navy-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
              Quick Switch Role Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleFillCredentials('admin@soldiersofjesuschrist.org', 'admin123')}
                className="p-2.5 rounded-lg bg-navy-950/80 border border-navy-800 hover:border-gold-500/50 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1 text-gold-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
                </div>
                <div className="text-slate-400 truncate mt-0.5">admin123</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillCredentials('editor@soldiersofjesuschrist.org', 'editor123')}
                className="p-2.5 rounded-lg bg-navy-950/80 border border-navy-800 hover:border-gold-500/50 text-left transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1 text-blue-400 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Editor
                </div>
                <div className="text-slate-400 truncate mt-0.5">editor123</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
