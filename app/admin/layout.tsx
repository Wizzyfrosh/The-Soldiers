'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Video,
  Calendar,
  Heart,
  Inbox,
  FileText,
  Users,
  LogOut,
  Cross,
  ExternalLink,
  Newspaper,
  MessageSquareQuote,
  Menu,
  X,
  Bell
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Sermon Manager', path: '/admin/sermons', icon: <Video className="w-5 h-5" /> },
    { name: 'Event Manager', path: '/admin/events', icon: <Calendar className="w-5 h-5" /> },
    { name: 'Giving Ledger', path: '/admin/giving', icon: <Heart className="w-5 h-5" /> },
    { name: 'Inbox (Forms)', path: '/admin/inbox', icon: <Inbox className="w-5 h-5" /> },
    { name: 'CMS Content', path: '/admin/content', icon: <FileText className="w-5 h-5" /> },
    { name: 'Latest News', path: '/admin/news', icon: <Newspaper className="w-5 h-5" /> },
    { name: 'Testimonies', path: '/admin/testimonies', icon: <MessageSquareQuote className="w-5 h-5" /> },
    { name: 'User Access', path: '/admin/users', icon: <Users className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row w-full overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed on mobile (slide-over), fixed on desktop */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 border-r border-navy-800 text-white flex flex-col justify-between shadow-2xl h-screen overflow-hidden
          transform transition-transform duration-300 ease-in-out
          md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand */}
        <div className="p-4 lg:p-6 border-b border-navy-800 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center text-navy-950 font-black shrink-0">
            <Cross className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-sm uppercase font-display text-white truncate">SJC ADMIN HUB</h2>
            <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">Management Console</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden ml-auto p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-3 space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                  active
                    ? 'bg-gold-500 text-navy-950 shadow-md'
                    : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer Link */}
        <div className="p-4 border-t border-navy-800 shrink-0 bg-navy-950/80">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-gold-400 hover:bg-navy-800 transition-colors uppercase font-bold"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> View Public Site
            </span>
          </Link>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64 min-w-0 w-full">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-navy-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-black uppercase font-display text-navy-950 tracking-wide">
              Admin Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/inbox" className="relative p-2 text-slate-500 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
            </Link>
          </div>
        </header>

        {/* Main Viewport Container */}
        <main className="p-4 md:p-8 flex-1 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
