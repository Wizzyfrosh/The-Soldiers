import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { SectionHeader } from '../common/SectionHeader';
import { FadeIn, StaggerContainer, StaggerItem } from '../common/Animations';
import { NewsItem } from '../../types';

interface LatestNewsSectionProps {
  newsItems: NewsItem[];
}

const formatNewsDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({ newsItems }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <FadeIn>
          <SectionHeader
            badge="LATEST NEWS"
            title="Stay Connected & Informed"
            subtitle="Catch up on the latest happenings, announcements, and stories from within our church family."
          />
        </FadeIn>

        {newsItems.length === 0 ? (
          <FadeIn>
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-7 h-7 text-gold-500" />
              </div>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                News articles and announcements will appear here once published. Check back soon!
              </p>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            {newsItems.map((item) => (
              <StaggerItem key={item.id}>
                <Link to={`/news/${item.id}`} className="block h-full">
                  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
                    {/* Image */}
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-1.5 text-gold-600 text-xs font-bold mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatNewsDate(item.createdAt || item.date || '')}</span>
                      </div>

                      <h4 className="text-base font-extrabold text-[#1A1A1A] uppercase font-display leading-snug line-clamp-2 group-hover:text-navy-700 transition-colors">
                        {item.title}
                      </h4>

                      <p className="text-sm text-[#4A4A4A] leading-relaxed mt-2 line-clamp-3 flex-1">
                        {item.excerpt || item.content}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-600 group-hover:text-gold-500">
                          Read More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}

      </div>
    </section>
  );
};
