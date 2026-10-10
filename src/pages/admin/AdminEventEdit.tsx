import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, Loader2, AlertCircle } from 'lucide-react';
import { store } from '../../data/store';
import { ChurchEvent } from '../../types';
import { EventForm } from '../../components/admin/EventForm';

export const AdminEventEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<ChurchEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    // Look up event from store first
    const existing = store.getEvents().find(e => e.id === id);
    if (existing) {
      setEvent(existing);
      setLoading(false);
    } else {
      store.syncWithBackend().then(() => {
        const found = store.getEvents().find(e => e.id === id);
        if (found) {
          setEvent(found);
        } else {
          setError('Event not found.');
        }
        setLoading(false);
      }).catch(err => {
        setError(err.message || 'Failed to load event.');
        setLoading(false);
      });
    }
  }, [id]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <Link
            to="/admin/events"
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
            to="/admin/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors"
          >
            Return to Event List
          </Link>
        </div>
      ) : (
        <EventForm initialData={event} eventId={id} isEditing={true} />
      )}
    </div>
  );
};
