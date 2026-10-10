import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Film, X, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface MediaUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  type?: 'image' | 'video';
  placeholder?: string;
  disabled?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label,
  value,
  onChange,
  type = 'image',
  placeholder = 'https://... or click upload file',
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const res = await api.upload.file(file);
      if (res.url) {
        onChange(res.url);
      }
    } catch (err: any) {
      console.error('Media upload error:', err);
      setError(err.message || 'Failed to upload media file.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}
      </label>

      <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 md:p-5 space-y-3">
        {/* Media Preview Box */}
        {value ? (
          <div className="relative w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-900 group">
            {type === 'video' ? (
              <video src={value} controls className="w-full max-h-56 object-contain" />
            ) : (
              <img src={value} alt="Media Preview" className="w-full h-48 md:h-56 object-cover" />
            )}
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-700 transition-colors"
              title="Remove Media"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full h-32 md:h-40 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            {type === 'video' ? (
              <Film className="w-8 h-8 mb-2 opacity-50 text-slate-500" />
            ) : (
              <ImageIcon className="w-8 h-8 mb-2 opacity-50 text-slate-500" />
            )}
            <span className="text-xs font-bold uppercase text-slate-500">
              No {type} selected
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              Upload a file or paste URL below
            </span>
          </div>
        )}

        {/* Upload Button + URL Input */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          <label className="w-full sm:w-auto shrink-0 cursor-pointer px-4 py-2.5 bg-navy-950 hover:bg-navy-900 text-gold-400 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border border-gold-500/30 active:scale-95">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 text-gold-400" />
                <span>Choose {type === 'video' ? 'Video' : 'Image'} File</span>
              </>
            )}
            <input
              type="file"
              accept={type === 'video' ? 'video/*' : 'image/*'}
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled || uploading}
            />
          </label>

          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || uploading}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-navy-900"
          />
        </div>

        {error && (
          <p className="text-xs font-bold text-rose-600 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};
