import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, CheckCircle2, Trash2 } from 'lucide-react';
import { MOCK_USERS } from '../../data/store';
import { User, Role } from '../../types';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';

export const AdminUsers: React.FC = () => {
  const [usersList, setUsersList] = useState<User[]>(MOCK_USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('tempPass123!');
  const [role, setRole] = useState<Role>('EDITOR');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.users.getAll();
      if (res.users) {
        setUsersList(res.users);
      }
    } catch (err) {
      console.warn('Failed to load users from backend:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);

    try {
      await api.users.create({
        name,
        email,
        password: password || 'Soldiers2026!',
        role
      });
      await fetchUsers();
      setShowInviteModal(false);
      setName('');
      setEmail('');
      setPassword('tempPass123!');
    } catch (err: any) {
      alert(err.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${userName}?`)) return;
    try {
      await api.users.delete(id);
      await fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase font-display text-navy-950">User Access & Role-Based Permissions (RBAC)</h2>
          <p className="text-xs text-slate-500">Manage administrator privileges: Super Admin, Editor, or Viewer.</p>
        </div>
        <Button variant="gold" size="md" onClick={() => setShowInviteModal(true)} icon={<UserPlus className="w-4 h-4" />}>
          Invite New Admin User
        </Button>
      </div>

      {/* Users Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px]">
            <thead className="bg-navy-900 text-gold-400 font-extrabold uppercase font-display">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role Badge</th>
                <th className="p-4">Permissions Scope</th>
                <th className="p-4 text-right sticky right-0 bg-navy-900 z-10">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {usersList.map((u) => (
                <tr key={u.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-navy-950 text-sm">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded font-black text-[10px] uppercase ${
                      u.role === 'SUPER_ADMIN'
                        ? 'bg-gold-500 text-navy-950 shadow-sm'
                        : u.role === 'EDITOR'
                        ? 'bg-navy-800 text-gold-400'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">
                    {u.role === 'SUPER_ADMIN' && 'Full system control, financials, user invites & deletions.'}
                    {u.role === 'EDITOR' && 'Publish and update sermons, news, events & prayer requests.'}
                    {u.role === 'VIEWER' && 'Read-only access to submissions and event lists.'}
                  </td>
                  <td className="p-4 text-right sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)]">
                    {u.email !== 'admin@soldiers.org' && (
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-200"
                        title="Revoke User Access"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="pastor@soldiers.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Temporary Password</label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Role Assignment</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-3.5 py-2 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm"
                >
                  <option value="SUPER_ADMIN">Super Admin (Full Access + Financials)</option>
                  <option value="EDITOR">Editor (Sermons, News, Events Content)</option>
                  <option value="VIEWER">Viewer (Read-only)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3 border-t border-navy-800">
                <Button type="button" variant="outline" size="md" className="flex-1" onClick={() => setShowInviteModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="gold" size="md" className="flex-1" disabled={loading}>
                  {loading ? 'Sending...' : 'Issue Access'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
