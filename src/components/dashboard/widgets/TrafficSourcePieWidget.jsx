'use client';

import { PieChart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function TrafficSourcePieWidget({ analyticsSeries = [] }) {
  const { t } = useLanguage();

  const totalSearch = analyticsSeries.reduce((acc, d) => acc + (d.sources?.search || 0), 0);
  const totalSocial = analyticsSeries.reduce((acc, d) => acc + (d.sources?.social || 0), 0);
  const totalDirect = analyticsSeries.reduce((acc, d) => acc + (d.sources?.direct || 0), 0);
  const totalReferral = analyticsSeries.reduce((acc, d) => acc + (d.sources?.referral || 0), 0);
  const totalTraffic = totalSearch + totalSocial + totalDirect + totalReferral || 1;

  const pctSearch = Math.round((totalSearch / totalTraffic) * 100) || 0;
  const pctSocial = Math.round((totalSocial / totalTraffic) * 100) || 0;
  const pctDirect = Math.round((totalDirect / totalTraffic) * 100) || 0;
  const pctReferral = Math.round((totalReferral / totalTraffic) * 100) || 0;

  const highestSource = [
    { name: t('widgetContentGoogleSearch'), pct: pctSearch },
    { name: t('widgetContentSocialMedia'), pct: pctSocial },
    { name: t('widgetContentDirect'), pct: pctDirect },
    { name: t('widgetContentReferral'), pct: pctReferral }
  ].sort((a,b) => b.pct - a.pct)[0];

  const dashSearch = pctSearch;
  const dashSocial = pctSocial;
  const dashDirect = pctDirect;
  const dashReferral = pctReferral;
  
  const offsetSocial = -(dashSearch);
  const offsetDirect = -(dashSearch + dashSocial);
  const offsetReferral = -(dashSearch + dashSocial + dashDirect);

  return (
    <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-500" /> {t('widgetHeaderTrafficSource')}
          </h3>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400">
            {highestSource.name} ({highestSource.pct}%)
          </span>
        </div>

        <div className="flex items-center gap-5 pt-1">
          {/* SVG Full Conical Pie Chart */}
          <div className="relative w-24 h-24 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
              {dashSearch > 0 && <circle r="16" cx="16" cy="16" fill="#3b82f6" strokeDasharray={`${dashSearch} 100`} strokeWidth="32" />}
              {dashSocial > 0 && <circle r="16" cx="16" cy="16" fill="#10b981" strokeDasharray={`${dashSocial} 100`} strokeDashoffset={offsetSocial} strokeWidth="32" />}
              {dashDirect > 0 && <circle r="16" cx="16" cy="16" fill="#8b5cf6" strokeDasharray={`${dashDirect} 100`} strokeDashoffset={offsetDirect} strokeWidth="32" />}
              {dashReferral > 0 && <circle r="16" cx="16" cy="16" fill="#f59e0b" strokeDasharray={`${dashReferral} 100`} strokeDashoffset={offsetReferral} strokeWidth="32" />}
            </svg>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-[var(--text-main)]">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> {t('widgetContentGoogleSearch')} ({pctSearch}%)
            </div>
            <div className="flex items-center gap-2 font-bold text-[var(--text-main)]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {t('widgetContentSocialMedia')} ({pctSocial}%)
            </div>
            <div className="flex items-center gap-2 font-bold text-[var(--text-main)]">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> {t('widgetContentDirect')} ({pctDirect}%)
            </div>
            <div className="flex items-center gap-2 font-bold text-[var(--text-subtle)]">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> {t('widgetContentReferral')} ({pctReferral}%)
            </div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-[var(--text-subtle)]">{t('widgetContentHighestTrafficDesc').replace('{source}', highestSource.name)}</p>
    </div>
  );
}
