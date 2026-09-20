import React, { useState } from 'react';
import { Heart, Download, DollarSign, Filter } from 'lucide-react';
import { store } from '../../data/store';
import { Donation } from '../../types';

export const AdminGiving: React.FC = () => {
  const [donations] = useState<Donation[]>(store.getDonations());

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);

  const handleExportCSV = () => {
    const headers = "ID,DonorName,Email,Amount,Frequency,Fund,Status,Date\n";
    const rows = donations.map(d => `"${d.id}","${d.donorName}","${d.email}",${d.amount},"${d.frequency}","${d.fund}","${d.status}","${d.date}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sjc_donations_ledger_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase font-display text-navy-950">Giving & Financial Ledger</h2>
          <p className="text-xs text-slate-500">Track online donations, fund breakdown, and financial reports.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs uppercase rounded-xl flex items-center gap-1.5 shadow-gold transition-colors"
        >
          <Download className="w-4 h-4" /> Export Financial Report
        </button>
      </div>

      {/* Financial Summary Card */}
      <div className="bg-navy-900 text-white p-6 rounded-2xl border-2 border-gold-500/40 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs text-gold-400 font-extrabold uppercase tracking-widest block">Total Processed Gifts</span>
          <span className="text-4xl font-black font-display text-white mt-1 block">${totalAmount.toFixed(2)}</span>
          <span className="text-xs text-slate-300">Synced with Stripe Merchant Account</span>
        </div>
        <div className="p-4 bg-gold-500/20 text-gold-400 rounded-2xl border border-gold-500/30">
          <DollarSign className="w-10 h-10" />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
            <tr>
              <th className="p-4">Tx ID</th>
              <th className="p-4">Donor Name & Email</th>
              <th className="p-4">Fund Designation</th>
              <th className="p-4">Frequency</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {donations.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono font-bold text-slate-500">#{d.id}</td>
                <td className="p-4">
                  <span className="font-bold text-navy-950 block text-sm">{d.donorName}</span>
                  <span className="text-[11px] text-slate-500">{d.email}</span>
                </td>
                <td className="p-4 font-medium">{d.fund}</td>
                <td className="p-4 capitalize font-bold text-navy-900">{d.frequency}</td>
                <td className="p-4 font-mono">{d.date}</td>
                <td className="p-4 text-right font-black text-sm text-gold-600 font-display">
                  +${d.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
