import { Database, AlertTriangle, RefreshCw, CheckCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function DatabaseStatusPanel({
  t,
  isFirebaseActive,
  handleResetDemo,
  resetMessage
}) {
  return (
    <>
      {/* DATABASE KONEKSI STATUS */}
      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${isFirebaseActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[var(--text-main)]">{t('dbConnectionHeader')}</h3>
              <p className="text-xs text-[var(--text-muted)]">{t('dbStatusSub')}</p>
            </div>
          </div>

          <Badge variant={isFirebaseActive ? 'published' : 'draft'}>
            {isFirebaseActive ? 'Connected & Active' : 'Demo Local Mode'}
          </Badge>
        </div>

        <div className="space-y-4 text-xs text-[var(--text-muted)]">
          <p className="leading-relaxed">
            {isFirebaseActive
              ? t('dbActiveText')
              : t('dbDemoText')}
          </p>

          {!isFirebaseActive && (
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
              <h4 className="font-bold text-amber-500 text-xs flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> {t('howToConnectFirebase')}
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-xs text-[var(--text-muted)]">
                <li>{t('firebaseStep1')}</li>
                <li>{t('firebaseStep2')}</li>
                <li>{t('firebaseStep3')}</li>
                <li>{t('firebaseStep4')}</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[var(--text-main)]">{t('resetDemoTitle')}</h3>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          {t('resetDemoDesc')}
        </p>

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleResetDemo}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> {t('resetDemoBtn')}
          </button>

          {resetMessage && (
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> {t('resetDemoSuccess')}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
