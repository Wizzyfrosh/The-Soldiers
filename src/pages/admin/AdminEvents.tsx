import React, { useState, useEffect } from 'react';
import { Plus, Download, Calendar, MapPin, Users, Upload, Trash2, Edit3, Image as ImageIcon, X, Clock, Tag } from 'lucide-react';
import { store } from '../../data/store';
import { ChurchEvent, EventStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

type AdminEventFilter = 'ALL' | 'UPCOMING' | 'PAST' | 'DRAFTS';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<ChurchEvent[]>(store.getEvents());
  const [filterStatus, setFilterStatus] = useState<AdminEventFilter>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);

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
  const [startDate, setStartDate] = useState('2026-10-03');
  const [endDate, setEndDate] = useState('2026-10-03');
  const [status, setStatus] = useState<EventStatus>('PUBLISHED');
  const [time, setTime] = useState('8:00 AM - 12:00 PM');
  const [location, setLocation] = useState('Soldiers Main Sanctuary');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [capacity, setCapacity] = useState('300');
  const [category, setCategory] = useState<'Worship' | 'Youth' | 'Community' | 'Men' | 'Women' | 'Conference'>('Worship');

  const openCreateModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setDate('2026-10-03');
    setStartDate('2026-10-03T08:00');
    setEndDate('2026-10-03T12:00');
    setStatus('PUBLISHED');
    setTime('8:00 AM - 12:00 PM');
    setLocation('Soldiers Main Sanctuary');
    setImage('');
    setCapacity('300');
    setCategory('Worship');
    setShowModal(true);
  };

  const openEditModal = (ev: ChurchEvent) => {
    setEditingEvent(ev);
    setTitle(ev.title);
    setDescription(ev.description || '');
    setDate(ev.date || '2026-10-03');
    setStartDate(ev.startDate ? ev.startDate.slice(0, 16) : `${ev.date || '2026-10-03'}T08:00`);
    setEndDate(ev.endDate ? ev.endDate.slice(0, 16) : `${ev.date || '2026-10-03'}T12:00`);
    setStatus(ev.status || 'PUBLISHED');
    setTime(ev.time || '8:00 AM - 12:00 PM');
    setLocation(ev.location || 'Soldiers Main Sanctuary');
    setImage(ev.image || '');
    setCapacity(String(ev.capacity || 300));
    setCategory(ev.category || 'Worship');
    setShowModal(true);
  };

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setSubmitting(true);
    try {
      const eventData = {
        title,
        description,
        date,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        status,
        time,
        location,
        image: image.trim() || undefined,
        category,
        registrationRequired: true,
        capacity: capacity ? parseInt(capacity, 10) : 300
      };

      if (editingEvent) {
        await store.updateEvent(editingEvent.id, eventData);
      } else {
        await store.addEvent(eventData);
      }

      setShowModal(false);
      setEditingEvent(null);
      setEvents(store.getEvents());
    } catch (err: any) {
      alert(err.message || 'Failed to save event.');
    } finally {
      setSubmitting(false);
    }
  };

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

  // Helper to determine status badge display
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

  // Filter events based on active admin filter tab
  const filteredEvents = events.filter((ev) => {
    if (filterStatus === 'ALL') return true;
    const badge = getEventStatusBadge(ev);
    if (filterStatus === 'UPCOMING') return badge.label === 'UPCOMING';
    if (filterStatus === 'PAST') return badge.label === 'PAST';
    if (filterStatus === 'DRAFTS') return ev.status === 'DRAFT';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950">Event Manager & Archive</h2>
          <p className="text-xs text-slate-500">All events are preserved indefinitely. Manage upcoming, past, and draft gatherings.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-navy-950 font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Button variant="gold" size="md" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
            Create New Event
          </Button>
        </div>
      </div>

      {/* 5. Filter Tabs at Top */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        {(['ALL', 'UPCOMING', 'PAST', 'DRAFTS'] as AdminEventFilter[]).map((st) => {
          const isActive = filterStatus === st;
          return (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${
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

      {/* 5. Events Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
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
                      
                      {/* 5. Status Column with Badges */}
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
                          <button
                            onClick={() => openEditModal(ev)}
                            className="p-2 text-slate-600 hover:text-navy-950 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
                            title="Edit Event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ev.id, ev.title)}
                            className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
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

      {/* Create / Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-navy-900 text-white rounded-2xl max-w-xl w-full p-4 sm:p-6 border-2 border-gold-500/40 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="font-black text-base sm:text-lg uppercase font-display text-white">
                {editingEvent ? 'Edit Church Event' : 'Create Church Event'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
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

              {/* Status & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EventStatus)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 font-bold"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
                    <option value="DRAFT">DRAFT (Admin Only)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="Worship">Worship Service</option>
                    <option value="Conference">Conference / Revival</option>
                    <option value="Community">Community / Outreach</option>
                    <option value="Youth">Youth Ministry</option>
                    <option value="Men">Men's Ministry</option>
                    <option value="Women">Women's Ministry</option>
                  </select>
                </div>
              </div>

              {/* Start & End Date Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    required
                  />
                </div>
              </div>

              {/* Flyer Image Upload */}
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
                      <span className="text-[11px] text-slate-400">or paste URL below</span>
                    </div>
                    <input
                      type="text"
                      placeholder="https://... or /images/..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3 py-2 bg-navy-950 border border-navy-700 rounded-lg text-white text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Display Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                    placeholder="e.g. October 3, 2026"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Time Range</label>
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  placeholder="Details about the event, what to bring, theme..."
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
                  {submitting ? 'Saving...' : (editingEvent ? 'Update Event' : 'Schedule Event')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
