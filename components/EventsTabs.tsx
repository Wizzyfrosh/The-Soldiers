import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, History } from 'lucide-react';

export type EventTabType = 'upcoming' | 'past';

interface EventsTabsProps {
  activeTab: EventTabType;
  onTabChange: (tab: EventTabType) => void;
  upcomingCount?: number;
  pastCount?: number;
}

export const EventsTabs: React.FC<EventsTabsProps> = ({
  activeTab,
  onTabChange,
  upcomingCount,
  pastCount
}) => {
  const tabs: { id: EventTabType; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'upcoming',
      label: 'Upcoming Events',
      icon: <Calendar className="w-4 h-4" />,
      count: upcomingCount
    },
    {
      id: 'past',
      label: 'Past Events Archive',
      icon: <History className="w-4 h-4" />,
      count: pastCount
    }
  ];

  return (
    <div className="flex items-center justify-center my-6">
      <div className="inline-flex p-1.5 bg-slate-200/80 backdrop-blur-md rounded-2xl border border-slate-300 shadow-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-colors duration-200 flex items-center gap-2.5 z-10 ${
                isActive ? 'text-navy-950' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeEventTabIndicator"
                  className="absolute inset-0 bg-white rounded-xl shadow-md border border-gold-400/50 -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-navy-950 text-gold-400' : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
