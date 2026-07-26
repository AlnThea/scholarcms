'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { dbService } from '@/services/dbService';
import { Feather, Lock, Mail, User, ArrowRight, UserX, ArrowLeft, LogIn } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const { user, role, register, loading: authLoading } = useAuth();

  const [allowRegistration, setAllowRegistration] = useState(true);
  const [checkingSettings, setCheckingSettings] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (role === 'admin' || role === 'writer') {
        router.replace('/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [user, role, authLoading, router]);

  useEffect(() => {
    async function checkSettings() {
      try {
        const settings = await dbService.getGeneralSettings();
        if (settings && settings.allowRegistration === false) {
          setAllowRegistration(false);
        }
      } catch (err) {
        console.error('Failed to load registration settings:', err);
      } finally {
        setCheckingSettings(false);
      }
    }
    checkSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allowRegistration) return;
    setError('');
    setLoading(true);

    const res = await register({ name, email, password, role: 'user' });
    setLoading(false);

    if (res.success) {
      router.push('/');
    } else {
      setError(res.error || 'Gagal mendaftar. Silakan coba kembali.');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Feather className="w-6 h-6" />
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
            Buat Akun Baru <span className="gradient-text">ScholarCMS</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">Daftar akun untuk mulai membaca dan berinteraksi</p>
        </div>

        {/* Register Form Card / Disabled Notice */}
        {!checkingSettings && !allowRegistration ? (
          <div className="p-8 rounded-3xl glass-panel shadow-2xl text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto border border-amber-500/20">
              <UserX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[var(--text-main)] mb-2">Pendaftaran Pengguna Ditutup</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Saat ini pendaftaran pengguna baru sedang ditutup sementara oleh Administrator situs.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link href="/" className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] flex items-center justify-center gap-2 hover:bg-[var(--bg-primary)] transition-all">
                <ArrowLeft className="w-4 h-4 text-blue-500" /> Beranda
              </Link>
              <Link href="/login" className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all">
                <LogIn className="w-4 h-4" /> Masuk ke Akun
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="p-8 rounded-3xl glass-panel shadow-2xl space-y-6">
              
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-500 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  type="text"
                  required
                  icon={User}
                  placeholder="Nama Lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />

                <Input
                  label="Alamat Email"
                  type="email"
                  required
                  icon={Mail}
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="Kata Sandi"
                  type="password"
                  required
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  type="submit"
                  loading={loading}
                  size="lg"
                  className="w-full"
                >
                  Daftar Sekarang
                </Button>
              </form>

            </div>

            {/* Footer Link */}
            <div className="text-center mt-6 text-xs text-[var(--text-muted)]">
              Sudah memiliki akun?{' '}
              <Link href="/login" className="font-bold text-blue-500 hover:underline">
                Masuk Sekarang
              </Link>
            </div>
          </>
        )}

      </div>

    </div>
  );
}
