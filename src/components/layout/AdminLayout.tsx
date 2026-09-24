import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
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
  Shield,
  UserCheck,
  Search,
  Bell,
  Newspaper,
  MessageSquareQuote
} from 'lucide-react';
import { Role, User } from '../../types';
import { store } from '../../data/store';
import { api } from '../../services/api';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());

  React.useEffect(() => {
    return store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
    });
  }, []);

  // Auth guard: redirect to login if not authenticated
  if (!currentUser || !store.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    store.logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'EDITOR', 'VIEWER'] },
    { name: 'Sermon Manager', path: '/admin/sermons', icon: <Video className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'EDITOR'] },
    { name: 'Event Manager', path: '/admin/events', icon: <Calendar className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'EDITOR'] },
    { name: 'Giving Ledger', path: '/admin/giving', icon: <Heart className="w-5 h-5" />, roles: ['SUPER_ADMIN'] },
    { name: 'Inbox (Forms)', path: '/admin/inbox', icon: <Inbox className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'EDITOR', 'VIEWER'] },
    { name: 'CMS Content', path: '/admin/content', icon: <FileText className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'EDITOR'] },
    { name: 'Latest News', path: '/admin/news', icon: <Newspaper className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'EDITOR'] },
    { name: 'Testimonies', path: '/admin/testimonies', icon: <MessageSquareQuote className="w-5 h-5" />, roles: ['SUPER_ADMIN', 'EDITOR'] },
    { name: 'User Access', path: '/admin/users', icon: <Users className="w-5 h-5" />, roles: ['SUPER_ADMIN'] }
  ];

  const unreadCount = store.getSubmissions().filter(s => !s.isRead).length;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      
      {/* Left Sidebar (Dark Navy #0A1D37) */}
      <aside className="w-64 bg-navy-900 border-r border-navy-800 text-white flex flex-col justify-between shrink-0 shadow-2xl z-30">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-navy-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center text-navy-950 font-black">
              <Cross className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm uppercase font-display text-white">SJC ADMIN HUB</h2>
              <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">Management Console</span>
            </div>
          </div>

          {/* User Profile Badge */}
          <div className="p-4 mx-3 my-4 bg-navy-950 rounded-xl border border-navy-800 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold-500 text-navy-950 font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <span className="inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded bg-gold-500/20 text-gold-400 border border-gold-500/30">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {menuItems.map((item) => {
              const hasPermission = currentUser && item.roles.includes(currentUser.role);
              if (!hasPermission) return null;

              const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
                    active
                      ? 'bg-gold-500 text-navy-950 shadow-gold'
                      : 'text-slate-300 hover:bg-navy-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.name.includes('Inbox') && unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-red-600 text-white rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-navy-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-gold-400 hover:bg-navy-800 transition-colors uppercase font-bold"
          >
            <span className="flex items-center gap-2"><ExternalLink className="w-4 h-4" /> View Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors uppercase"
          >
            <LogOut className="w-4 h-4" /> Log Out Admin
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black uppercase font-display text-navy-950">
              Admin Portal
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/admin/inbox" className="relative p-2 text-slate-500 hover:text-navy-900 rounded-lg hover:bg-slate-100">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </Link>
            <div className="h-6 w-px bg-slate-200"></div>
            <span className="text-xs text-slate-500 font-bold uppercase">
              Role: <span className="text-gold-600 font-extrabold">{currentUser?.role || 'SUPER_ADMIN'}</span>
            </span>
          </div>
        </header>

        {/* Content View */}
        <main className="p-8 flex-1">
          {children}
        </main>

      </div>

    </div>
  );
};
