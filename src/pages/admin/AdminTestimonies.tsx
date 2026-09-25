import React, { useState, useEffect } from 'react';
import { Quote, Plus, Trash2, Upload, Calendar, Image as ImageIcon, X } from 'lucide-react';
import { store } from '../../data/store';
import { Testimony } from '../../types';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

export const AdminTestimonies: React.FC = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>(store.getTestimonies());
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
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
        image: imageUrl,
        name: name || undefined
      });
      setShowModal(false);
      setTitle('');
      setName('');
      setContent('');
      setImageUrl('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400');
      setTestimonies(store.getTestimonies());
    } catch (err: any) {
      alert(err.message || 'Failed to create testimony.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, testTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${testTitle}"?`)) return;
    await store.deleteTestimony(id);
    setTestimonies(store.getTestimonies());
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950">Testimonies Manager</h2>
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

      {/* Testimonies Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
              <tr>
                <th className="p-4 w-20">Photo</th>
                <th className="p-4">Testimony Title</th>
                <th className="p-4">Member Name</th>
                <th className="p-4">Date Shared</th>
                <th className="p-4">Story Snippet</th>
                <th className="p-4 text-right sticky right-0 bg-navy-900 z-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {testimonies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    No testimonies found in database. Click "Post New Testimony" to share a story.
                  </td>
                </tr>
              ) : (
                testimonies.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                      />
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-navy-950 block text-sm">{item.title}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-600">
                      {item.name || 'Anonymous Believer'}
                    </td>
                    <td className="p-4 font-mono text-slate-500">
                      {item.createdAt ? item.createdAt.split('T')[0] : 'Recent'}
                    </td>
                    <td className="p-4 text-slate-600 max-w-xs">
                      <p className="line-clamp-2">{item.content}</p>
                    </td>
                    <td className="p-4 text-right sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)]">
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
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
      </div>

      {/* Create Testimony Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-navy-900 text-white rounded-2xl max-w-2xl w-full p-6 border-2 border-gold-500/40 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="font-black text-lg uppercase font-display text-white">Post Member Testimony</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTestimony} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Testimony Headline *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Delivered from 15 Years of Addiction"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Member / Family Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sis. Ginika Nwachukwu and Family"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Member Photo
                </label>
                <div className="flex items-center gap-4 bg-navy-950/60 p-3 rounded-xl border border-navy-800">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-xl object-cover border border-gold-500/40 shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-navy-800 border border-navy-700 hover:border-gold-500 rounded-lg text-xs font-bold text-slate-300 hover:text-white">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-1.5 bg-navy-950 border border-navy-700 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Full Story & Faith Experience *
                </label>
                <textarea
                  rows={4}
                  placeholder="Write the complete testimony here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
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
                  disabled={uploading || submitting}
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
