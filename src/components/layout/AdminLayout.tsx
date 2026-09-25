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
  MessageSquareQuote,
  Menu,
  X
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    return store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
    });
  }, []);

  // Close sidebar on route change (mobile)
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="p-4 lg:p-6 border-b border-navy-800 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center text-navy-950 font-black shrink-0">
            <Cross className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <h2 className="font-extrabold text-sm uppercase font-display text-white truncate">SJC ADMIN HUB</h2>
            <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">Management Console</span>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden ml-auto p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Middle: User Profile & Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-3">
          {/* User Profile Badge */}
          <div className="p-3 mx-3 bg-navy-950 rounded-xl border border-navy-800 space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gold-500 text-navy-950 font-bold flex items-center justify-center text-xs shrink-0">
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all ${
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

        {/* Pinned Footer Actions */}
        <div className="p-4 border-t border-navy-800 space-y-2 shrink-0 bg-navy-950/80">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-gold-400 hover:bg-navy-800 transition-colors uppercase font-bold"
          >
            <span className="flex items-center gap-2"><ExternalLink className="w-4 h-4" /> View Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors uppercase cursor-pointer border border-red-500/20"
          >
            <LogOut className="w-4 h-4" /> Log Out Admin
          </button>
        </div>
      </>
    );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      
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
        {sidebarContent}
      </aside>

      {/* Main Content Body */}
      <div className="flex-1 min-w-0 md:ml-64 flex flex-col min-h-screen w-full">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Hamburger button — visible only on mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-navy-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-black uppercase font-display text-navy-950 tracking-wide">
              Admin Portal
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/admin/inbox" className="relative p-2 text-slate-500 hover:text-navy-900 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white"></span>
              )}
            </Link>
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            <span className="text-xs text-slate-500 font-bold uppercase hidden sm:inline">
              Role: <span className="text-gold-600 font-extrabold">{currentUser?.role.replace('_', ' ') || 'SUPER ADMIN'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors cursor-pointer uppercase"
              title="Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full max-w-7xl mx-auto">
          {children}
        </main>

      </div>

    </div>
  );
};
