'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/authService';
import PageHeader from '@/components/dashboard/PageHeader';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import {
  User, Mail, ShieldCheck, PenTool, Camera, Save, CheckCircle2,
  Key, Sparkles, RefreshCw, Feather
} from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
];

export default function UserProfilePage() {
  const { user, role, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [titleRole, setTitleRole] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setAvatar(user.avatar || AVATAR_PRESETS[0]);
      setBio(user.bio || 'Kreator konten & penulis aktif ScholarCMS.');
      setTitleRole(user.titleRole || (user.role === 'admin' ? 'Chief Software Architect' : user.role === 'writer' ? 'Senior Tech Writer' : 'Regular Contributor'));
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const updatePayload = {
        name: name.trim(),
        avatar: avatar.trim(),
        bio: bio.trim(),
        titleRole: titleRole.trim(),
        updatedAt: new Date().toISOString()
      };

      if (user?.id) {
        await authService.updateUserProfile(user.id, updatePayload);
      }
      if (refreshUser) {
        await refreshUser();
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save user profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      
      <PageHeader
        title="Profil Saya & Pengaturan Akun"
        subtitle="Kelola identitas penulis, foto avatar, dan deskripsi publik profil Anda."
      />

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Profil Anda berhasil diperbarui! Perubahan nama &amp; avatar akan otomatis muncul di postingan baru Anda.</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Avatar & Quick Info Card */}
        <div className="md:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm text-center space-y-4">
            
            <div className="relative w-28 h-28 mx-auto">
              <img
                src={avatar || AVATAR_PRESETS[0]}
                alt={name}
                className="w-full h-full rounded-3xl object-cover border-4 border-blue-500/30 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-blue-600 text-white shadow-md">
                <Camera className="w-4 h-4" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-[var(--text-main)]">{name || 'Pengguna'}</h3>
              <p className="text-xs text-blue-500 font-semibold mt-0.5">{titleRole || 'Penulis'}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{email}</p>
            </div>

            <div className="pt-3 border-t border-[var(--border-color)] flex justify-center">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                role === 'admin'
                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  : role === 'writer'
                  ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                  : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
              }`}>
                {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                {role === 'writer' && <PenTool className="w-3.5 h-3.5" />}
                {role === 'user' && <User className="w-3.5 h-3.5" />}
                {role === 'admin' ? 'Administrator 👑' : role === 'writer' ? 'Writer / Penulis ✍️' : 'Pembaca 👤'}
              </span>
            </div>

          </div>

          {/* Avatar Preset Selector */}
          <div className="p-5 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-3">
            <label className="block text-xs font-extrabold uppercase text-[var(--text-muted)]">
              Pilih Preset Avatar
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {AVATAR_PRESETS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                    avatar === url ? 'border-blue-500 ring-2 ring-blue-500/30 scale-105' : 'border-[var(--border-color)] hover:border-blue-400'
                  }`}
                >
                  <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile Form */}
        <div className="md:col-span-8 p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
          <div className="border-b border-[var(--border-color)] pb-4">
            <h3 className="text-base font-extrabold text-[var(--text-main)] flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> Informasi Identitas Penulis
            </h3>
            <p className="text-xs text-[var(--text-subtle)] mt-0.5">Identitas ini otomatis disematkan sebagai Author pada artikel yang Anda buat.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
            
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                Nama Lengkap Penulis *
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={User}
                placeholder="misal: Ernst Senior Dev"
              />
            </div>

            {/* Title / Jabatan Penulis */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                Gelar / Jabatan Penulis (Title Role)
              </label>
              <Input
                type="text"
                value={titleRole}
                onChange={(e) => setTitleRole(e.target.value)}
                icon={Feather}
                placeholder="misal: Chief Software Architect / Senior Tech Writer"
              />
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                Alamat Email Akun
              </label>
              <Input
                type="email"
                value={email}
                disabled
                icon={Mail}
                helperText="Email digunakan sebagai otentikasi login utama."
              />
            </div>

            {/* URL Avatar Kustom */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                URL Foto Profil Avatar Custom
              </label>
              <Input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                icon={Camera}
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            {/* Bio Ringkas */}
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
                Bio / Biografi Singkat Penulis
              </label>
              <Textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tuliskan ringkasan pengalaman atau keahlian Anda di sini..."
              />
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-[var(--border-color)] flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                icon={Save}
                loading={saving}
              >
                {saving ? 'Menyimpan Profile...' : 'Simpan Perubahan Profil'}
              </Button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
