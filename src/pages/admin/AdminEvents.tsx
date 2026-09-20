import React, { useState } from 'react';
import { Plus, Download, Calendar, MapPin, Users } from 'lucide-react';
import { store } from '../../data/store';
import { ChurchEvent } from '../../types';
import { Button } from '../../components/common/Button';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<ChurchEvent[]>(store.getEvents());
  const [showModal, setShowModal] = useState(false);

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-11-01');
  const [time, setTime] = useState('6:00 PM');
  const [location, setLocation] = useState('Main Sanctuary');
  const [category, setCategory] = useState<'Worship' | 'Youth' | 'Community' | 'Men' | 'Women' | 'Conference'>('Worship');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    store.addEvent({
      title,
      description,
      date,
      time,
      location,
      image: '/images/worship_hero.jpg',
      category,
      registrationRequired: true,
      capacity: 300
    });

    setEvents(store.getEvents());
    setShowModal(false);
    setTitle('');
    setDescription('');
  };

  const handleExportCSV = () => {
    const headers = "ID,Title,Date,Location,Category,RegistrationsCount\n";
    const rows = events.map(e => `"${e.id}","${e.title}","${e.date}","${e.location}","${e.category}",${e.registrationsCount}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sjc_events_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase font-display text-navy-950">Event Manager</h2>
          <p className="text-xs text-slate-500">Create events and export RSVP lists.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-navy-950 font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Button variant="gold" size="md" onClick={() => setShowModal(true)} icon={<Plus className="w-4 h-4" />}>
            Create New Event
          </Button>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
            <tr>
              <th className="p-4">Event Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-right">RSVPs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-navy-950 text-sm">{ev.title}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded font-black text-[10px] uppercase bg-navy-900 text-gold-400">
                    {ev.category}
                  </span>
                </td>
                <td className="p-4 font-mono">{ev.date} ({ev.time})</td>
                <td className="p-4">{ev.location}</td>
                <td className="p-4 text-right font-black text-gold-600 text-sm">{ev.registrationsCount} Registered</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-navy-900 text-white rounded-2xl max-w-lg w-full p-6 border-2 border-gold-500/40 shadow-2xl space-y-4">
            <h3 className="font-black text-lg uppercase font-display text-white">Create Church Event</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Event Title</label>
                <input
                  type="text"
                  placeholder="e.g. Night of Prophetic Praise"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                />
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
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
