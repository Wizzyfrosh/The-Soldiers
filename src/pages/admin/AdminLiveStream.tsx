import React, { useState, useEffect } from 'react';
import {
  Radio,
  Settings,
  Save,
  AlertTriangle,
  Check,
  Loader2,
  Copy,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminLiveStream: React.FC = () => {
  const [title, setTitle] = useState('Sunday Worship Service - Live');
  const [streamKey, setStreamKey] = useState('');
  const [playbackId, setPlaybackId] = useState('');
  const [isLive, setIsLive] = useState(false);

  const [showStreamKey, setShowStreamKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Fetch current stream config
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.livestream.getAdmin();
        if (res.stream) {
          setTitle(res.stream.title || 'Sunday Worship Service - Live');
          setStreamKey(res.stream.streamKey || '');
          setPlaybackId(res.stream.playbackId || '');
          setIsLive(res.stream.isLive || false);
        }
      } catch (err: any) {
        console.warn('Failed to load livestream config:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      await api.livestream.update({ title, streamKey, playbackId });
      setSuccess('Live stream settings saved successfully!');
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLive = async () => {
    setError(null);
    setSuccess(null);
    setToggling(true);

    try {
      const res = await api.livestream.toggle();
      setIsLive(res.stream.isLive);
      setSuccess(res.message);
      setTimeout(() => setSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to toggle live status.');
    } finally {
      setToggling(false);
    }
  };

  const copyStreamKey = () => {
    navigator.clipboard.writeText(streamKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950 tracking-wide flex items-center gap-3">
            <Radio className="w-6 h-6 text-red-500" />
            Live Stream Manager
          </h1>
          <p className="text-sm text-slate-500 mt-1">Configure and control your Mux live streaming</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/watch-live"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Public Page
          </a>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 font-medium">{error}</p>
        </div>
      )}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
          <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700 font-medium">{success}</p>
        </div>
      )}

      {/* ── Live Status Toggle Card ── */}
      <div className={`rounded-2xl border-2 overflow-hidden transition-colors ${isLive ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isLive ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
              {isLive ? <Wifi className="w-7 h-7" /> : <WifiOff className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-950 flex items-center gap-2">
                Stream Status
                {isLive && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase bg-red-600 text-white rounded-full animate-pulse">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    LIVE
                  </span>
                )}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5">
                {isLive
                  ? 'Your stream is currently broadcasting to viewers'
                  : 'Your stream is currently offline'}
              </p>
            </div>
          </div>
          <button
            onClick={handleToggleLive}
            disabled={toggling}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold uppercase transition-all cursor-pointer disabled:opacity-50 ${
              isLive
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
            }`}
          >
            {toggling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isLive ? (
              <WifiOff className="w-4 h-4" />
            ) : (
              <Wifi className="w-4 h-4" />
            )}
            {isLive ? 'Stop Stream' : 'Go Live'}
          </button>
        </div>
      </div>

      {/* ── Stream Configuration Form ── */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-navy-950">Mux Configuration</h3>
              <p className="text-xs text-slate-500">Enter your Mux Stream Key and Playback ID</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Stream Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Stream Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm"
              placeholder="Sunday Worship Service - Live"
            />
          </div>

          {/* Stream Key (masked) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mux Stream Key
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showStreamKey ? 'text' : 'password'}
                  value={streamKey}
                  onChange={(e) => setStreamKey(e.target.value)}
                  className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm font-mono pr-10"
                  placeholder="Enter your Mux stream key"
                />
                <button
                  type="button"
                  onClick={() => setShowStreamKey(!showStreamKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-navy-900 cursor-pointer"
                >
                  {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="button"
                onClick={copyStreamKey}
                disabled={!streamKey}
                className="p-3 border border-slate-300 rounded-xl text-slate-500 hover:text-navy-900 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-40 shrink-0"
                title="Copy stream key"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Found in your Mux dashboard under Live Streams → Stream Key
            </p>
          </div>

          {/* Playback ID */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Mux Playback ID
            </label>
            <input
              type="text"
              value={playbackId}
              onChange={(e) => setPlaybackId(e.target.value)}
              className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm font-mono"
              placeholder="Enter your Mux playback ID"
            />
            <p className="mt-1.5 text-[11px] text-slate-400">
              Found in your Mux dashboard under Live Streams → Playback ID
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Stream Settings
          </button>
        </div>
      </form>

      {/* Info Card */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
        <h4 className="text-xs font-bold uppercase text-indigo-800 mb-2">Quick Setup Guide</h4>
        <ol className="text-xs text-indigo-700 space-y-1.5 list-decimal list-inside">
          <li>Create a live stream in your <a href="https://dashboard.mux.com" target="_blank" className="underline font-bold">Mux Dashboard</a></li>
          <li>Copy the <strong>Stream Key</strong> and <strong>Playback ID</strong> into the fields above</li>
          <li>Click <strong>"Save Stream Settings"</strong></li>
          <li>Configure your streaming software (OBS, Streamyard, etc.) with the stream key</li>
          <li>When ready, click <strong>"Go Live"</strong> to start broadcasting</li>
        </ol>
      </div>
    </div>
  );
};
