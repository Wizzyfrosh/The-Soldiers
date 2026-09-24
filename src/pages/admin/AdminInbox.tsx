import React, { useState, useEffect } from 'react';
import { Inbox, CheckCircle, Mail, Phone, Calendar, User, Eye, EyeOff } from 'lucide-react';
import { store } from '../../data/store';
import { FormSubmission } from '../../types';
import { Button } from '../../components/common/Button';

export const AdminInbox: React.FC = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>(store.getSubmissions());
  const [selectedSub, setSelectedSub] = useState<FormSubmission | null>(submissions[0] || null);

  useEffect(() => {
    store.syncWithBackend();
    return store.subscribe(() => {
      const updated = store.getSubmissions();
      setSubmissions(updated);
      if (!selectedSub && updated.length > 0) {
        setSelectedSub(updated[0]);
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

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div>
        <h2 className="text-2xl font-black uppercase font-display text-navy-950">Form Submissions Inbox</h2>
        <p className="text-xs text-slate-500">Prayer requests, VIP visits, and contact form entries.</p>
      </div>

      {/* Split Pane Inbox */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
        
        {/* Left List */}
        <div className="lg:col-span-5 border-r border-slate-200 divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
          {submissions.map((sub) => {
            const isSelected = selectedSub?.id === sub.id;
            return (
              <div
                key={sub.id}
                onClick={() => setSelectedSub(sub)}
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
                    {sub.createdAt.split('T')[0]}
                  </span>
                </div>
                <h4 className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-navy-950'}`}>{sub.name}</h4>
                <p className={`text-xs line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{sub.message}</p>
              </div>
            );
          })}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7 p-6 space-y-6 flex flex-col justify-between bg-slate-50/50">
          {selectedSub ? (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded bg-navy-900 text-gold-400">
                    {selectedSub.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-xl font-black uppercase font-display text-navy-950 mt-2">{selectedSub.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedSub.email}</span>
                    {selectedSub.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selectedSub.phone}</span>}
                  </div>
                </div>

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
              </div>

              {/* Message Body */}
              <div className="p-6 bg-white rounded-xl border border-slate-200 space-y-2">
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
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              Select a submission from the list to view full details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
