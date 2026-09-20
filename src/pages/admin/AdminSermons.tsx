import React, { useState } from 'react';
import { Plus, Trash2, Play, Youtube, CheckCircle2 } from 'lucide-react';
import { store } from '../../data/store';
import { Sermon } from '../../types';
import { Button } from '../../components/common/Button';

export const AdminSermons: React.FC = () => {
  const [sermons, setSermons] = useState<Sermon[]>(store.getSermons());
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [speaker, setSpeaker] = useState('Pastor David Vance');
  const [series, setSeries] = useState('Spiritual Warfare');
  const [description, setDescription] = useState('');

  const handleAddSermon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !youtubeId) return;

    const newSermon = store.addSermon({
      title,
      youtubeId,
      speaker,
      series,
      date: new Date().toISOString().split('T')[0],
      featured: false,
      description
    });

    setSermons(store.getSermons());
    setShowModal(false);
    setTitle('');
    setYoutubeId('');
    setDescription('');
  };

  const handleDelete = (id: string) => {
    store.deleteSermon(id);
    setSermons(store.getSermons());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase font-display text-navy-950">Sermon Manager</h2>
          <p className="text-xs text-slate-500">Add, feature, and manage YouTube sermon broadcasts.</p>
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
              <th className="p-4">Thumbnail</th>
              <th className="p-4">Title & Series</th>
              <th className="p-4">Speaker</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {sermons.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-4 w-32">
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-slate-300">
                    <img
                      src={`https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`}
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
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Sermon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Sermon Modal with Live YouTube Thumbnail Preview */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-navy-900 text-white rounded-2xl max-w-lg w-full p-6 border-2 border-gold-500/40 shadow-2xl space-y-4">
            <h3 className="font-black text-lg uppercase font-display text-white">Add New Sermon Broadcast</h3>

            <form onSubmit={handleAddSermon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Sermon Title</label>
                <input
                  type="text"
                  placeholder="e.g. Standing Firm In Holy Faith"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">YouTube Video ID</label>
                <input
                  type="text"
                  placeholder="e.g. Lw8jG2nOQp8"
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  required
                />
                <span className="text-[10px] text-slate-400 block mt-1">Copy the ID string after v= in your YouTube URL.</span>
              </div>

              {/* Realtime Thumbnail Preview */}
              {youtubeId && (
                <div className="p-3 bg-navy-950 rounded-xl border border-gold-500/40 text-xs">
                  <span className="text-gold-400 font-bold block mb-1">✓ Live YouTube Thumbnail Preview</span>
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-navy-800">
                    <img
                      src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Speaker</label>
                  <input
                    type="text"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Series</label>
                  <input
                    type="text"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
                    className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" size="md" className="flex-1" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="md" className="flex-1">
                  Save Sermon
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
