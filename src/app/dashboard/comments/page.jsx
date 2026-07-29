'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { dbService } from '@/services/dbService';
import PageHeader from '@/components/dashboard/PageHeader';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { MessageSquare, Check, X, Trash2, RefreshCw, Clock } from 'lucide-react';

export default function DashboardCommentsPage() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadComments();
  }, []);

  async function loadComments() {
    setLoading(true);
    const data = await dbService.getComments();
    setComments(data || []);
    setLoading(false);
  }

  const handleUpdateStatus = async (commentId, newStatus) => {
    await dbService.updateCommentStatus(commentId, newStatus);
    loadComments();
  };

  const handleDelete = async (commentId) => {
    if (confirm(t('deleteCommentConfirm'))) {
      await dbService.deleteComment(commentId);
      loadComments();
    }
  };

  const filteredComments = comments.filter(c => {
    if (statusFilter === 'all') return true;
    return c.status === statusFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      <PageHeader
        title={t('commentsTitle')}
        subtitle={t('commentsSubtitle')}
      >
        <Button variant="secondary" icon={RefreshCw} onClick={loadComments}>
          {t('reloadBtn')}
        </Button>
      </PageHeader>

      {/* Filter Tabs */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
          }`}
        >
          {t('filterAll')} ({comments.length})
        </button>
        <button
          onClick={() => setStatusFilter('approved')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'approved' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
          }`}
        >
          {t('tabFilterApproved')} ({comments.filter(c => c.status === 'approved').length})
        </button>
        <button
          onClick={() => setStatusFilter('rejected')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            statusFilter === 'rejected' ? 'bg-rose-600 text-white shadow-sm' : 'bg-[var(--bg-primary)] text-[var(--text-muted)]'
          }`}
        >
          {t('tabFilterRejected')} ({comments.filter(c => c.status === 'rejected').length})
        </button>
      </div>

      {/* Comments List */}
      <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">{t('loadingComments')}</div>
        ) : filteredComments.length > 0 ? (
          <div className="divide-y divide-[var(--border-color)]">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="py-4 flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[var(--text-main)]">{comment.authorName || t('visitorNameFallback')}</span>
                    {comment.authorEmail && (
                      <span className="text-xs text-[var(--text-subtle)]">({comment.authorEmail})</span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      comment.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {comment.status === 'approved' ? 'Approved' : 'Rejected'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed bg-[var(--bg-primary)] p-3 rounded-xl border border-[var(--border-color)]">
                    "{comment.content}"
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text-subtle)]">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(comment.createdAt || Date.now()).toLocaleString(isEn ? 'en-US' : 'id-ID')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {comment.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(comment.id, 'approved')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-emerald-700 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" /> {t('approveBtn')}
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateStatus(comment.id, 'rejected')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm hover:bg-amber-700 transition-all"
                    >
                      <X className="w-3.5 h-3.5" /> {t('rejectBtn')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Delete Comment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[var(--text-subtle)]">{t('noCommentsFound')}</div>
        )}
      </div>

    </div>
  );
}
