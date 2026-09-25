import React, { useState, useEffect } from 'react';
import { Inbox, CheckCircle, Mail, Phone, Calendar, User, Eye, EyeOff, Trash2, ArrowLeft } from 'lucide-react';
import { store } from '../../data/store';
import { FormSubmission } from '../../types';
import { Button } from '../../components/common/Button';

export const AdminInbox: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>(store.getSubmissions());
  const [selectedSub, setSelectedSub] = useState<FormSubmission | null>(submissions[0] || null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  useEffect(() => {
    store.syncWithBackend();
    return store.subscribe(() => {
      const updated = store.getSubmissions();
      setSubmissions(updated);
      if (!selectedSub && updated.length > 0) {
        setSelectedSub(updated[0]);
      } else if (selectedSub && !updated.some(s => s.id === selectedSub.id)) {
        setSelectedSub(updated[0] || null);
      }
    });
  }, []);

  const handleToggleRead = (id: string) => {
    store.toggleReadSubmission(id);
    setSubmissions(store.getSubmissions());
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub({ ...selectedSub, isRead: !selectedSub.isRead });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return;
    await store.deleteSubmission(id);
    const updated = store.getSubmissions();
    setSubmissions(updated);
    if (selectedSub?.id === id) {
      setSelectedSub(updated[0] || null);
      setMobileDetailOpen(false);
    }
  };

  const handleSelectSub = (sub: FormSubmission) => {
    setSelectedSub(sub);
    setMobileDetailOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div>
        <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950">Form Submissions Inbox</h2>
        <p className="text-xs text-slate-500">Prayer requests, VIP visits, and contact form entries.</p>
      </div>

      {/* Split Pane Inbox */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* Left List */}
        <div className={`lg:col-span-5 border-r border-slate-200 divide-y divide-slate-100 overflow-y-auto max-h-[600px] ${mobileDetailOpen ? 'hidden lg:block' : 'block'}`}>
          {submissions.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No submissions found. New contact and prayer requests will appear here.
            </div>
          ) : (
            submissions.map((sub) => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSub(sub)}
                  className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                    isSelected ? 'bg-navy-900 text-white' : 'hover:bg-slate-50 text-slate-700'
                  } ${!sub.isRead && !isSelected ? 'bg-gold-50/60 font-bold border-l-4 border-gold-500' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      isSelected ? 'bg-gold-500 text-navy-950' : 'bg-navy-900 text-gold-400'
                    }`}>
                      {sub.type.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {sub.createdAt ? sub.createdAt.split('T')[0] : ''}
                    </span>
                  </div>
                  <h4 className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-navy-950'}`}>{sub.name}</h4>
                  <p className={`text-xs line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{sub.message}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Pane */}
        <div className={`lg:col-span-7 p-4 sm:p-6 space-y-6 flex flex-col justify-between bg-slate-50/50 ${!mobileDetailOpen ? 'hidden lg:flex' : 'flex'}`}>
          {selectedSub ? (
            <div className="space-y-6">
              
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileDetailOpen(false)}
                className="lg:hidden flex items-center gap-1 text-xs font-bold text-navy-900 hover:text-gold-600 pb-2 border-b border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Inbox
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-navy-900 text-gold-400">
                    {selectedSub.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black uppercase font-display text-navy-950 mt-2">{selectedSub.name}</h3>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedSub.email}</span>
                    {selectedSub.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selectedSub.phone}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedSub.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase flex items-center gap-1.5 border transition-colors ${
                      selectedSub.isRead
                        ? 'bg-slate-200 text-slate-700 border-slate-300'
                        : 'bg-gold-500 text-navy-950 border-gold-400 font-extrabold shadow-sm'
                    }`}
                  >
                    {selectedSub.isRead ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {selectedSub.isRead ? 'Mark Unread' : 'Mark Read'}
                  </button>

                  <button
                    onClick={() => handleDelete(selectedSub.id)}
                    className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                    title="Delete Submission"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-4 sm:p-6 bg-white rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-gold-600 uppercase">Message Content:</span>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{selectedSub.message}</p>
              </div>

              {selectedSub.isPrivate && (
                <div className="p-3 bg-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2 border border-red-200">
                  🔒 Strictly Confidential (Pastors Only Request)
                </div>
              )}

            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs py-12">
              Select a submission from the list to view full details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
