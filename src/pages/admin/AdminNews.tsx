import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { store } from '../../data/store';
import { NewsItem } from '../../types';
import { MediaUploader } from '../../components/admin/MediaUploader';

export const AdminNews: React.FC = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>(store.getNews());
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('/images/worship_hero.jpg');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    store.syncWithBackend();
    return store.subscribe(() => {
      setNewsList(store.getNews());
    });
  }, []);

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both article title and body content.');
      return;
    }

    setSubmitting(true);
    try {
      await store.addNews({
        title: title.trim(),
        content: content.trim(),
        image: imageUrl.trim() || '/images/worship_hero.jpg'
      });
      setShowForm(false);
      setTitle('');
      setContent('');
      setImageUrl('/images/worship_hero.jpg');
      setNewsList(store.getNews());
    } catch (err: any) {
      alert(err.message || 'Failed to create news article.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${itemTitle}"?`)) return;
    try {
      await store.deleteNews(id);
      setNewsList(store.getNews());
    } catch (err: any) {
      alert(err.message || 'Failed to delete news article.');
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* 2. Responsive Page Header: flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950 tracking-tight">
            Latest News Manager
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Publish and manage official church announcements, reports, and community articles.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-3 bg-gold-400 hover:bg-gold-500 text-navy-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showForm ? 'Close Form' : 'Publish News Article'}</span>
        </button>
      </div>

      {/* 2. Responsive Form Wrapper: w-full bg-white rounded-2xl shadow-sm p-6 md:p-8 without fixed height or overflow-y-auto */}
      {showForm && (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6 transition-all">
          <div className="border-b border-slate-200 pb-4">
            <h3 className="text-lg font-black uppercase font-display text-navy-950">
              Publish Church News Article
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the article title, featured photo cover, and complete story body.
            </p>
          </div>

          <form onSubmit={handleCreateNews} className="space-y-5 w-full">
            {/* Title */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Article Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Annual Holy Ghost Convention Announced"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-navy-900 focus:bg-white"
                required
              />
            </div>

            {/* Media Uploader for Cover Image */}
            <MediaUploader
              label="Featured Cover Image"
              value={imageUrl}
              onChange={(url) => setImageUrl(url)}
              type="image"
              placeholder="/images/... or https://... or click upload file"
            />

            {/* Content Textarea */}
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Article Body Content *
              </label>
              <textarea
                rows={6}
                placeholder="Write the full article body text here..."
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
                {submitting ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* News Articles Table Card */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
              <tr>
                <th className="p-4 w-20">Thumbnail</th>
                <th className="p-4">Article Title</th>
                <th className="p-4">Date Published</th>
                <th className="p-4">Excerpt / Preview</th>
                <th className="p-4 text-right sticky right-0 bg-navy-900 z-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {newsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    No news articles published yet. Click "Publish News Article" to post church updates.
                  </td>
                </tr>
              ) : (
                newsList.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <img
                        src={item.image || '/images/worship_hero.jpg'}
                        alt={item.title}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0"
                      />
                    </td>
                    <td className="p-4 font-bold text-navy-950 text-sm">
                      {item.title}
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
                        title="Delete article"
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
