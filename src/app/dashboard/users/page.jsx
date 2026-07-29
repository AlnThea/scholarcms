'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';
import PageHeader from '@/components/dashboard/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { Users, Search, ShieldCheck, PenTool, User, Check, RefreshCw } from 'lucide-react';

export default function DashboardUsersPage() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
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
      
      <PageHeader
        title={t('usersTitle')}
        subtitle={t('usersSubtitle')}
      >
        <Button variant="secondary" icon={RefreshCw} onClick={loadUsers}>
          {t('reloadUsersBtn')}
        </Button>
      </PageHeader>

      {/* Filter & Search */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[var(--text-muted)] font-semibold">
          {t('totalRegisteredUsers')} <span className="text-blue-500 font-extrabold">{users.length} {t('accountsUnit')}</span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-subtle)]" />
          <input
            type="text"
            placeholder={t('searchUserPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">{t('loadingUsers')}</div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-main)]">
              <thead className="bg-[var(--bg-primary)] text-xs uppercase text-[var(--text-muted)] font-semibold border-y border-[var(--border-color)]">
                <tr>
                  <th className="py-3 px-4">{t('tableColUser')}</th>
                  <th className="py-3 px-4">{t('tableColEmail')}</th>
                  <th className="py-3 px-4">{t('tableColRole')}</th>
                  <th className="py-3 px-4">{t('tableColDate')}</th>
                  <th className="py-3 px-4 text-right">{t('tableColAction')}</th>
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
                        {u.role === 'admin' ? t('roleAdminTable') : u.role === 'writer' ? t('roleWriterTable') : t('roleUserTable')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[var(--text-subtle)]">
                      {new Date(u.createdAt || Date.now()).toLocaleDateString(isEn ? 'en-US' : 'id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {savedId === u.id && (
                          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> {t('roleSavedBadge')}
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
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">{t('noUsersFound')}</div>
        )}
      </div>

    </div>
  );
}
