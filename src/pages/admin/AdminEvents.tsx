import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import { store } from '../../data/store';
import { ChurchEvent } from '../../types';

type AdminEventFilter = 'ALL' | 'UPCOMING' | 'PAST' | 'DRAFTS';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<ChurchEvent[]>(store.getEvents());
  const [filterStatus, setFilterStatus] = useState<AdminEventFilter>('ALL');

  useEffect(() => {
    store.syncWithBackend();
    return store.subscribe(() => {
      setEvents(store.getEvents());
    });
  }, []);

  const handleDelete = async (id: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete event "${eventTitle}"?`)) return;
    try {
      await store.deleteEvent(id);
      setEvents(store.getEvents());
    } catch (err: any) {
      alert(err.message || 'Failed to delete event.');
    }
  };

  const handleExportCSV = () => {
    const headers = "ID,Title,Status,Category,StartDate,EndDate,Location,RegistrationsCount\n";
    const rows = events.map(e => `"${e.id}","${e.title}","${e.status || 'PUBLISHED'}","${e.category}","${e.startDate || e.date}","${e.endDate || e.date}","${e.location}",${e.registrationsCount}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sjc_events_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getEventStatusBadge = (event: ChurchEvent) => {
    if (event.status === 'DRAFT') {
      return { label: 'DRAFT', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    if (event.status === 'CANCELLED') {
      return { label: 'CANCELLED', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
    }

    const now = new Date();
    const endDateObj = event.endDate ? new Date(event.endDate) : (event.startDate ? new Date(event.startDate) : new Date(event.date));
    const isPast = !isNaN(endDateObj.getTime()) && endDateObj < now;

    if (isPast) {
      return { label: 'PAST', bg: 'bg-slate-100 text-slate-700 border-slate-300' };
    }

    return { label: 'UPCOMING', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  };

  const filteredEvents = events.filter((ev) => {
    if (filterStatus === 'ALL') return true;
    const badge = getEventStatusBadge(ev);
    if (filterStatus === 'UPCOMING') return badge.label === 'UPCOMING';
    if (filterStatus === 'PAST') return badge.label === 'PAST';
    if (filterStatus === 'DRAFTS') return ev.status === 'DRAFT';
    return true;
  });

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Responsive Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950 tracking-tight">
            Event Manager & Archive
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            All events are preserved indefinitely. Manage upcoming, past, and draft gatherings.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="w-full sm:w-auto px-4 py-3 bg-slate-200 hover:bg-slate-300 text-navy-950 font-bold text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Link
            to="/admin/events/new"
            className="w-full sm:w-auto px-6 py-3 bg-[#F5A623] hover:bg-[#E09612] text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer text-center"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ ADD NEW EVENT</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto w-full">
        {(['ALL', 'UPCOMING', 'PAST', 'DRAFTS'] as AdminEventFilter[]).map((st) => {
          const isActive = filterStatus === st;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-navy-950 text-gold-400 border-gold-500 shadow-md'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {st === 'ALL' ? `All (${events.length})` : st}
            </button>
          );
        })}
      </div>

      {/* Events Table Card */}
      <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs min-w-[900px]">
            <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
              <tr>
                <th className="p-4 w-16">Flyer</th>
                <th className="p-4">Event Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date Range & Time</th>
                <th className="p-4">Location</th>
                <th className="p-4 text-center">RSVPs</th>
                <th className="p-4 text-right sticky right-0 bg-navy-900 z-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No events match the selected status filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => {
                  const statusInfo = getEventStatusBadge(ev);
                  return (
                    <tr key={ev.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        {ev.image ? (
                          <img
                            src={ev.image}
                            alt={ev.title}
                            className={`w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm shrink-0 ${
                              statusInfo.label === 'PAST' ? 'grayscale opacity-75' : ''
                            }`}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-navy-900/10 border border-navy-900/20 flex items-center justify-center text-navy-900 shrink-0">
                            <ImageIcon className="w-5 h-5 opacity-40" />
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-navy-950 text-sm">{ev.title}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ev.description}</div>
                      </td>
                      
                      {/* Status Column with Badges */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider shadow-sm inline-block ${statusInfo.bg}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md font-black text-[10px] uppercase bg-navy-900 text-gold-400">
                          {ev.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-medium text-slate-800">
                        <div>{ev.date}</div>
                        <div className="text-[11px] text-slate-500">{ev.time}</div>
                      </td>
                      <td className="p-4 text-slate-700">{ev.location}</td>
                      <td className="p-4 text-center font-black text-gold-600 text-sm">
                        {ev.registrationsCount}
                        <span className="block text-[10px] font-normal text-slate-400">of {ev.capacity || 300} max</span>
                      </td>
                      <td className="p-4 text-right sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)]">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/events/${ev.id}/edit`}
                            className="p-2 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 inline-flex items-center justify-center"
                            title="Edit Event (Full-Screen Form)"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(ev.id, ev.title)}
                            className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
