'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Play, Youtube, Film, X } from 'lucide-react';
import { MediaUploader } from '../components/MediaUploader';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  series: string;
  date: string;
  youtubeId?: string | null;
  videoUrl?: string | null;
  thumbnail?: string | null;
  description?: string;
  scripture?: string | null;
}

export default function AdminSermonsPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form State
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('Prophet Ebelechukwu Elochukwu');
  const [series, setSeries] = useState('Spiritual Warfare');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [videoType, setVideoType] = useState<'youtube' | 'upload'>('youtube');
  const [youtubeInput, setYoutubeInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [description, setDescription] = useState('');
  const [scripture, setScripture] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sermons');
      const data = await res.json();
      if (data.sermons) setSermons(data.sermons);
    } catch (err) {
      console.error('Error fetching sermons:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const extractYoutubeId = (input: string): string => {
    if (!input) return '';
    const trimmed = input.trim();
    if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?(?:.*&)?v=|live\/|shorts\/))([\w-]{11})/i);
    return match ? match[1] : '';
  };

  const parsedYoutubeId = extractYoutubeId(youtubeInput);

  const openCreateForm = () => {
    setEditingSermon(null);
    setTitle('');
    setSpeaker('Prophet Ebelechukwu Elochukwu');
    setSeries('Spiritual Warfare');
    setDate(new Date().toISOString().split('T')[0]);
    setVideoType('youtube');
    setYoutubeInput('');
    setVideoUrl('');
    setThumbnailUrl('');
    setDescription('');
    setScripture('');
    setShowForm(true);
  };

  const openEditForm = (sermon: Sermon) => {
    setEditingSermon(sermon);
    setTitle(sermon.title);
    setSpeaker(sermon.speaker || 'Prophet Ebelechukwu Elochukwu');
    setSeries(sermon.series || 'Spiritual Warfare');
    setDate(sermon.date || new Date().toISOString().split('T')[0]);
    if (sermon.youtubeId) {
      setVideoType('youtube');
      setYoutubeInput(`https://www.youtube.com/watch?v=${sermon.youtubeId}`);
      setVideoUrl('');
    } else {
      setVideoType('upload');
      setVideoUrl(sermon.videoUrl || '');
      setYoutubeInput('');
    }
    setThumbnailUrl(sermon.thumbnail || '');
    setDescription(sermon.description || '');
    setScripture(sermon.scripture || '');
    setShowForm(true);
  };

  const handleSaveSermon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a sermon title.');

    const resolvedYoutubeId = videoType === 'youtube' ? (parsedYoutubeId || null) : null;
    let resolvedVideoUrl: string | null = null;

    if (videoType === 'upload') {
      resolvedVideoUrl = videoUrl.trim() || null;
    } else if (videoType === 'youtube' && parsedYoutubeId) {
      resolvedVideoUrl = `https://www.youtube.com/watch?v=${parsedYoutubeId}`;
    }

    setSubmitting(true);
    try {
      const defaultThumb = resolvedYoutubeId
        ? `https://img.youtube.com/vi/${resolvedYoutubeId}/hqdefault.jpg`
        : '/images/worship_hero.jpg';

      const payload = {
        title: title.trim(),
        speaker: speaker.trim(),
        series: series.trim(),
        date,
        youtubeId: resolvedYoutubeId,
        videoUrl: resolvedVideoUrl,
        thumbnail: thumbnailUrl.trim() || defaultThumb,
        description: description.trim(),
        scripture: scripture.trim() || null
      };

      const endpoint = editingSermon ? `/api/sermons/${editingSermon.id}` : '/api/sermons';
      const method = editingSermon ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save sermon.');

      setShowForm(false);
      fetchSermons();
    } catch (err: any) {
      alert(err.message || 'Error saving sermon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, sermonTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${sermonTitle}"?`)) return;
    try {
      await fetch(`/api/sermons/${id}`, { method: 'DELETE' });
      fetchSermons();
    } catch (err) {
      alert('Failed to delete sermon.');
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* 2. Responsive Page Header: flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950 tracking-tight">
            Sermon Manager
          </h2>
          <p className="text-xs text-slate-500">
            Post, edit, and manage video broadcasts, YouTube sermons, and media.
          </p>
        </div>
        <button
          onClick={() => (showForm ? setShowForm(false) : openCreateForm())}
          className="w-full sm:w-auto px-6 py-3 bg-gold-400 hover:bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showForm ? 'Close Form' : 'Add New Sermon'}</span>
        </button>
      </div>

      {/* 2. Responsive Form Wrapper: w-full bg-white rounded-2xl shadow-sm p-6 md:p-8 without fixed height or overflow-y-auto */}
      {showForm && (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6 transition-all">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-black uppercase font-display text-navy-950">
              {editingSermon ? 'Edit Sermon Broadcast' : 'Post New Sermon Broadcast'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in sermon details, YouTube link or uploaded video file.
            </p>
          </div>

          <form onSubmit={handleSaveSermon} className="space-y-5 w-full">
            {/* Title Input */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Sermon Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Standing Firm In Holy Faith"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                required
              />
            </div>

            {/* Video Source Selector */}
            <div className="w-full space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Video Source *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setVideoType('youtube')}
                  className={`w-full py-3 px-4 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    videoType === 'youtube'
                      ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-400'
                      : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Youtube className="w-4 h-4 text-red-600" /> YouTube Link
                </button>
                <button
                  type="button"
                  onClick={() => setVideoType('upload')}
                  className={`w-full py-3 px-4 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    videoType === 'upload'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-400'
                      : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Film className="w-4 h-4 text-blue-600" /> Upload Video File
                </button>
              </div>

              {videoType === 'youtube' ? (
                <div className="w-full space-y-2 pt-2">
                  <input
                    type="text"
                    placeholder="Paste YouTube Link or Video ID (e.g. https://www.youtube.com/watch?v=...)"
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  />
                  {parsedYoutubeId && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <span>✓ Detected YouTube ID: {parsedYoutubeId}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full pt-2">
                  <MediaUploader
                    label="Upload Video File (MP4 / WebM)"
                    value={videoUrl}
                    onChange={(url) => setVideoUrl(url)}
                    type="video"
                    placeholder="/uploads/... or video URL"
                  />
                </div>
              )}
            </div>

            {/* Thumbnail Image Uploader */}
            <MediaUploader
              label="Sermon Thumbnail Image"
              value={thumbnailUrl}
              onChange={(url) => setThumbnailUrl(url)}
              type="image"
              placeholder="https://... or click upload file"
            />

            {/* Speaker & Series Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="w-full space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Speaker *
                </label>
                <input
                  type="text"
                  value={speaker}
                  onChange={(e) => setSpeaker(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  required
                />
              </div>
              <div className="w-full space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Series *
                </label>
                <input
                  type="text"
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Date & Scripture Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="w-full space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Broadcast Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                  required
                />
              </div>
              <div className="w-full space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Scripture Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ephesians 6:10-18"
                  value={scripture}
                  onChange={(e) => setScripture(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Description Textarea */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Summary & Description
              </label>
              <textarea
                rows={4}
                placeholder="Full details and sermon outline..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
              />
            </div>

            {/* Form Actions: Buttons must be w-full sm:w-auto */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 w-full">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full sm:w-auto px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs uppercase rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 bg-navy-950 hover:bg-navy-900 text-gold-400 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg border border-gold-500/30"
              >
                {submitting ? 'Saving...' : editingSermon ? 'Update Sermon' : 'Publish Sermon'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sermons Data Table */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
              <tr>
                <th className="p-4 w-24">Thumbnail</th>
                <th className="p-4">Title & Series</th>
                <th className="p-4">Speaker</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    Loading sermons...
                  </td>
                </tr>
              ) : sermons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    No sermons found. Click "Add New Sermon" to publish your first message.
                  </td>
                </tr>
              ) : (
                sermons.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="aspect-video w-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 shrink-0">
                        <img
                          src={
                            s.thumbnail ||
                            (s.youtubeId ? `https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg` : '/images/worship_hero.jpg')
                          }
                          alt={s.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-navy-950 block text-sm">{s.title}</span>
                      <span className="text-[11px] text-gold-600 font-extrabold uppercase">{s.series}</span>
                    </td>
                    <td className="p-4 font-medium">{s.speaker}</td>
                    <td className="p-4 font-mono">{s.date}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditForm(s)}
                          className="p-2 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Sermon"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.title)}
                          className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Sermon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
