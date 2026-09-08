import Link from 'next/link';
import { 
  FileText, Eye, MessageSquare, FolderTree, PlusCircle, 
  Settings, ArrowRight, ShieldCheck, Clock, Search, ExternalLink, 
  Mail, Users, Palette, Layers,
  CheckCircle, XCircle, Tag, Filter,
  Activity, BarChart2, Zap, Grid, Calendar, ShieldAlert, Compass, Gauge, GitBranch,
  UserCheck
} from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';

// 1. STATISTIK UMUM
export function StatPostsWidget({ analytics, t }) {
  return (
    <StatsCard
      title={t('widgetTotalPosts')}
      value={analytics?.totalPosts || 0}
      subtitle={`${analytics?.publishedPosts || 0} ${t('published')} • ${analytics?.draftPosts || 0} ${t('draft')}`}
      icon={FileText}
      color="blue"
      link="/dashboard/posts"
    />
  );
}

export function StatViewsWidget({ analytics, t }) {
  return (
    <StatsCard
      title={t('widgetTotalViews')}
      value={(analytics?.totalViews || 0).toLocaleString()}
      subtitle={`+${analytics?.monthlyViews || 0} ${t('thisMonth')}`}
      icon={Eye}
      color="indigo"
      link="/dashboard/analytics"
    />
  );
}

export function StatCommentsWidget({ analytics, t }) {
  return (
    <StatsCard
      title={t('widgetTotalComments')}
      value={analytics?.totalComments || 0}
      subtitle={`${analytics?.pendingComments || 0} ${t('pending')}`}
      icon={MessageSquare}
      color="purple"
      link="/dashboard/comments"
    />
  );
}

export function StatCategoriesWidget({ analytics, t }) {
  return (
    <StatsCard
      title={t('widgetTotalCategories')}
      value={analytics?.totalCategories || 0}
      subtitle={t('widgetManageCategoriesDesc')}
      icon={FolderTree}
      color="emerald"
      link="/dashboard/categories"
    />
  );
}

// 2. PLUGIN & EXTENSION STATS
export function StatSubscribersWidget({ subscribersCount, pluginStates, t }) {
  const isNewsletterActive = pluginStates['newsletter'] !== false;
  return (
    <StatsCard
      title={t('widgetTotalSubscribers')}
      value={subscribersCount || 0}
      subtitle={isNewsletterActive ? t('widgetActiveNewsletter') : t('widgetInactiveNewsletter')}
      icon={Mail}
      color="rose"
      link="/dashboard/plugins/newsletter"
      disabled={!isNewsletterActive}
    />
  );
}

export function StatWhatsappWidget({ pluginStates, t }) {
  const isWaActive = pluginStates['whatsapp-float'] !== false;
  return (
    <StatsCard
      title={t('widgetWhatsAppFloat')}
      value={isWaActive ? 'Aktif' : 'Nonaktif'}
      subtitle={isWaActive ? t('widgetWAChatEnabled') : t('widgetWAChatDisabled')}
      icon={MessageSquare}
      color="emerald"
      link="/dashboard/plugins/whatsapp"
      disabled={!isWaActive}
    />
  );
}

export function StatUsersWidget({ t }) {
  return (
    <StatsCard
      title={t('widgetTotalUsers')}
      value="3"
      subtitle={t('widgetTotalUsersDesc')}
      icon={Users}
      color="amber"
      link="/dashboard/users"
    />
  );
}

export function StatThemeWidget({ t }) {
  return (
    <StatsCard
      title={t('widgetActiveTheme')}
      value="Nova UI"
      subtitle={t('widgetActiveThemeDesc')}
      icon={Palette}
      color="cyan"
      link="/dashboard/settings"
    />
  );
}

export function StatPluginsWidget({ pluginStates, t }) {
  const activePlugins = Object.values(pluginStates || {}).filter(v => v !== false).length;
  return (
    <StatsCard
      title={t('widgetActivePlugins')}
      value={activePlugins || 4}
      subtitle={t('widgetActivePluginsDesc')}
      icon={Layers}
      color="indigo"
      link="/dashboard/plugins"
    />
  );
}

export function StatPagesWidget({ pagesCount, t }) {
  return (
    <StatsCard
      title={t('widgetTotalPages')}
      value={pagesCount || 0}
      subtitle={t('widgetTotalPagesDesc')}
      icon={FileText}
      color="slate"
      link="/dashboard/pages"
    />
  );
}

export function StatScheduledWidget({ scheduledCount, t }) {
  return (
    <StatsCard
      title={t('widgetScheduledPosts')}
      value={scheduledCount || 0}
      subtitle={t('widgetScheduledPostsDesc')}
      icon={Calendar}
      color="sky"
      link="/dashboard/posts"
    />
  );
}

// 3. KONTEN MANAJEMEN WIDGETS
export function ArticleManagementWidget({ t }) {
  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" /> {t('widgetHeaderArticleMgmt')}
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {t('widgetContentManageArticlesDesc')}
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/dashboard/posts"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
        >
          {t('widgetContentViewPostsBtn')} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href="/dashboard/posts/new"
          className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold text-xs hover:bg-[var(--bg-surface)] transition-all"
        >
          {t('widgetContentNewPostBtn')}
        </Link>
      </div>
    </div>
  );
}

export function SeoSummaryWidget({ t }) {
  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
          <Search className="w-5 h-5 text-emerald-500" /> {t('widgetHeaderSeoAudit')}
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {t('widgetContentSeoAuditDesc')}
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/dashboard/seo-analyzer"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
        >
          {t('widgetContentOpenSeoAudit')} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function RecentActivityWidget({ recentPosts, t }) {
  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" /> {t('widgetHeaderRecentActivity')}
          </h3>
          <Link href="/dashboard/posts" className="text-xs text-blue-500 hover:underline font-bold">
            {t('all')}
          </Link>
        </div>
        <div className="space-y-2">
          {recentPosts?.length > 0 ? (
            recentPosts.slice(0, 3).map((p) => (
              <div key={p.id} className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-[var(--text-main)] truncate">{p.title}</h4>
                  <p className="text-[10px] text-[var(--text-subtle)] truncate">{p.category} • {p.status}</p>
                </div>
                <Link href={`/dashboard/posts/edit/${p.id}`} className="p-1.5 rounded-lg bg-[var(--bg-surface)] hover:text-blue-500 text-[var(--text-muted)]">
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-xs text-[var(--text-muted)]">Belum ada artikel.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RecentCommentsWidget({ recentComments, t }) {
  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-500" /> {t('widgetHeaderRecentComments')}
          </h3>
          <Link href="/dashboard/comments" className="text-xs text-blue-500 hover:underline font-bold">
            {t('widgetContentModerationPrompt')}
          </Link>
        </div>
        <div className="space-y-2">
          {recentComments?.length > 0 ? (
            recentComments.slice(0, 3).map((c) => (
              <div key={c.id} className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--text-main)]">{c.authorName || c.name || t('widgetContentAnonymous')}</span>
                  <span className="text-[9px] text-[var(--text-subtle)]">{t('widgetContentNewBadge')}</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{c.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-xs text-[var(--text-muted)]">{t('widgetContentNoRecentComments')}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SystemStatusWidget({ t }) {
  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-500" /> {t('widgetHeaderSystemStatus')}
        </h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {t('widgetContentSystemStatusDesc')}
        </p>
      </div>
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/dashboard/settings"
          className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold text-xs hover:bg-[var(--bg-surface)] transition-all flex items-center gap-1.5"
        >
          {t('widgetContentCheckSettings')} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
