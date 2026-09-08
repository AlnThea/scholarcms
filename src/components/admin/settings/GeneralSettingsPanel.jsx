import { ShieldCheck, Save, CheckCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function GeneralSettingsPanel({ 
  t, 
  role, 
  generalSettings, 
  setGeneralSettings, 
  handleSaveGeneralSettings, 
  generalSaving, 
  generalSavedMessage 
}) {
  if (role !== 'admin') return null;

  return (
    <form onSubmit={handleSaveGeneralSettings} className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[var(--text-main)] flex items-center gap-2">
              {t('siteIdentityHeader')}
              <ShieldCheck className="w-4 h-4 text-blue-500" title={t('adminOnlyBadgeTitle')} />
            </h3>
            <p className="text-xs text-[var(--text-muted)]">{t('siteIdentityHelp')}</p>
          </div>
        </div>

        <Badge variant={generalSettings.allowRegistration ? 'published' : 'draft'}>
          {generalSettings.allowRegistration ? t('regOpenBadge') : t('regClosedBadge')}
        </Badge>
      </div>

      <div className="space-y-5">
        
        {/* Grid Site Title & Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              {t('siteTitleLabel')}
            </label>
            <Input
              type="text"
              placeholder="ScholarCMS"
              value={generalSettings.siteTitle || ''}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteTitle: e.target.value })}
              helperText={t('siteTitleHelp')}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              {t('siteTaglineLabel')}
            </label>
            <Input
              type="text"
              placeholder="Modern Publishing Platform"
              value={generalSettings.siteTagline || ''}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteTagline: e.target.value })}
              helperText={t('siteTaglineHelp')}
            />
          </div>
        </div>

        {/* SEO & Verification */}
        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              {t('siteDescriptionLabel') || 'Site Description'}
            </label>
            <textarea
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none h-20"
              placeholder="Platform Blog CMS Modern untuk penerbitan artikel, berita..."
              value={generalSettings.siteDescription || ''}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              {t('siteKeywordsLabel') || 'Site Keywords (Comma separated)'}
            </label>
            <Input
              type="text"
              placeholder="ScholarCMS, Blog, CMS, Publishing Platform"
              value={generalSettings.siteKeywords || ''}
              onChange={(e) => setGeneralSettings({ ...generalSettings, siteKeywords: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
              {t('googleVerificationLabel') || 'Google Site Verification Code'}
            </label>
            <Input
              type="text"
              placeholder="e.g. VfngzzmDNJEtwJeQiy_..."
              value={generalSettings.googleSiteVerification || ''}
              onChange={(e) => setGeneralSettings({ ...generalSettings, googleSiteVerification: e.target.value })}
            />
          </div>
        </div>

        {/* Registration Switch */}
        <div className="p-4 rounded-2xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)] flex items-center justify-between gap-4">
          <div>
            <span className="block font-bold text-xs text-[var(--text-main)]">{t('allowRegLabel')}</span>
            <span className="block text-[11px] text-[var(--text-muted)]">{t('allowRegHelp')}</span>
          </div>
          <input
            type="checkbox"
            checked={generalSettings.allowRegistration}
            onChange={(e) => setGeneralSettings({ ...generalSettings, allowRegistration: e.target.checked })}
            className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            loading={generalSaving}
          >
            {generalSaving ? t('btnSaving') : t('btnSaveSettings')}
          </Button>

          {generalSavedMessage && (
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1.5 animate-fade-in">
              <CheckCircle className="w-4 h-4" />
              {t('msgSettingsSaved')}
            </span>
          )}
        </div>

      </div>
    </form>
  );
}
