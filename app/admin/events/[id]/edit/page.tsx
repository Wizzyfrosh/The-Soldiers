'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Edit3, Loader2, AlertCircle } from 'lucide-react';
import EventForm, { ChurchEventData } from '../../../../../components/admin/EventForm';

export default function EditEventPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<ChurchEventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('sjc_auth_token') : null;
        const res = await fetch(`/api/events/${eventId}?admin=true`, {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load event data.');
        }

        if (data.event) {
          setEvent(data.event);
        } else {
          throw new Error('Event not found.');
        }
      } catch (err: any) {
        console.error('Fetch event for edit error:', err);
        setError(err.message || 'Could not load event.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-slate-900 transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Event Manager
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#F5A623] flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                Edit Church Event
              </h1>
              <p className="text-xs text-gray-500">
                Update gathering details, schedule, flyer media, and publication status.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading ? (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
          <p className="text-sm font-bold text-gray-600">Loading event details...</p>
        </div>
      ) : error ? (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{error}</h3>
            <p className="text-xs text-gray-500 mt-1">
              The event you are trying to edit may have been deleted or is unavailable.
            </p>
          </div>
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            Return to Event List
          </Link>
        </div>
      ) : (
        /* Full-Screen Edit Form */
        <EventForm initialData={event} eventId={eventId} isEditing={true} />
      )}
    </div>
  );
}
