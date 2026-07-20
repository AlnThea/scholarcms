'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { Check, X, Trash2 } from 'lucide-react';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    setLoading(true);
    const data = await dbService.getComments();
    setComments(data);
    setLoading(false);
  }

  const handleUpdateStatus = async (id, status) => {
    await dbService.updateCommentStatus(id, status);
    loadComments();
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      await dbService.deleteComment(id);
      loadComments();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div>
        <h2 className="text-2xl font-extrabold text-[var(--text-main)]">Moderasi Komentar</h2>
        <p className="text-xs text-[var(--text-muted)]">Kelola dan setujui komentar pengunjung blog Anda.</p>
      </div>

      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">Memuat komentar...</div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comm) => (
              <div key={comm.id} className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--text-main)]">{comm.authorName}</span>
                    <span className="text-xs text-[var(--text-subtle)]">({comm.authorEmail || 'tanpa email'})</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      comm.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {comm.status}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{comm.content}</p>
                  <p className="text-[11px] text-[var(--text-subtle)]">
                    Dikirim pada: {new Date(comm.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {comm.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(comm.id, 'approved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Setujui
                    </button>
                  )}
                  {comm.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(comm.id, 'rejected')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" /> Tolak
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comm.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">Belum ada komentar untuk dimoderasi.</div>
        )}
      </div>

    </div>
  );
}
