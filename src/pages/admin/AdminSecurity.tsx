import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldOff,
  QrCode,
  KeyRound,
  Copy,
  Check,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminSecurity: React.FC = () => {
  const navigate = useNavigate();

  // Status state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [backupCodesCount, setBackupCodesCount] = useState(0);
  const [statusLoading, setStatusLoading] = useState(true);

  // Setup state
  const [step, setStep] = useState<'idle' | 'scanning' | 'verifying' | 'backup' | 'disable'>('idle');
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [copiedBackup, setCopiedBackup] = useState(false);
  const [disableCode, setDisableCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch 2FA status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.twoFactor.getStatus();
        setIs2FAEnabled(res.enabled);
        setBackupCodesCount(res.backupCodesCount);
      } catch (err) {
        console.warn('Could not fetch 2FA status:', err);
      } finally {
        setStatusLoading(false);
      }
    };
    fetchStatus();
  }, []);

  // Begin 2FA Setup
  const handleBeginSetup = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await api.twoFactor.setup();
      setQrCode(res.qrCode);
      setSecret(res.secret);
      setStep('scanning');
    } catch (err: any) {
      setError(err.message || 'Failed to generate 2FA setup.');
    } finally {
      setLoading(false);
    }
  };

  // Verify and activate 2FA
  const handleVerifySetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    setError(null);
    setLoading(true);
    try {
      const res = await api.twoFactor.verifySetup(secret, verifyCode.trim());
      setBackupCodes(res.backupCodes);
      setIs2FAEnabled(true);
      setBackupCodesCount(res.backupCodes.length);
      setStep('backup');
      setSuccess('2FA has been successfully enabled!');
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Disable 2FA
  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disableCode.trim()) return;

    setError(null);
    setLoading(true);
    try {
      await api.twoFactor.disable(disableCode.trim());
      setIs2FAEnabled(false);
      setBackupCodesCount(0);
      setStep('idle');
      setSuccess('2FA has been disabled successfully.');
      setDisableCode('');
    } catch (err: any) {
      setError(err.message || 'Failed to disable 2FA.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'secret' | 'backup') => {
    navigator.clipboard.writeText(text);
    if (type === 'secret') {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedBackup(true);
      setTimeout(() => setCopiedBackup(false), 2000);
    }
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin')}
          className="p-2 text-slate-500 hover:text-navy-900 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950 tracking-wide">
            Security Settings
          </h1>
          <p className="text-sm text-slate-500">Manage two-factor authentication for your admin account</p>
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
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700 font-medium">{success}</p>
        </div>
      )}

      {/* ── Current Status Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${is2FAEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              {is2FAEnabled ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-navy-950 tracking-wide">Two-Factor Authentication</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {is2FAEnabled
                  ? `Active — ${backupCodesCount} backup codes remaining`
                  : 'Not enabled — your account is less secure'}
              </p>
            </div>
          </div>
          <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${is2FAEnabled ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
            {is2FAEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        {step === 'idle' && (
          <div className="px-6 pb-6 flex gap-3">
            {!is2FAEnabled ? (
              <button
                onClick={handleBeginSetup}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Enable 2FA
              </button>
            ) : (
              <button
                onClick={() => { setStep('disable'); setError(null); setSuccess(null); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <ShieldOff className="w-4 h-4" />
                Disable 2FA
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Step 1: QR Code Scanning ── */}
      {step === 'scanning' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-navy-950">Step 1: Scan QR Code</h3>
              <p className="text-xs text-slate-500">Open your authenticator app and scan this code</p>
            </div>
          </div>

          {/* QR Code Display */}
          <div className="flex justify-center py-4">
            <div className="bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-inner">
              <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
            </div>
          </div>

          {/* Manual Entry */}
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-bold uppercase text-slate-600">Can't scan? Enter this key manually:</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-navy-900 break-all">
                {secret}
              </code>
              <button
                onClick={() => copyToClipboard(secret, 'secret')}
                className="p-2 text-slate-500 hover:text-navy-900 hover:bg-white rounded-lg border border-slate-200 transition-colors cursor-pointer shrink-0"
                title="Copy secret key"
              >
                {copiedSecret ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Verify Code Input */}
          <form onSubmit={handleVerifySetup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Step 2: Enter Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="block w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm tracking-[0.3em] text-center font-mono"
                  placeholder="000000"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || verifyCode.length < 6}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Verify & Activate
              </button>
              <button
                type="button"
                onClick={() => { setStep('idle'); setQrCode(''); setSecret(''); setVerifyCode(''); }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Step 3: Backup Codes ── */}
      {step === 'backup' && backupCodes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-navy-950">Save Your Backup Codes</h3>
              <p className="text-xs text-slate-500">Store these codes securely — each can only be used once</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 font-medium">
                <strong>Important:</strong> These codes will NOT be shown again. Save them in a secure password manager or print them out.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {backupCodes.map((code, i) => (
                <code key={i} className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm font-mono text-navy-900 text-center">
                  {code}
                </code>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => copyToClipboard(backupCodes.join('\n'), 'backup')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copiedBackup ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copiedBackup ? 'Copied!' : 'Copy All Codes'}
            </button>
            <button
              onClick={() => { setStep('idle'); setBackupCodes([]); setVerifyCode(''); }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase bg-gold-500 text-navy-950 hover:bg-gold-400 transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              I've Saved My Codes — Done
            </button>
          </div>
        </div>
      )}

      {/* ── Disable 2FA Form ── */}
      {step === 'disable' && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-navy-950">Disable Two-Factor Authentication</h3>
              <p className="text-xs text-slate-500">Enter your current authenticator code to confirm</p>
            </div>
          </div>

          <form onSubmit={handleDisable} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Current Authenticator Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="block w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-navy-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm tracking-[0.3em] text-center font-mono"
                placeholder="000000"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || disableCode.length < 6}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldOff className="w-4 h-4" />}
                Confirm Disable 2FA
              </button>
              <button
                type="button"
                onClick={() => { setStep('idle'); setDisableCode(''); }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
