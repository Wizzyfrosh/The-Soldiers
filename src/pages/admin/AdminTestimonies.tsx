import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { store } from '../../data/store';
import { Testimony } from '../../types';
import { MediaUploader } from '../../components/admin/MediaUploader';

export const AdminTestimonies: React.FC = () => {
  const [testimonies, setTestimonies] = useState<Testimony[]>(store.getTestimonies());
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    store.syncWithBackend();
    return store.subscribe(() => {
      setTestimonies(store.getTestimonies());
    });
  }, []);

  const handleCreateTestimony = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Please fill in testimony title and story.');
      return;
    }

    setSubmitting(true);
    try {
      const defaultImage = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400';
      await store.addTestimony({
        title,
        content,
        image: imageUrl.trim() || defaultImage,
        name: name.trim() || undefined
      });

      setShowForm(false);
      setTitle('');
      setName('');
      setContent('');
      setImageUrl('');
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
    <div className="space-y-6 w-full max-w-full">
      {/* 2. Responsive Page Header: flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950 tracking-tight">
            Testimonies Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage member faith breakthroughs, miraculous healings, and life transformation stories.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-3 bg-gold-400 hover:bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showForm ? 'Close Form' : 'Post New Testimony'}</span>
        </button>
      </div>

      {/* 2. Responsive Form Wrapper: w-full bg-white rounded-2xl shadow-sm p-6 md:p-8 without fixed height or overflow-y-auto */}
      {showForm && (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6 transition-all">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-black uppercase font-display text-navy-950">
              Post Member Testimony
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the member name, headline story, photo upload, and complete testimony text.
            </p>
          </div>

          <form onSubmit={handleCreateTestimony} className="space-y-5 w-full">
            {/* Title */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Testimony Headline *
              </label>
              <input
                type="text"
                placeholder="e.g. Delivered from 15 Years of Addiction"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                required
              />
            </div>

            {/* Member Name */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Member / Family Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Sis. Ginika Nwachukwu and Family"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
              />
            </div>

            {/* Photo Upload Widget */}
            <MediaUploader
              label="Member Photo"
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              type="image"
              placeholder="https://images.unsplash.com/... or click upload file"
            />

            {/* Content Textarea */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Full Story & Faith Experience *
              </label>
              <textarea
                rows={6}
                placeholder="Write the complete testimony here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white leading-relaxed"
                required
              />
            </div>

            {/* Form Actions: Buttons must be w-full sm:w-auto */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 w-full">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full sm:w-auto px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs uppercase rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 bg-navy-950 hover:bg-navy-900 text-gold-400 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg border border-gold-500/30 cursor-pointer"
              >
                {submitting ? 'Publishing...' : 'Publish Testimony'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonies Table Card */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
              <tr>
                <th className="p-4 w-20">Photo</th>
                <th className="p-4">Testimony Title</th>
                <th className="p-4">Member Name</th>
                <th className="p-4">Date Shared</th>
                <th className="p-4">Story Snippet</th>
                <th className="p-4 text-right">Actions</th>
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
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
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
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id, item.title)}
                        className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
    </div>
  );
};
