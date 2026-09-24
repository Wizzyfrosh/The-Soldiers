import React, { useState, useEffect } from 'react';
import { Quote, Plus, Trash2, Upload, Calendar, Image as ImageIcon } from 'lucide-react';
import { store } from '../../data/store';
import { Testimony } from '../../types';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

export const AdminTestimonies: React.FC = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>(store.getTestimonies());
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    store.syncWithBackend();
    return store.subscribe(() => {
      setTestimonies(store.getTestimonies());
    });
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.upload.file(file);
      setImageUrl(res.url);
    } catch (err: any) {
      alert(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !imageUrl) return;

    setSubmitting(true);
    try {
      await store.addTestimony({
        title,
        content,
        image: imageUrl
      });
      setShowModal(false);
      setTitle('');
      setContent('');
      setImageUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400');
    } catch (err: any) {
      alert(err.message || 'Failed to create testimony.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, testTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${testTitle}"?`)) return;
    await store.deleteTestimony(id);
    setTestimonies(store.getTestimonies());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase font-display text-navy-950">Testimonies Manager</h2>
          <p className="text-xs text-slate-500">Manage member faith breakthroughs, miraculous healings, and life transformation stories.</p>
        </div>
        <Button
          variant="gold"
          size="md"
          onClick={() => setShowModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Post New Testimony
        </Button>
      </div>

      {/* Testimonies Table */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
            <tr>
              <th className="p-4">Photo</th>
              <th className="p-4">Testimony Title</th>
              <th className="p-4">Date Shared</th>
              <th className="p-4">Story Snippet</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {testimonies.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                  No testimonies posted yet. Click "Post New Testimony" to share the first story of God's power.
                </td>
              </tr>
            ) : (
              testimonies.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-12 rounded-xl object-cover border-2 border-gold-500/40 shadow-sm"
                    />
                  </td>
                  <td className="p-4 font-bold text-navy-950 text-sm max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="p-4 text-slate-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-600" />
                      {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-4 max-w-sm truncate text-slate-600 italic">
                    "{item.content}"
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete testimony"
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

      {/* Create Testimony Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-navy-900 text-white rounded-2xl max-w-2xl w-full p-6 border-2 border-gold-500/40 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <h3 className="font-black text-lg uppercase font-display text-white">Post Member Testimony</h3>

            <form onSubmit={handleCreateTestimony} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Testimony Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Miraculous Healing from Chronic Illness"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Testimony Full Story
                </label>
                <textarea
                  rows={6}
                  placeholder="Write the complete testimony of what God did..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 leading-relaxed"
                  required
                ></textarea>
              </div>

              {/* Image Upload Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Member Photo
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-24 h-20 rounded-xl object-cover border-2 border-gold-500/50 shadow-md shrink-0"
                    />
                  )}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-4 py-2 bg-navy-800 border border-navy-700 hover:border-gold-500 rounded-xl text-xs font-bold uppercase text-gold-400 hover:text-white transition-all flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">or paste image URL below</span>
                    </div>
                    <input
                      type="text"
                      placeholder="https://... or /images/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-navy-800">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="flex-1"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  className="flex-1"
                  disabled={submitting || uploading}
                >
                  {submitting ? 'Publishing...' : 'Publish Testimony'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
