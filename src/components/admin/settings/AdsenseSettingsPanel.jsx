import { DollarSign, ShieldCheck, Save, CheckCircle } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function AdsenseSettingsPanel({
  t,
  role,
  adSettings,
  setAdSettings,
  handleSaveAdSense,
  adSaving,
  adSavedMessage
}) {
  if (role !== 'admin') return null;

  return (
    <form onSubmit={handleSaveAdSense} className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[var(--text-main)] flex items-center gap-2">
              {t('globalAdSenseHeader')}
              <ShieldCheck className="w-4 h-4 text-blue-500" title={t('adminOnlyBadgeTitle')} />
            </h3>
            <p className="text-xs text-[var(--text-muted)]">{t('globalAdSenseHelp')}</p>
          </div>
        </div>

        <Badge variant={adSettings.globalEnableAds ? 'published' : 'draft'}>
          {adSettings.globalEnableAds ? t('globalAdsOn') : t('globalAdsOff')}
        </Badge>
      </div>

      <div className="space-y-5">
        
        {/* Global Ads Switch */}
        <div className="p-4 rounded-2xl bg-[var(--bg-primary)]/60 border border-[var(--border-color)] flex items-center justify-between gap-4">
          <div>
            <span className="block font-bold text-xs text-[var(--text-main)]">{t('enableGlobalAdsLabel')}</span>
            <span className="block text-[11px] text-[var(--text-muted)]">{t('enableGlobalAdsHelp')}</span>
          </div>
          <input
            type="checkbox"
            checked={adSettings.globalEnableAds}
            onChange={(e) => setAdSettings({ ...adSettings, globalEnableAds: e.target.checked })}
            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
        </div>

        {/* Google Publisher ID */}
        <div>
          <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mb-1">
            {t('publisherIdLabel')}
          </label>
          <Input
            type="text"
            placeholder="ca-pub-9999999999999999"
            value={adSettings.adClient}
            onChange={(e) => setAdSettings({ ...adSettings, adClient: e.target.value })}
            icon={DollarSign}
            helperText={t('publisherIdHelp')}
          />
        </div>

        {/* Grid Ad Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          <div>
            <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
              {t('headerAdSlotLabel')}
            </label>
            <Input
              type="text"
              placeholder="1234567890"
              value={adSettings.headerAdSlot}
              onChange={(e) => setAdSettings({ ...adSettings, headerAdSlot: e.target.value })}
              helperText={t('headerAdSlotHelp')}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
              {t('inArticleAdSlotLabel')}
            </label>
            <Input
              type="text"
              placeholder="0987654321"
              value={adSettings.inArticleAdSlot}
              onChange={(e) => setAdSettings({ ...adSettings, inArticleAdSlot: e.target.value })}
              helperText={t('inArticleAdSlotHelp')}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-[var(--text-muted)] mb-1">
              {t('footerAdSlotLabel')}
            </label>
            <Input
              type="text"
              placeholder="1122334455"
              value={adSettings.footerAdSlot}
              onChange={(e) => setAdSettings({ ...adSettings, footerAdSlot: e.target.value })}
              helperText={t('footerAdSlotHelp')}
            />
          </div>

        </div>

        {/* Save AdSense Button */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Save}
            loading={adSaving}
          >
            {t('saveAdSenseBtn')}
          </Button>

          {adSavedMessage && (
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> {t('adSenseSavedSuccess')}
            </span>
          )}
        </div>

      </div>
    </form>
  );
}
