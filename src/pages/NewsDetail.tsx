import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { store } from '../data/store';
import { NewsItem } from '../types';
import { FadeIn } from '../components/common/Animations';

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

export const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);

      // Try from store first
      const cached = store.getNews().find(n => n.id === id);
      if (cached) {
        setArticle(cached);
        setLoading(false);
        return;
      }

      // Fetch from API
      try {
        const res = await api.news.getById(id!);
        if (res.article) {
          setArticle(res.article);
        }
      } catch (err) {
        console.error('Failed to fetch news article:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Newspaper className="w-16 h-16 text-slate-300 mx-auto" />
          <h2 className="text-2xl font-black uppercase font-display text-navy-950">Article Not Found</h2>
          <p className="text-slate-500 text-sm">This news article may have been removed or doesn't exist.</p>
          <Link to="/" className="inline-flex items-center gap-2 text-gold-600 font-bold text-sm hover:text-gold-500 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative h-[400px] md:h-[500px] w-full overflow-hidden"
      >
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />
        
        {/* Back nav */}
        <div className="absolute top-6 left-6 z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-gold-500 text-navy-950 rounded-md mb-4">
              NEWS
            </span>
            <h1 className="text-3xl md:text-5xl font-black uppercase font-display text-white leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center gap-2 mt-4 text-gold-400 text-sm font-bold">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.createdAt || article.date || '')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Article Content */}
      <FadeIn>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 md:p-12">
            <div className="prose prose-lg prose-slate max-w-none">
              {article.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() && (
                  <p key={idx} className="text-[#2A2A2A] text-base leading-relaxed mb-4">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>

          {/* Back button */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-gold-400 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-navy-800 transition-colors shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All News
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
