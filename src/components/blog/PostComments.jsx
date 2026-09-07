'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send, Check } from 'lucide-react';
import { dbService } from '@/services/dbService';
import { useAuth } from '@/context/AuthContext';

export default function PostComments({ postId, initialComments = [] }) {
  const { user } = useAuth();
  
  const [comments, setComments] = useState(initialComments);
  const [commentName, setCommentName] = useState('');
  const [commentEmail, setCommentEmail] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.name) setCommentName(user.name);
      if (user.email) setCommentEmail(user.email);
    }
  }, [user]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentName || !commentBody || !postId) return;

    setSubmittingComment(true);
    try {
      const newComm = await dbService.addComment({
        postId,
        authorName: commentName,
        authorEmail: commentEmail,
        content: commentBody
      });

      setComments([newComm, ...comments]);
      setCommentBody('');
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 4000);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <section className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm">
      <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-blue-500" /> Komentar Pengunjung ({comments.length})
      </h3>

      <form onSubmit={handleCommentSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Nama Lengkap *</label>
            <input
              type="text"
              required
              placeholder="Masukkan nama Anda"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Email (Opsional)</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={commentEmail}
              onChange={(e) => setCommentEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Tulis Komentar *</label>
          <textarea
            rows={3}
            required
            placeholder="Tulis tanggapan atau komentar Anda di sini..."
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>

        <div className="flex items-center justify-between">
          {commentSuccess ? (
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <Check className="w-4 h-4" /> Komentar Anda berhasil diterbitkan!
            </span>
          ) : <span />}
          <button
            type="submit"
            disabled={submittingComment}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {submittingComment ? 'Mengirim...' : 'Kirim Komentar'}
          </button>
        </div>
      </form>

      <div className="space-y-4 border-t border-[var(--border-color)] pt-6">
        {comments.length > 0 ? (
          comments.map((comm) => (
            <div key={comm.id} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[var(--text-main)]">{comm.authorName}</span>
                <span className="text-[11px] text-[var(--text-subtle)]">
                  {new Date(comm.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">{comm.content}</p>
            </div>
          ))
        ) : (
          <p className="text-xs text-[var(--text-subtle)] text-center py-4">Belum ada komentar. Jadilah yang pertama memberikan komentar!</p>
        )}
      </div>
    </section>
  );
}
