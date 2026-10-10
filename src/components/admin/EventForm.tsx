import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { store } from '../../data/store';
import { api } from '../../services/api';
import { ChurchEvent } from '../../types';

interface EventFormProps {
  initialData?: Partial<ChurchEvent> | null;
  eventId?: string;
  isEditing?: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  eventId,
  isEditing = false
}) => {
  const navigate = useNavigate();

  const formatForInput = (dateStr?: string, defaultHour: number = 8): string => {
    if (!dateStr) {
      const now = new Date();
      now.setHours(defaultHour, 0, 0, 0);
      return now.toISOString().slice(0, 16);
    }
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr.slice(0, 16);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch {
      return dateStr.slice(0, 16);
    }
  };

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState(formatForInput(initialData?.startDate, 8));
  const [endDate, setEndDate] = useState(formatForInput(initialData?.endDate, 12));
  const [location, setLocation] = useState(initialData?.location || 'Soldiers Main Sanctuary');
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'CANCELLED'>(
    initialData?.status || 'PUBLISHED'
  );
  const [category, setCategory] = useState<string>(initialData?.category || 'Worship');
  const [image, setImage] = useState(initialData?.image || '');
  const [capacity, setCapacity] = useState<string>(
    initialData?.capacity ? String(initialData.capacity) : '300'
  );

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const res = await api.upload.file(file);
      if (res.url) {
        setImage(res.url);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an event title.');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please provide both start and end date/time.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const startObj = new Date(startDate);
      const endObj = new Date(endDate);

      const displayDate = startObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      const startTimeStr = startObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const endTimeStr = endObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
      const displayTime = `${startTimeStr} - ${endTimeStr}`;

      const payload = {
        title: title.trim(),
        description: description.trim(),
        date: displayDate,
        startDate: startObj.toISOString(),
        endDate: endObj.toISOString(),
        time: displayTime,
        location: location.trim(),
        status,
        category: category as any,
        image: image.trim() || undefined,
        capacity: capacity ? parseInt(capacity, 10) : 300,
        registrationRequired: true
      };

      if (isEditing && eventId) {
        await store.updateEvent(eventId, payload);
      } else {
        await store.addEvent(payload);
      }

      navigate('/admin/events');
    } catch (err: any) {
      console.error('Save event error:', err);
      setError(err.message || 'An error occurred while saving the event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8 pb-24">
      {error && (
        <div className="w-full bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* SECTION 1 — Event Details */}
      <section className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#F5A623]">
            Section 1
          </span>
          <h3 className="text-lg md:text-xl font-black uppercase text-slate-900 tracking-tight">
            Event Details
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Define the headline name and complete event narrative.
          </p>
        </div>

        <div className="space-y-5 w-full">
          <div className="w-full space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Kaduna Miracle & Prophetic Encounter 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F5A623] outline-none text-slate-900 text-sm font-medium"
              required
            />
          </div>

          <div className="w-full space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description <span className="text-gray-400 font-normal">(Details, Theme, Expectations)</span>
            </label>
            <textarea
              rows={5}
              placeholder="Provide complete details about this gathering, scripture references, what attendees should expect, and special instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F5A623] outline-none resize-none text-slate-900 text-sm leading-relaxed"
            />
          </div>
        </div>
      </section>

      {/* SECTION 2 — Schedule & Location */}
      <section className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#F5A623]">
            Section 2
          </span>
          <h3 className="text-lg md:text-xl font-black uppercase text-slate-900 tracking-tight">
            Schedule & Location
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Specify precise gathering times and physical or online sanctuary venue.
          </p>
        </div>

        <div className="space-y-5 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="w-full space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Start Date & Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F5A623] outline-none text-slate-900 text-sm font-medium"
                required
              />
            </div>

            <div className="w-full space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                End Date & Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F5A623] outline-none text-slate-900 text-sm font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="w-full space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Location / Venue <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Soldiers Main Sanctuary, Kaduna"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F5A623] outline-none text-slate-900 text-sm font-medium"
                required
              />
            </div>

            <div className="w-full space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Expected Max Capacity
              </label>
              <input
                type="number"
                placeholder="300"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F5A623] outline-none text-slate-900 text-sm font-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Publication Settings */}
      <section className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#F5A623]">
            Section 3
          </span>
          <h3 className="text-lg md:text-xl font-black uppercase text-slate-900 tracking-tight">
            Publication Settings
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure accessibility, category segmentation, and lifecycle status.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="w-full space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Publication Status <span className="text-rose-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'PUBLISHED' | 'DRAFT' | 'CANCELLED')}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F5A623] outline-none text-slate-900 text-sm font-bold bg-white"
            >
              <option value="PUBLISHED">PUBLISHED (Visible to Public)</option>
              <option value="DRAFT">DRAFT (Admin Archive Only)</option>
              <option value="CANCELLED">CANCELLED (Marked Cancelled)</option>
            </select>
          </div>

          <div className="w-full space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Ministry Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F5A623] outline-none text-slate-900 text-sm font-bold bg-white"
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
      </section>

      {/* SECTION 4 — Event Flyer / Poster */}
      <section className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#F5A623]">
            Section 4
          </span>
          <h3 className="text-lg md:text-xl font-black uppercase text-slate-900 tracking-tight">
            Event Flyer / Poster
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Upload official artwork or poster stored securely via Cloudinary.
          </p>
        </div>

        <div className="space-y-4 w-full">
          <div className="w-full">
            <label className="w-full border-2 border-dashed border-gray-300 hover:border-[#F5A623] hover:bg-amber-50/20 rounded-xl p-8 md:p-12 flex flex-col items-center justify-center cursor-pointer transition-all block text-center">
              {uploading ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-10 h-10 animate-spin text-[#F5A623]" />
                  <span className="text-sm font-bold text-slate-800">
                    Uploading image to Cloudinary...
                  </span>
                  <span className="text-xs text-gray-500">Please wait while media is processed</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#F5A623] flex items-center justify-center shadow-sm">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm md:text-base font-extrabold text-slate-900 block">
                      Click to browse or upload flyer image
                    </span>
                    <span className="text-xs text-gray-500 mt-1 block">
                      PNG, JPG, WEBP up to 500 MB (Direct Cloudinary upload)
                    </span>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="w-full space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-gray-600">
              Or paste direct image URL:
            </label>
            <input
              type="text"
              placeholder="https://res.cloudinary.com/... or https://..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F5A623] outline-none text-slate-900 text-xs"
            />
          </div>

          {image && (
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-slate-900 w-full max-w-md mx-auto group shadow-md mt-4">
              <img
                src={image}
                alt="Event Flyer Preview"
                className="w-full h-64 object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-rose-700 transition-colors shadow-lg cursor-pointer"
                >
                  <X className="w-4 h-4" /> Remove Flyer
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sticky Submit Bar */}
      <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-gray-200 p-4 md:p-6 flex flex-col sm:flex-row gap-3 justify-end z-40 shadow-lg">
        <Link
          to="/admin/events"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-center text-xs uppercase tracking-wider flex items-center justify-center"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting || uploading}
          className="w-full sm:w-auto px-8 py-3 bg-[#F5A623] hover:bg-[#E09612] text-slate-950 font-black rounded-xl shadow-md transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Saving Event...</span>
            </>
          ) : (
            <span>{isEditing ? 'Update Event' : 'Publish Event'}</span>
          )}
        </button>
      </div>
    </form>
  );
};
