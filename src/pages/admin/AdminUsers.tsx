import React, { useState } from 'react';
import { Users, UserPlus, Shield, CheckCircle2 } from 'lucide-react';
import { MOCK_USERS } from '../../data/store';
import { User, Role } from '../../types';
import { Button } from '../../components/common/Button';

export const AdminUsers: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>(MOCK_USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('EDITOR');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      role
    };

    setUsersList([...usersList, newUser]);
    setShowInviteModal(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black uppercase font-display text-navy-950">User Access & Role-Based Permissions (RBAC)</h2>
          <p className="text-xs text-slate-500">Manage administrator privileges: Super Admin, Editor, or Viewer.</p>
        </div>
        <Button variant="gold" size="md" onClick={() => setShowInviteModal(true)} icon={<UserPlus className="w-4 h-4" />}>
          Invite New Admin User
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
            <tr>
              <th className="p-4">User Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role Badge</th>
              <th className="p-4">Permissions Scope</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {usersList.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-navy-950 text-sm">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded font-black text-[10px] uppercase ${
                    u.role === 'SUPER_ADMIN'
                      ? 'bg-gold-500 text-navy-950 shadow-sm'
                      : u.role === 'EDITOR'
                      ? 'bg-navy-900 text-gold-400'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-xs text-slate-500">
                  {u.role === 'SUPER_ADMIN' && 'Full Access (Financials, Users, Content, Events, Sermons)'}
                  {u.role === 'EDITOR' && 'Manage Sermons, Events, and CMS Content'}
                  {u.role === 'VIEWER' && 'Read-Only Access to Inbox & Analytics'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="bg-navy-900 text-white rounded-2xl max-w-lg w-full p-6 border-2 border-gold-500/40 shadow-2xl space-y-4">
            <h3 className="font-black text-lg uppercase font-display text-white">Invite Admin Team Member</h3>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Pastor Marcus Thorne"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="marcus@soldiers.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Assign RBAC Role</label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                >
                  <option value="SUPER_ADMIN">SUPER_ADMIN (Full Control)</option>
                  <option value="EDITOR">EDITOR (Manage Content & Events)</option>
                  <option value="VIEWER">VIEWER (Read-Only Inbox Access)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" size="md" className="flex-1" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="md" className="flex-1">
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
