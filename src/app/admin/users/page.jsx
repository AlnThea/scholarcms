'use client';

import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import { Users, Search, ShieldCheck, PenTool, User, Check, RefreshCw } from 'lucide-react';

export default function AdminUsersPage() {
  const { role, refreshUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedId, setSavedId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const data = await authService.getUsers();
    setUsers(data);
    setLoading(false);
  }

  const handleRoleChange = async (userId, newRole) => {
    await authService.updateUserRole(userId, newRole);
    setSavedId(userId);
    setTimeout(() => setSavedId(null), 2000);
    loadUsers();
    refreshUser();
  };

  const filteredUsers = users.filter(u => 
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--text-main)] flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" /> Kelola Pengguna & Role Hak Akses
          </h2>
          <p className="text-xs text-[var(--text-muted)]">Atur hak akses pengguna menjadi Admin 👑, Writer ✍️, atau User 👤.</p>
        </div>

        <button
          onClick={loadUsers}
          className="px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-primary)] transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Muat Ulang Data
        </button>
      </div>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[var(--text-muted)] font-semibold">
          Total Pengguna Terdaftar: <span className="text-blue-500 font-extrabold">{users.length} Account</span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">Memuat daftar pengguna...</div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-main)]">
              <thead className="bg-[var(--bg-primary)] text-xs uppercase text-[var(--text-muted)] font-semibold border-y border-[var(--border-color)]">
                <tr>
                  <th className="py-3 px-4">Pengguna</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Peran Hak Akses (Role)</th>
                  <th className="py-3 px-4">Tanggal Terdaftar</th>
                  <th className="py-3 px-4 text-right">Ubah Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[var(--bg-primary)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold flex items-center gap-3">
                      <img
                        src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                        alt={u.name}
                        className="w-9 h-9 rounded-xl object-cover border border-[var(--border-color)]"
                      />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-muted)]">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 w-max ${
                        u.role === 'admin'
                          ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                          : u.role === 'writer'
                          ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                          : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                      }`}>
                        {u.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                        {u.role === 'writer' && <PenTool className="w-3.5 h-3.5" />}
                        {u.role === 'user' && <User className="w-3.5 h-3.5" />}
                        {u.role === 'admin' ? 'Administrator' : u.role === 'writer' ? 'Writer / Penulis' : 'User / Pembaca'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-subtle)]">
                      {new Date(u.createdAt || Date.now()).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {savedId === u.id && (
                          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Tersimpan!
                          </span>
                        )}
                        <select
                          value={u.role || 'user'}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                          <option value="admin">Admin 👑</option>
                          <option value="writer">Writer ✍️</option>
                          <option value="user">User 👤</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">Tidak ada pengguna ditemukan.</div>
        )}
      </div>

    </div>
  );
}
