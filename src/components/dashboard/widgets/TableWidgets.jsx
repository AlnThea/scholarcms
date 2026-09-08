import Link from 'next/link';
import { Table, CheckCircle, XCircle } from 'lucide-react';

export function TableCommentsModerationWidget({ recentComments, showToast, t }) {
  const pendingComments = recentComments.filter(c => c.status === 'pending').slice(0, 3);

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Table className="w-5 h-5 text-purple-500" /> {t('widgetHeaderCommentsModeration')}
          </h3>
          <Link href="/dashboard/comments" className="text-xs text-blue-500 hover:underline font-bold">
            {t('widgetContentManageAll')}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                <th className="pb-2">{t('thSender')}</th>
                <th className="pb-2">{t('thComment')}</th>
                <th className="pb-2 text-right">{t('thQuickAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {pendingComments.length > 0 ? (
                pendingComments.map((row) => (
                  <tr key={row.id} className="group">
                    <td className="py-2.5 font-bold text-[var(--text-main)] truncate max-w-[100px]">{row.authorName || 'Anonim'}</td>
                    <td className="py-2.5 text-[var(--text-muted)] truncate max-w-[160px]">{row.content}</td>
                    <td className="py-2.5 text-right space-x-1">
                      <button
                        onClick={() => showToast(t('widgetContentApproveCommentHint'))}
                        className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                        title="Setujui Komentar"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => showToast(t('widgetContentApproveCommentHint'))}
                        className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                        title="Tolak Komentar"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-xs text-[var(--text-muted)] italic">
                    {t('widgetContentNoPendingComments')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)]">{t('widgetContentShowingPendingComments').replace('{count}', pendingComments.length)}</p>
    </div>
  );
}

export function TableSeoArticlesWidget({ recentPosts, t }) {
  const getSeoScore = (post) => {
    let score = 0;
    const titleLen = post.title ? post.title.length : 0;
    if (titleLen >= 30 && titleLen <= 70) score += 25; else score += 10;
    const metaDesc = post.seoDescription || post.excerpt || '';
    if (metaDesc.length >= 50 && metaDesc.length <= 160) score += 25; else score += 10;
    if (post.featuredImage) score += 25;
    if (Array.isArray(post.tags) && post.tags.length > 0) score += 25;
    return Math.min(100, score);
  };

  const seoPosts = [...recentPosts].filter(p => p.status === 'published').map(p => ({
    title: p.title,
    score: getSeoScore(p),
  })).sort((a, b) => b.score - a.score);

  const avgScore = seoPosts.length ? Math.round(seoPosts.reduce((acc, p) => acc + p.score, 0) / seoPosts.length) : 0;
  const top3Seo = seoPosts.slice(0, 3);
  const getBadge = (score) => {
    if (score >= 80) return { badge: t('widgetContentSeoPerfect'), color: 'bg-emerald-500' };
    if (score >= 50) return { badge: t('widgetContentSeoGood'), color: 'bg-blue-500' };
    return { badge: t('widgetContentSeoNeedsCheck'), color: 'bg-amber-500' };
  };

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Table className="w-5 h-5 text-emerald-500" /> {t('widgetHeaderSeoArticles')}
          </h3>
          <Link href="/dashboard/seo-analyzer" className="text-xs text-blue-500 hover:underline font-bold">
            {t('widgetContentOpenSeoAudit')}
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                <th className="pb-2">{t('thTitle')}</th>
                <th className="pb-2">SEO</th>
                <th className="pb-2 text-right">{t('thStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {top3Seo.map((row, idx) => {
                const { badge, color } = getBadge(row.score);
                return (
                  <tr key={idx}>
                    <td className="py-2 font-bold text-[var(--text-main)] truncate max-w-[140px]">{row.title}</td>
                    <td className="py-2 font-black text-[var(--text-main)]">{row.score}/100</td>
                    <td className="py-2 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold text-white ${color}`}>
                        {badge}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)]">{t('widgetContentAvgSeoScore')} {avgScore}/100.</p>
    </div>
  );
}
