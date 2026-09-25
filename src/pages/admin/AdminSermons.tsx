import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Play, Youtube, Upload, Film, Image as ImageIcon, X } from 'lucide-react';
import { store } from '../../data/store';
import { Sermon } from '../../types';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

export const AdminSermons: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>(store.getSermons());
  const [showModal, setShowModal] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);

  useEffect(() => {
    store.syncWithBackend();
    return store.subscribe(() => {
      setSermons(store.getSermons());
    });
  }, []);

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
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Helper to extract YouTube ID supporting watch, live, shorts, and embed links
  const extractYoutubeId = (input: string): string => {
    if (!input) return '';
    const trimmed = input.trim();
    if (!trimmed) return '';
    if (/^[\w-]{11}$/.test(trimmed)) return trimmed;
    const match = trimmed.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?(?:.*&)?v=|live\/|shorts\/))([\w-]{11})/i);
    if (match && match[1]) return match[1];
    return '';
  };

  const parsedYoutubeId = extractYoutubeId(youtubeInput);

  // Auto-set YouTube thumbnail when YouTube ID changes and no custom thumbnail is set
  useEffect(() => {
    if (videoType === 'youtube' && parsedYoutubeId && !thumbnailUrl) {
      setThumbnailUrl(`https://img.youtube.com/vi/${parsedYoutubeId}/hqdefault.jpg`);
    }
  }, [parsedYoutubeId, videoType]);

  const openCreateModal = () => {
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
    setShowModal(true);
  };

  const openEditModal = (sermon: Sermon) => {
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
    setShowModal(true);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const res = await api.upload.file(file);
      setVideoUrl(res.url);
    } catch (err: any) {
      alert(err.message || 'Video upload failed. Please try again.');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const res = await api.upload.file(file);
      setThumbnailUrl(res.url);
    } catch (err: any) {
      alert(err.message || 'Thumbnail upload failed.');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleSaveSermon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a sermon title.');
      return;
    }

    const resolvedYoutubeId = videoType === 'youtube' ? (parsedYoutubeId || null) : null;
    let resolvedVideoUrl: string | null = null;

    if (videoType === 'upload') {
      resolvedVideoUrl = videoUrl.trim() || null;
    } else if (videoType === 'youtube' && parsedYoutubeId) {
      resolvedVideoUrl = `https://www.youtube.com/watch?v=${parsedYoutubeId}`;
    }

    if (!resolvedYoutubeId && !resolvedVideoUrl) {
      if (videoType === 'youtube') {
        alert('Please enter a valid YouTube video link, Live stream URL, or 11-character Video ID.');
      } else {
        alert('Please choose and upload a video file (MP4/WebM) or provide a valid video URL.');
      }
      return;
    }

    setSubmitting(true);
    try {
      const defaultThumb = resolvedYoutubeId
        ? `https://img.youtube.com/vi/${resolvedYoutubeId}/hqdefault.jpg`
        : '/images/worship_hero.jpg';

      const sermonPayload = {
        title: title.trim(),
        speaker: speaker.trim(),
        series: series.trim(),
        date,
        youtubeId: resolvedYoutubeId,
        videoUrl: resolvedVideoUrl,
        thumbnail: thumbnailUrl.trim() || defaultThumb,
        featured: editingSermon ? editingSermon.featured : false,
        description: description.trim(),
        scripture: scripture.trim() || null
      };

      if (editingSermon) {
        await store.updateSermon(editingSermon.id, sermonPayload);
      } else {
        await store.addSermon(sermonPayload);
      }

      setShowModal(false);
      setEditingSermon(null);
      setSermons(store.getSermons());
    } catch (err: any) {
      console.error('Error saving sermon:', err);
      alert(err.message || 'Failed to save sermon. Please check your network and session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, sermonTitle: string) => {
    if (confirm(`Are you sure you want to permanently delete "${sermonTitle}"?`)) {
      await store.deleteSermon(id);
      setSermons(store.getSermons());
    }
  };

  return (
    <div className="space-y-6 animate-fade-in w-full">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950 tracking-tight">Sermon Manager</h2>
          <p className="text-xs text-slate-500 mt-0.5">Post, edit, and manage video broadcasts, YouTube sermons, and MP4 media.</p>
        </div>
        <Button
          variant="gold"
          size="md"
          onClick={openCreateModal}
          icon={<Plus className="w-4 h-4" />}
          className="w-full sm:w-auto shrink-0"
        >
          Add New Sermon
        </Button>
      </div>

      {/* Sermons Data Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
              <tr>
                <th className="p-4 w-28">Thumbnail</th>
                <th className="p-4">Title & Series</th>
                <th className="p-4">Source</th>
                <th className="p-4">Speaker</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right sticky right-0 bg-navy-900 z-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sermons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No sermons found in database. Click "Add New Sermon" to publish your first message.
                  </td>
                </tr>
              ) : (
                sermons.map((s) => (
                  <tr key={s.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="relative aspect-video w-24 rounded-lg overflow-hidden border border-slate-200 bg-navy-950 shrink-0">
                        <img
                          src={
                            s.thumbnail ||
                            (s.youtubeId ? `https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg` : '/images/worship_hero.jpg')
                          }
                          alt={s.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-navy-950 block text-sm">{s.title}</span>
                      <span className="text-[11px] text-gold-600 font-extrabold uppercase">{s.series}</span>
                      {s.scripture && <span className="text-[10px] text-slate-400 block">{s.scripture}</span>}
                    </td>
                    <td className="p-4">
                      {s.youtubeId ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-black text-[10px] uppercase bg-red-50 text-red-700 border border-red-200">
                          <Youtube className="w-3 h-3 text-red-600" /> YouTube
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded font-black text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200">
                          <Film className="w-3 h-3 text-blue-600" /> Uploaded MP4
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium">{s.speaker}</td>
                    <td className="p-4 font-mono">{s.date}</td>
                    <td className="p-4 text-right sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)]">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-2 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                          title="Edit Sermon"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.title)}
                          className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
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

      {/* Add / Edit Sermon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-navy-900 text-white rounded-2xl p-5 sm:p-7 border border-gold-500/40 shadow-2xl space-y-5 my-auto max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-navy-800 pb-4 shrink-0">
              <div>
                <h3 className="font-black text-base sm:text-lg uppercase font-display text-white">
                  {editingSermon ? 'Edit Sermon Broadcast' : 'Post New Sermon Broadcast'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Fill in sermon details, YouTube link or uploaded video file.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-navy-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSermon} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Sermon Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standing Firm In Holy Faith"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder:text-slate-600"
                  required
                />
              </div>

              {/* Video Source Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Video Source *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVideoType('youtube')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      videoType === 'youtube'
                        ? 'bg-red-600/20 border-red-500 text-red-400 ring-1 ring-red-500'
                        : 'bg-navy-950 border-navy-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <Youtube className="w-4 h-4 text-red-500" /> YouTube Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoType('upload')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      videoType === 'upload'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400 ring-1 ring-blue-500'
                        : 'bg-navy-950 border-navy-700 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <Film className="w-4 h-4 text-blue-400" /> Upload Video File
                  </button>
                </div>

                {videoType === 'youtube' ? (
                  <div className="space-y-2 pt-1">
                    <input
                      type="text"
                      placeholder="Paste YouTube Link or Video ID (e.g. https://www.youtube.com/watch?v=...)"
                      value={youtubeInput}
                      onChange={(e) => setYoutubeInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder:text-slate-600"
                    />
                    {parsedYoutubeId && (
                      <div className="p-3 bg-navy-950 rounded-xl border border-gold-500/40 text-xs flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="aspect-video w-32 rounded-lg overflow-hidden border border-navy-800 shrink-0 bg-black">
                          <img
                            src={`https://img.youtube.com/vi/${parsedYoutubeId}/hqdefault.jpg`}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-gold-400 font-bold block mb-1">✓ Detected YouTube ID: {parsedYoutubeId}</span>
                          <span className="text-slate-400 text-[11px]">Automatic thumbnail will be generated.</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="cursor-pointer px-4 py-2 bg-navy-800 border border-navy-700 hover:border-gold-500 rounded-xl text-xs font-bold uppercase text-gold-400 hover:text-white transition-all flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>{uploadingVideo ? 'Uploading Video...' : 'Choose Video File (MP4/WebM)'}</span>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          disabled={uploadingVideo}
                        />
                      </label>
                      <span className="text-xs text-slate-400">or paste URL below</span>
                    </div>
                    <input
                      type="text"
                      placeholder="/uploads/... or https://..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs placeholder:text-slate-600"
                    />
                  </div>
                )}
              </div>

              {/* Custom Thumbnail Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Custom Thumbnail Image (Optional)
                </label>
                <div className="flex items-center gap-3">
                  {thumbnailUrl && (
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-20 h-12 rounded-lg object-cover border border-gold-500/40 shrink-0"
                    />
                  )}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-navy-800 border border-navy-700 hover:border-gold-500 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-colors">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{uploadingThumbnail ? 'Uploading...' : 'Upload Thumbnail'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                        disabled={uploadingThumbnail}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="https://... or auto-generated from YouTube"
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      className="w-full px-3 py-1.5 bg-navy-950 border border-navy-700 rounded-lg text-white text-xs placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Speaker *</label>
                  <input
                    type="text"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Series *</label>
                  <input
                    type="text"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Scripture Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. Ephesians 6:10-18"
                    value={scripture}
                    onChange={(e) => setScripture(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of the sermon message..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 placeholder:text-slate-600"
                ></textarea>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-navy-800 shrink-0">
                <Button type="button" variant="outline" size="md" className="w-full sm:flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  className="w-full sm:flex-1"
                  disabled={uploadingVideo || uploadingThumbnail || submitting}
                >
                  {submitting ? 'Saving...' : (editingSermon ? 'Update Sermon' : 'Publish Sermon')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
