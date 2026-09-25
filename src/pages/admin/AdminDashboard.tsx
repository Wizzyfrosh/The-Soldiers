import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, Video, Inbox, ArrowUpRight, Plus, CheckCircle, Shield } from 'lucide-react';
import { store } from '../../data/store';

export const AdminDashboard: React.FC = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    store.syncWithBackend();
    return store.subscribe(() => setTick(t => t + 1));
  }, []);

  const donations = store.getDonations();
  const events = store.getEvents();
  const sermons = store.getSermons();
  const submissions = store.getSubmissions();

  const totalGivingMonth = donations.reduce((sum, d) => sum + d.amount, 0);
  const unreadCount = submissions.filter(s => !s.isRead).length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-navy-900 text-white p-8 rounded-2xl border-2 border-gold-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-gold-400 font-extrabold text-xs uppercase tracking-widest">DASHBOARD OVERVIEW</span>
          <h2 className="text-2xl md:text-3xl font-black uppercase font-display">Welcome Back, Prophet Ebelechukwu</h2>
          <p className="text-xs text-slate-300">Here is what's happening across the Soldiers of Jesus Christ ministry today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/events">
            <button className="px-4 py-2.5 rounded-xl bg-gold-500 text-navy-950 font-bold text-xs uppercase flex items-center gap-1.5 shadow-gold hover:bg-gold-400">
              <Plus className="w-4 h-4" /> Add Event
            </button>
          </Link>
          <Link to="/admin/sermons">
            <button className="px-4 py-2.5 rounded-xl bg-navy-800 border border-navy-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 hover:border-gold-500">
              <Plus className="w-4 h-4 text-gold-400" /> Post Sermon
            </button>
          </Link>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Monthly Giving</span>
            <span className="text-2xl font-black text-navy-950 font-display">${totalGivingMonth.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 font-bold block">↑ +14.2% from last month</span>
          </div>
          <div className="p-3 bg-gold-500/20 text-gold-600 rounded-xl">
            <Heart className="w-6 h-6 fill-gold-500 text-gold-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Events</span>
            <span className="text-2xl font-black text-navy-950 font-display">{events.length} Gatherings</span>
            <span className="text-[10px] text-slate-500 font-bold block">631 RSVPs Confirmed</span>
          </div>
          <div className="p-3 bg-navy-900 text-gold-400 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Unread Inbox</span>
            <span className="text-2xl font-black text-navy-950 font-display">{unreadCount} Pending</span>
            <span className="text-[10px] text-red-600 font-bold block">Prayer & VIP Visits</span>
          </div>
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Sermon Library</span>
            <span className="text-2xl font-black text-navy-950 font-display">{sermons.length} Messages</span>
            <span className="text-[10px] text-emerald-600 font-bold block">YouTube Synced</span>
          </div>
          <div className="p-3 bg-navy-900 text-gold-400 rounded-xl">
            <Video className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Recent Activity Ledger Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Form Submissions */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-base uppercase font-display text-navy-950">Recent Submissions Inbox</h3>
            <Link to="/admin/inbox" className="text-xs font-extrabold text-gold-600 uppercase hover:underline">View All Inbox</Link>
          </div>

          <div className="space-y-3">
            {submissions.slice(0, 3).map((sub) => (
              <div key={sub.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-navy-900 text-gold-400 mb-1 inline-block">
                    {sub.type.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-xs text-navy-950">{sub.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{sub.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{sub.createdAt.split('T')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Giving Transactions */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-base uppercase font-display text-navy-950">Recent Online Donations</h3>
            <Link to="/admin/giving" className="text-xs font-extrabold text-gold-600 uppercase hover:underline">View Giving Ledger</Link>
          </div>

          <div className="space-y-3">
            {donations.slice(0, 3).map((don) => (
              <div key={don.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-navy-950">{don.donorName}</h4>
                  <span className="text-[10px] text-slate-500 font-medium block">{don.fund} • {don.frequency}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-gold-600 font-display">${don.amount.toFixed(2)}</span>
                  <span className="text-[10px] text-emerald-600 font-bold block">✓ Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
