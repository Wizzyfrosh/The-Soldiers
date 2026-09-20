import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />,
    error: <XCircle className="w-6 h-6 text-red-400 shrink-0" />,
    info: <AlertCircle className="w-6 h-6 text-gold-400 shrink-0" />
  };

  const bgColors = {
    success: 'bg-navy-900 border-emerald-500/50 text-white',
    error: 'bg-navy-900 border-red-500/50 text-white',
    info: 'bg-navy-900 border-gold-500/50 text-white'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short max-w-md w-full px-4">
      <div className={`flex items-start gap-3 p-4 rounded-xl border-2 shadow-2xl backdrop-blur-md ${bgColors[toast.type]}`}>
        {icons[toast.type]}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-gold-400 font-display uppercase tracking-wide">{toast.title}</h4>
          <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
