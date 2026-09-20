import React from 'react';
import { FadeIn } from '../components/common/Animations';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <FadeIn className="max-w-4xl mx-auto px-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl border-2 border-slate-200 shadow-lg space-y-6">
          <h1 className="text-3xl font-black uppercase font-display text-navy-950">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Effective Date: September 2026</p>
          
          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              Soldiers of Jesus Christ Church values your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website or interact with our digital services.
            </p>
            <h3 className="font-bold text-navy-950 uppercase">1. Information We Collect</h3>
            <p>We collect information you voluntarily provide, such as your name, email address, phone number, prayer requests, form submissions, and online giving details.</p>
            
            <h3 className="font-bold text-navy-950 uppercase">2. Use of Information</h3>
            <p>Your information is used strictly to process donations, send church updates, coordinate event registrations, respond to prayer requests, and improve our ministry outreach.</p>

            <h3 className="font-bold text-navy-950 uppercase">3. Data Security</h3>
            <p>We implement industry-standard 256-bit SSL encryption and secure third-party payment gateways (Stripe) to protect financial transaction data. We do not sell or rent your personal information to third parties.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
