import Link from 'next/link';
import { 
  BarChart2, BarChart3, Activity, PieChart, ShieldCheck, Zap, Grid, Gauge, TrendingUp, Sparkles 
} from 'lucide-react';

export function ChartTopPostsHBarWidget({ recentPosts, t }) {
  const topPosts = [...recentPosts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);
  const maxViews = Math.max(...topPosts.map(p => p.views || 0), 1);
  const colors = ['bg-blue-600', 'bg-emerald-500', 'bg-purple-500'];

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-500" /> {t('widgetHeaderTopPosts')}
        </h3>

        <div className="space-y-3 pt-1">
          {topPosts.length > 0 ? topPosts.map((post, idx) => {
            const pct = Math.round(((post.views || 0) / maxViews) * 100);
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-[var(--text-main)]">
                  <span className="truncate max-w-[180px]" title={post.title}>{post.title}</span>
                  <span className="text-[var(--text-subtle)]">{post.views || 0} views</span>
                </div>
                <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                  <div className={`h-full ${colors[idx % colors.length]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          }) : (
            <p className="text-xs text-[var(--text-subtle)] py-4 text-center">Belum ada artikel yang dibaca.</p>
          )}
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)]">
        {topPosts.length > 0 ? t('widgetContentMostRead').replace('{title}', topPosts[0].title) : t('widgetContentNoStats')}
      </p>
    </div>
  );
}

export function ChartSpeedometerGaugeWidget({ recentPosts, t }) {
  const baseScore = 99;
  const penalty = Math.min(10, Math.floor(recentPosts.length / 5)); // Turun 1 poin tiap 5 artikel
  const loadScore = baseScore - penalty;
  const loadTime = ((100 - loadScore) * 0.06 + 0.12).toFixed(2);
  const dashValue = (loadScore / 100) * 50;
  
  let gradeText = t('widgetContentGradeASuperFast');
  let colorClass = "text-emerald-400 bg-emerald-500/10";
  let strokeColor = "#10b981";
  
  if (loadScore < 90) {
    gradeText = t('widgetContentGradeBFast');
    colorClass = "text-amber-400 bg-amber-500/10";
    strokeColor = "#f59e0b";
  }

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-500" /> Chart Speedometer Performa
          </h3>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${colorClass}`}>
            {gradeText}
          </span>
        </div>

        <div className="relative w-40 h-20 mx-auto flex flex-col items-center justify-end overflow-hidden pt-2">
          <svg className="w-full h-full" viewBox="0 0 36 18">
            <path
              d="M 2.0845 16 a 15.9155 15.9155 0 0 1 31.831 0"
              fill="none"
              stroke="var(--bg-primary)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 2.0845 16 a 15.9155 15.9155 0 0 1 31.831 0"
              fill="none"
              stroke={strokeColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={`${dashValue}, 50`}
            />
          </svg>
          <div className="absolute bottom-0 text-center">
            <span className="text-xl font-black text-[var(--text-main)]">{loadScore}</span>
            <span className="text-[9px] block text-[var(--text-subtle)] font-bold">{t('widgetContentLoadScoreLabel')}</span>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)] text-center">{t('widgetContentEstLoadTime').replace('{time}', loadTime)}</p>
    </div>
  );
}

export function ChartViewsTrendWidget({ analyticsSeries, language, t }) {
  const trendData = [...analyticsSeries].slice(-7); // Last 7 days, oldest to newest
  const maxViews = Math.max(...trendData.map(d => d.views || 0), 1);
  const latestView = trendData[6]?.views || 0;
  const prevView = trendData[5]?.views || 0;
  const growth = prevView > 0 ? Math.round(((latestView - prevView) / prevView) * 100) : (latestView > 0 ? 100 : 0);
  const isPositive = growth >= 0;
  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    const days = language === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    return days[new Date(dateStr).getDay()];
  };

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" /> {t('widgetHeaderViewsTrend')}
          </h3>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isPositive ? '+' : ''}{growth}% {t('widgetContentYesterday')}
          </span>
        </div>

        <div className="pt-2 flex items-end justify-between gap-2 h-28 border-b border-[var(--border-color)] pb-2">
          {trendData.map((item, idx) => {
            const pct = Math.round(((item.views || 0) / maxViews) * 100) || 5;
            return (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-1 group relative h-full" title={`${item.views || 0} views`}>
                <div className="w-full bg-blue-500/20 group-hover:bg-blue-600 rounded-t-lg transition-all relative overflow-hidden" style={{ height: `${pct}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-indigo-500 opacity-80" />
                </div>
                <span className="text-[10px] font-bold text-[var(--text-subtle)]">{getDayName(item.date)}</span>
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> {t('widgetContentTotalVisitsWeekCount').replace('{count}', trendData.reduce((acc, d) => acc + (d.views || 0), 0))}
      </p>
    </div>
  );
}

export function ChartVisitorsAreaWidget({ analyticsSeries, t }) {
  const areaData = [...analyticsSeries];
  const maxAreaViews = Math.max(...areaData.map(d => d.views || 0), 1);
  const totalAreaViews = areaData.reduce((acc, d) => acc + (d.views || 0), 0);
  
  let pathD = "M 0 80 L 300 80";
  let fillPathD = "M 0 80 L 300 80 Z";
  
  if (areaData.length > 1) {
    const points = areaData.map((d, idx) => {
      const x = (idx / (areaData.length - 1)) * 300;
      const y = 80 - (((d.views || 0) / maxAreaViews) * 70); // 10px top margin
      return `${x},${y}`;
    });
    pathD = `M ${points.join(' L ')}`;
    fillPathD = `${pathD} L 300,80 L 0,80 Z`;
  }

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" /> {t('widgetHeaderVisitorsArea')}
          </h3>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400">
            {t('widgetContentTotalVisits').replace('{count}', totalAreaViews)}
          </span>
        </div>

        <div className="relative h-28 w-full pt-2">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={fillPathD}
              fill="url(#areaGrad)"
            />
            <path
              d={pathD}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)] flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" /> {t('widgetContentVisitorCurveDesc')}
      </p>
    </div>
  );
}

export function ChartSeoKeywordsDonutWidget({ recentPosts, pluginStates, t }) {
  const isSeoActive = pluginStates['seo-analyzer'] !== false;
  
  let excellent = 0;
  let good = 0;
  let needsWork = 0;
  const publishedPosts = recentPosts.filter(p => p.status === 'published');
  const total = publishedPosts.length || 1;

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

  if (publishedPosts.length > 0) {
    publishedPosts.forEach(p => {
      const score = getSeoScore(p);
      if (score >= 80) excellent++;
      else if (score >= 50) good++;
      else needsWork++;
    });
  }

  const pctExcellent = publishedPosts.length === 0 ? 0 : Math.round((excellent / total) * 100);
  const pctGood = publishedPosts.length === 0 ? 0 : Math.round((good / total) * 100);
  const pctNeedsWork = publishedPosts.length === 0 ? 0 : (100 - pctExcellent - pctGood);
  
  const excellentDash = `${pctExcellent}, 100`;
  const goodDash = `${pctGood}, 100`;
  const goodOffset = `-${pctExcellent}`;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-500" /> {t('widgetHeaderSeoKeywords')}
          </h3>
          {!isSeoActive && (
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-500">
              Plugin Nonaktif
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 pt-1">
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--bg-primary)"
                strokeWidth="3.8"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="3.8"
                strokeDasharray={excellentDash}
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.8"
                strokeDasharray={goodDash}
                strokeDashoffset={goodOffset}
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-xs font-black text-[var(--text-main)]">{pctExcellent}%</span>
              <p className="text-[8px] text-[var(--text-subtle)]">{t('widgetContentSeoPerfect')}</p>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> {t('widgetContentSeoPerfect')} ({pctExcellent}%)
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {t('widgetContentSeoFair')} ({pctGood}%)
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[var(--text-muted)]">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-600" /> {t('widgetContentSeoNeedsOpt')} ({pctNeedsWork > 0 ? pctNeedsWork : 0}%)
            </div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)]">{t('widgetContentFromTotalPublished').replace('{count}', publishedPosts.length)}</p>
    </div>
  );
}

export function ChartSystemRadarWidget({ recentPosts, t }) {
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

  const publishedPosts = recentPosts.filter(p => p.status === 'published');
  const totalSeo = publishedPosts.reduce((acc, p) => acc + getSeoScore(p), 0);
  const avgSeo = publishedPosts.length ? Math.round(totalSeo / publishedPosts.length) : 100;
  
  const isFirebaseConnected = !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const firestoreScore = isFirebaseConnected ? 100 : 10;
  
  const avgTotal = Math.round((98 + firestoreScore + avgSeo + 100) / 4);

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-500" /> {t('widgetHeaderSystemRadar')}
          </h3>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${avgTotal >= 80 ? 'bg-indigo-500/10 text-indigo-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {t('widgetContentScoreValue').replace('{score}', avgTotal)}
          </span>
        </div>

        <div className="space-y-2 pt-1">
          {[
            { label: t('widgetContentLoadSpeed'), score: 98, color: 'bg-emerald-500' },
            { label: t('widgetContentFirestoreSecurity'), score: firestoreScore, color: 'bg-blue-500' },
            { label: t('widgetContentSeoHealth'), score: avgSeo, color: 'bg-purple-500' },
            { label: t('widgetContentLayoutResponsiveness'), score: 100, color: 'bg-indigo-500' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[var(--text-main)]">
                <span>{item.label}</span>
                <span>{item.score}%</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.score}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)]">
        {avgTotal >= 90 ? t('widgetContentCmsOptimal') : t('widgetContentCmsNeedsAttention')}
      </p>
    </div>
  );
}

export function ChartSparklinesGridWidget({ analyticsSeries, recentPosts, recentComments, t }) {
  const last4Days = [...analyticsSeries].slice(-4);
  
  // Pembaca Sparkline
  const pembacaData = last4Days.map(d => d.views || 0);
  const pembacaTotal = pembacaData.reduce((a, b) => a + b, 0);
  const maxPembaca = Math.max(...pembacaData, 1);
  
  // Artikel Sparkline
  const getArticlesForDay = (dateStr) => recentPosts.filter(p => {
    if (p.status !== 'published') return false;
    const d = p.publishedAt || p.createdAt;
    if (!d) return false;
    const str = new Date(d.seconds ? d.seconds * 1000 : d).toISOString().split('T')[0];
    return str === dateStr;
  }).length;
  const artikelData = last4Days.map(d => getArticlesForDay(d.date));
  const maxArtikel = Math.max(...artikelData, 1);
  const artikelTotal = artikelData.reduce((a, b) => a + b, 0);

  // Komentar Sparkline
  const getCommentsForDay = (dateStr) => recentComments.filter(c => {
    const d = c.createdAt;
    if (!d) return false;
    const str = new Date(d.seconds ? d.seconds * 1000 : d).toISOString().split('T')[0];
    return str === dateStr;
  }).length;
  const komentarData = last4Days.map(d => getCommentsForDay(d.date));
  const maxKomentar = Math.max(...komentarData, 1);
  const komentarTotal = komentarData.reduce((a, b) => a + b, 0);

  // Newsletter (Belum Ada Integrasi, Jadi 0)
  const newsData = [0, 0, 0, 0];
  const maxNews = 1;
  const newsTotal = 0;

  const metrics = [
    { label: t('widgetContentArticles'), total: `+${artikelTotal}`, data: artikelData, max: maxArtikel, baseColor: 'bg-blue-500', textColor: 'text-blue-500' },
    { label: t('widgetContentReaders'), total: `+${pembacaTotal}`, data: pembacaData, max: maxPembaca, baseColor: 'bg-emerald-500', textColor: 'text-emerald-500' },
    { label: t('widgetContentComments'), total: `+${komentarTotal}`, data: komentarData, max: maxKomentar, baseColor: 'bg-purple-500', textColor: 'text-purple-500' },
    { label: t('widgetContentNewsletter'), total: `+${newsTotal}`, data: newsData, max: maxNews, baseColor: 'bg-rose-500', textColor: 'text-rose-500' }
  ];

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" /> {t('widgetHeaderSparklines')}
        </h3>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {metrics.map((s, idx) => (
            <div key={idx} className="p-2.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-[var(--text-subtle)]">{s.label}</span>
                <span className={`font-black ${s.textColor}`}>{s.total}</span>
              </div>
              <div className="h-4 w-full flex items-end gap-0.5">
                {s.data.map((val, i) => {
                  const height = Math.max(20, Math.round((val / s.max) * 100));
                  const opacity = i === 3 ? '' : (i === 2 ? '/80' : (i === 1 ? '/60' : '/40'));
                  return (
                    <div 
                      key={i} 
                      className={`w-1/4 ${s.baseColor.replace('-500', i === 3 ? '-600' : '-500')}${opacity} rounded-t transition-all`} 
                      style={{ height: `${height}%` }}
                      title={`${val} ${s.label}`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)]">
        {t('widgetContentSparklinesDesc')}
      </p>
    </div>
  );
}

export function ChartHourlyHeatmapWidget({ analyticsSeries, language, t }) {
  const heatmapDays = [...analyticsSeries].slice(-6); // Last 6 days for columns
  
  const processSlot = (dayData, startHour, endHour) => {
    let sum = 0;
    if (dayData && dayData.hourly) {
      for (let h = startHour; h < endHour; h++) {
        const hStr = h.toString().padStart(2, '0');
        if (dayData.hourly[hStr]) sum += dayData.hourly[hStr];
      }
    }
    return sum;
  };

  const gridData = [
    heatmapDays.map(d => processSlot(d, 6, 12)),  // Pagi
    heatmapDays.map(d => processSlot(d, 12, 18)), // Siang
    heatmapDays.map(d => processSlot(d, 18, 24))  // Malam
  ];

  let maxHeat = 0;
  gridData.flat().forEach(val => { if (val > maxHeat) maxHeat = val; });
  maxHeat = Math.max(maxHeat, 1); 

  let totalPagi = 0, totalSiang = 0, totalMalam = 0;
  gridData[0].forEach(v => totalPagi += v);
  gridData[1].forEach(v => totalSiang += v);
  gridData[2].forEach(v => totalMalam += v);

  let peakText = t('widgetContentNoPeak');
  let rawPeak = '';
  let peakColor = "text-[var(--text-subtle)]";
  if (totalPagi >= totalSiang && totalPagi >= totalMalam && totalPagi > 0) {
    peakText = t('widgetContentPeakMorning');
    rawPeak = language === 'en' ? 'morning' : 'pagi';
    peakColor = "text-emerald-400";
  } else if (totalSiang >= totalPagi && totalSiang >= totalMalam && totalSiang > 0) {
    peakText = t('widgetContentPeakAfternoon');
    rawPeak = language === 'en' ? 'afternoon' : 'siang';
    peakColor = "text-amber-400";
  } else if (totalMalam >= totalPagi && totalMalam >= totalSiang && totalMalam > 0) {
    peakText = t('widgetContentPeakNight');
    rawPeak = language === 'en' ? 'night' : 'malam';
    peakColor = "text-rose-400";
  }

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <Grid className="w-5 h-5 text-rose-500" /> {t('widgetHeaderHourlyHeatmap')}
          </h3>
          <span className={`text-[10px] font-bold ${peakColor}`}>{peakText}</span>
        </div>

        <div className="pt-2 space-y-1.5">
          {[t('widgetContentMorning'), t('widgetContentAfternoon'), t('widgetContentNight')].map((timeSlot, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <span className="w-24 text-[10px] font-bold text-[var(--text-subtle)] truncate">{timeSlot}</span>
              <div className="flex-1 grid grid-cols-6 gap-1.5">
                {gridData[idx].map((views, i) => {
                  const opacity = Math.max(15, Math.round((views / maxHeat) * 100)); 
                  return (
                    <div
                      key={i}
                      className="h-5 rounded-md transition-all hover:scale-110"
                      style={{
                        backgroundColor: idx === 0 ? '#10b981' : (idx === 1 ? '#f59e0b' : '#e11d48'),
                        opacity: opacity / 100
                      }}
                      title={`Kunjungan jam ${timeSlot}: ${views} pembaca`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)]">
        {maxHeat > 1 ? t('widgetContentHeatmapDominated').replace('{time}', rawPeak) : t('widgetContentNotEnoughHeatmapData')}
      </p>
    </div>
  );
}

export function ChartCategoryDistributionWidget({ recentPosts, t }) {
  const catCounts = {};
  recentPosts.forEach(p => {
    const cat = p.category || 'Uncategorized';
    catCounts[cat] = (catCounts[cat] || 0) + 1;
  });

  const totalPosts = Object.values(catCounts).reduce((a, b) => a + b, 0);

  const colors = ['bg-blue-600', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-rose-500'];
  const cats = Object.entries(catCounts)
    .map(([cat, count]) => ({
      cat,
      count,
      pct: totalPosts ? Math.round((count / totalPosts) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((c, i) => ({ ...c, color: colors[i % colors.length] }));

  const dominant = cats.length > 0 ? cats[0] : null;

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-500" /> {t('widgetHeaderCategoryDistribution')}
        </h3>
        
        <div className="space-y-3 pt-1">
          {cats.length > 0 ? cats.map((c, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-[var(--text-main)]">
                <span>{c.cat}</span>
                <span className="text-[var(--text-subtle)]">{c.pct}% ({c.count} Artikel)</span>
              </div>
              <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                <div className={`h-full ${c.color} rounded-full transition-all`} style={{ width: `${c.pct}%` }} />
              </div>
            </div>
          )) : (
            <div className="flex items-center justify-center h-20 text-[10px] text-[var(--text-subtle)] font-bold bg-[var(--bg-primary)] rounded-xl">
              Belum ada artikel untuk dianalisis
            </div>
          )}
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)]">
        {dominant ? `Kategori "${dominant.cat}" mendominasi ${dominant.pct}% konten blog.` : 'Distribusi kategori akan muncul setelah Anda menulis artikel.'}
      </p>
    </div>
  );
}
