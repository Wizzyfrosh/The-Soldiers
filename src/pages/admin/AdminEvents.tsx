import React, { useState, useEffect } from 'react';
import { Plus, Download, Calendar, MapPin, Users, Upload, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { store } from '../../data/store';
import { ChurchEvent } from '../../types';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<ChurchEvent[]>(store.getEvents());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    store.syncWithBackend();
    return store.subscribe(() => {
      setEvents(store.getEvents());
    });
  }, []);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('2026-10-03');
  const [time, setTime] = useState('8:00 AM - 12:00 PM');
  const [location, setLocation] = useState('Soldiers Main Sanctuary');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [capacity, setCapacity] = useState('300');
  const [category, setCategory] = useState<'Worship' | 'Youth' | 'Community' | 'Men' | 'Women' | 'Conference'>('Worship');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.upload.file(file);
      setImage(res.url);
    } catch (err: any) {
      alert(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setSubmitting(true);
    try {
      await store.addEvent({
        title,
        description,
        date,
        time,
        location,
        image: image.trim() || undefined,
        category,
        registrationRequired: true,
        capacity: capacity ? parseInt(capacity, 10) : 300
      });

      setShowModal(false);
      setTitle('');
      setDescription('');
      setImage('');
      setCapacity('300');
    } catch (err: any) {
      alert(err.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, eventTitle: string) => {
    if (!confirm(`Are you sure you want to delete event "${eventTitle}"?`)) return;
    try {
      await store.deleteEvent(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete event.');
    }
  };

  const handleExportCSV = () => {
    const headers = "ID,Title,Date,Location,Category,RegistrationsCount,Image\n";
    const rows = events.map(e => `"${e.id}","${e.title}","${e.date}","${e.location}","${e.category}",${e.registrationsCount},"${e.image || ''}"`).join("\n");
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
              <th className="p-4 w-16">Flyer</th>
              <th className="p-4">Event Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Location</th>
              <th className="p-4 text-center">RSVPs</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {events.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No events found in the database. Click "Create New Event" above to schedule one.
                </td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    {ev.image ? (
                      <img
                        src={ev.image}
                        alt={ev.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-navy-900/10 border border-navy-900/20 flex items-center justify-center text-navy-900">
                        <ImageIcon className="w-5 h-5 opacity-40" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-navy-950 text-sm">{ev.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{ev.description}</div>
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
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(ev.id, ev.title)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Event"
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

      {/* Create Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-navy-900 text-white rounded-2xl max-w-xl w-full p-6 border-2 border-gold-500/40 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="font-black text-lg uppercase font-display text-white">Create Church Event</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  placeholder="e.g. KADUNA 2026 Wonderful Move Of God As Of Old"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              {/* Event Image / Flyer Upload Field */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Event Flyer / Poster Image
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-navy-950/60 p-3.5 rounded-xl border border-navy-800">
                  {image ? (
                    <div className="relative group shrink-0">
                      <img
                        src={image}
                        alt="Poster Preview"
                        className="w-24 h-28 rounded-lg object-cover border-2 border-gold-500/60 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full shadow hover:bg-rose-700"
                        title="Remove Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-28 rounded-lg border-2 border-dashed border-navy-700 bg-navy-950 flex flex-col items-center justify-center text-slate-500 shrink-0">
                      <ImageIcon className="w-7 h-7 mb-1 opacity-50" />
                      <span className="text-[10px] uppercase font-bold text-slate-400">Flyer</span>
                    </div>
                  )}

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-4 py-2 bg-navy-800 border border-navy-700 hover:border-gold-500 rounded-xl text-xs font-bold uppercase text-gold-400 hover:text-white transition-all flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
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
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3 py-1.5 bg-navy-950 border border-navy-700 rounded-lg text-white text-xs placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="Worship">Worship</option>
                    <option value="Youth">Youth</option>
                    <option value="Community">Community</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Time *</label>
                  <input
                    type="text"
                    placeholder="e.g. 8:00 AM - 12:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Soldiers Main Sanctuary"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Description *</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of the upcoming gathering..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
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
                  {submitting ? 'Creating Event...' : 'Create Event'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
