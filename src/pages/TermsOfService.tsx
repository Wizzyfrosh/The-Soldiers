import React from 'react';
import { FadeIn } from '../components/common/Animations';

export const TermsOfService: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <FadeIn className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl border-2 border-slate-200 shadow-lg space-y-6">
          <h1 className="text-3xl font-black uppercase font-display text-navy-950">Terms of Service</h1>
          <p className="text-xs text-slate-500">Effective Date: September 2026</p>
          
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              By accessing or using the website of Soldiers of Jesus Christ Church, you agree to comply with and be bound by the following Terms of Service.
            </p>
            <h3 className="font-bold text-navy-950 uppercase">1. Online Giving & Transactions</h3>
            <p>All online donations are voluntary. Receipts are issued digitally. If you believe an error occurred in your transaction, please contact financial administration at info@soldiersofjesuschrist.org.</p>
            
            <h3 className="font-bold text-navy-950 uppercase">2. Intellectual Property</h3>
            <p>All media, audio, sermons, graphics, and written content published on this site are the intellectual property of Soldiers of Jesus Christ Church unless otherwise stated.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
