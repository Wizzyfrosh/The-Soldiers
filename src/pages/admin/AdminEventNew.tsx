import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarPlus } from 'lucide-react';
import { EventForm } from '../../components/admin/EventForm';

export const AdminEventNew: React.FC = () => {
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
              <CalendarPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                Create New Church Event
              </h1>
              <p className="text-xs text-gray-500">
                Publish or draft a gathering across our digital and physical sanctuary.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Screen Form */}
      <EventForm />
    </div>
  );
};
