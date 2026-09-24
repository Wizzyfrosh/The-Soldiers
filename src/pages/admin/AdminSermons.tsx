import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Play, Youtube, Upload, Film, Image as ImageIcon, X } from 'lucide-react';
import { store } from '../../data/store';
import { Sermon } from '../../types';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

export const AdminSermons: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>(store.getSermons());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    store.syncWithBackend();
    return store.subscribe(() => {
      setSermons(store.getSermons());
    });
  }, []);

  // Form State
  const [title, setTitle] = useState('');
  const [speaker, setSpeaker] = useState('Pastor David Vance');
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

  // Helper to extract YouTube ID
  const extractYoutubeId = (input: string): string => {
    if (!input) return '';
    const match = input.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) return match[1];
    if (input.trim().length === 11 && !input.includes('/')) return input.trim();
    return '';
  };

  const parsedYoutubeId = extractYoutubeId(youtubeInput);

  // Auto-set YouTube thumbnail when YouTube ID changes and no custom thumbnail is set
  useEffect(() => {
    if (videoType === 'youtube' && parsedYoutubeId && !thumbnailUrl) {
      setThumbnailUrl(`https://img.youtube.com/vi/${parsedYoutubeId}/hqdefault.jpg`);
    }
  }, [parsedYoutubeId, videoType]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const res = await api.upload.file(file);
      setVideoUrl(res.url);
    } catch (err: any) {
      alert(err.message || 'Video upload failed. In production, connect Cloudinary or AWS S3 for large videos.');
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

  const handleAddSermon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const resolvedYoutubeId = videoType === 'youtube' ? parsedYoutubeId : undefined;
    const resolvedVideoUrl = videoType === 'upload' ? videoUrl : (youtubeInput ? `https://www.youtube.com/watch?v=${parsedYoutubeId}` : undefined);

    if (!resolvedYoutubeId && !resolvedVideoUrl) {
      alert('Please provide either a valid YouTube link/ID or upload a video file.');
      return;
    }

    setSubmitting(true);
    try {
      await store.addSermon({
        title,
        speaker,
        series,
        date,
        youtubeId: resolvedYoutubeId || null,
        videoUrl: resolvedVideoUrl || null,
        thumbnail: thumbnailUrl || (resolvedYoutubeId ? `https://img.youtube.com/vi/${resolvedYoutubeId}/hqdefault.jpg` : null),
        featured: false,
        description,
        scripture: scripture || null
      });

      setShowModal(false);
      setTitle('');
      setYoutubeInput('');
      setVideoUrl('');
      setThumbnailUrl('');
      setDescription('');
      setScripture('');
    } catch (err: any) {
      alert(err.message || 'Failed to save sermon.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this sermon?')) {
      await store.deleteSermon(id);
      setSermons(store.getSermons());
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase font-display text-navy-950">Sermon Manager</h2>
          <p className="text-xs text-slate-500">Post and manage video broadcasts, YouTube sermons, and MP4 media.</p>
        </div>
        <Button variant="gold" size="md" onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
          Add New Sermon
        </Button>
      </div>

      {/* Sermons Data Table */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
            <tr>
              <th className="p-4 w-32">Thumbnail</th>
              <th className="p-4">Title & Series</th>
              <th className="p-4">Source</th>
              <th className="p-4">Speaker</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {sermons.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                  No sermons found in database. Click "Add New Sermon" to publish your first message.
                </td>
              </tr>
            ) : (
              sermons.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="relative aspect-video w-24 rounded-lg overflow-hidden border border-slate-300 bg-navy-950">
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
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-black text-[10px] uppercase bg-red-100 text-red-700">
                        <Youtube className="w-3 h-3" /> YouTube
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-black text-[10px] uppercase bg-blue-100 text-blue-700">
                        <Film className="w-3 h-3" /> Uploaded MP4
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-medium">{s.speaker}</td>
                  <td className="p-4 font-mono">{s.date}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Sermon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Sermon Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-navy-900 text-white rounded-2xl max-w-xl w-full p-6 border-2 border-gold-500/40 shadow-2xl space-y-4 my-8 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="font-black text-lg uppercase font-display text-white">Post New Sermon Broadcast</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSermon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Sermon Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standing Firm In Holy Faith"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              {/* Video Source Selector: YouTube vs Upload Video File */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Video Source
                </label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => setVideoType('youtube')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                      videoType === 'youtube'
                        ? 'bg-red-600/20 border-red-500 text-red-400'
                        : 'bg-navy-950 border-navy-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Youtube className="w-4 h-4" /> YouTube Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoType('upload')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${
                      videoType === 'upload'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                        : 'bg-navy-950 border-navy-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Film className="w-4 h-4" /> Upload Video File
                  </button>
                </div>

                {videoType === 'youtube' ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Paste YouTube Link or Video ID (e.g. https://www.youtube.com/watch?v=Lw8jG2nOQp8)"
                      value={youtubeInput}
                      onChange={(e) => setYoutubeInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                    {parsedYoutubeId && (
                      <div className="p-3 bg-navy-950 rounded-xl border border-gold-500/40 text-xs">
                        <span className="text-gold-400 font-bold block mb-1">✓ Detected YouTube ID: {parsedYoutubeId}</span>
                        <div className="aspect-video w-full max-w-xs rounded-lg overflow-hidden border border-navy-800">
                          <img
                            src={`https://img.youtube.com/vi/${parsedYoutubeId}/hqdefault.jpg`}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
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
                      className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Custom Thumbnail Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
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
                  <div className="flex-1 space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-navy-800 border border-navy-700 hover:border-gold-500 rounded-lg text-xs font-bold text-slate-300 hover:text-white">
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
                      className="w-full px-3 py-1 bg-navy-950 border border-navy-700 rounded-lg text-white text-xs"
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
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
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
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-3 border-t border-navy-800">
                <Button type="button" variant="outline" size="md" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  className="flex-1"
                  disabled={uploadingVideo || uploadingThumbnail || submitting}
                >
                  {submitting ? 'Saving...' : 'Publish Sermon'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
