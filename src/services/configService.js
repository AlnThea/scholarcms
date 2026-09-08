import { isFirebaseConfigured, db, auth } from '@/lib/firebase';
import { INITIAL_MENUS } from '@/constants/mockData';
import { collection, doc, getDocs, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { getLocal, setLocal, withTimeout } from './dbHelpers';

export const configService = {
  // ADSENSE
  async getAdSenseSettings() {
    const DEFAULT_SETTINGS = {
      globalEnableAds: true,
      adClient: 'ca-pub-9999999999999999',
      headerAdSlot: '1234567890',
      inArticleAdSlot: '0987654321',
      footerAdSlot: '1122334455',
      autoAdsEnabled: true,
    };

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'settings', 'adsense');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return { ...DEFAULT_SETTINGS, ...snap.data() };
        }
      } catch (e) {}
    }
    return getLocal('adsense_settings', DEFAULT_SETTINGS);
  },

  async saveAdSenseSettings(settingsData) {
    const payload = {
      globalEnableAds: settingsData.globalEnableAds !== undefined ? settingsData.globalEnableAds : true,
      adClient: settingsData.adClient || 'ca-pub-9999999999999999',
      headerAdSlot: settingsData.headerAdSlot || '1234567890',
      inArticleAdSlot: settingsData.inArticleAdSlot || '0987654321',
      footerAdSlot: settingsData.footerAdSlot || '1122334455',
      autoAdsEnabled: settingsData.autoAdsEnabled !== undefined ? settingsData.autoAdsEnabled : true,
      updatedAt: new Date().toISOString(),
    };
    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'settings', 'adsense'), payload, { merge: true });
        return payload;
      } catch (e) {}
    }
    setLocal('adsense_settings', payload);
    return payload;
  },

  // GENERAL
  async getGeneralSettings() {
    const DEFAULT_SETTINGS = {
      siteTitle: 'ScholarCMS',
      siteTagline: 'Modern Publishing Platform',
      siteDescription: 'Platform Blog CMS Modern untuk penerbitan artikel, berita, dan konten berkualitas.',
      siteKeywords: 'ScholarCMS, Blog, CMS, Publishing Platform, Artikel, Berita',
      googleSiteVerification: '',
      allowRegistration: true,
      updatedAt: new Date().toISOString(),
    };
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'settings', 'general');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return { ...DEFAULT_SETTINGS, ...snap.data() };
        }
      } catch (e) {}
    }
    return getLocal('general_settings', DEFAULT_SETTINGS);
  },

  async saveGeneralSettings(settingsData) {
    const payload = {
      siteTitle: (settingsData.siteTitle || 'ScholarCMS').trim(),
      siteTagline: (settingsData.siteTagline || 'Modern Publishing Platform').trim(),
      siteDescription: (settingsData.siteDescription || 'Platform Blog CMS Modern untuk penerbitan artikel, berita, dan konten berkualitas.').trim(),
      siteKeywords: (settingsData.siteKeywords || 'ScholarCMS, Blog, CMS, Publishing Platform, Artikel, Berita').trim(),
      googleSiteVerification: (settingsData.googleSiteVerification || '').trim(),
      allowRegistration: settingsData.allowRegistration !== undefined ? settingsData.allowRegistration : true,
      updatedAt: new Date().toISOString(),
    };
    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'settings', 'general'), payload, { merge: true });
        return payload;
      } catch (e) {}
    }
    setLocal('general_settings', payload);
    return payload;
  },

  // MENUS
  async getMenu(location = 'header') {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'menus', location);
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data().items) {
          return snap.data().items;
        }
      } catch (e) {}
    }
    const menus = getLocal('menus', INITIAL_MENUS);
    return menus[location] || INITIAL_MENUS[location] || [];
  },

  async saveMenu(location = 'header', items = []) {
    const payload = { location, items, updatedAt: new Date().toISOString() };
    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'menus', location), payload, { merge: true });
        return items;
      } catch (e) {}
    }
    let menus = getLocal('menus', INITIAL_MENUS);
    menus[location] = items;
    setLocal('menus', menus);
    return items;
  },

  // THEMES
  async getActiveTheme() {
    const DEFAULT = {
      activeThemeId: 'modern',
      customizations: { primaryColor: '#2563eb', accentColor: '#3b82f6', fontFamily: 'Inter', cardStyle: 'glassmorphism', heroStyle: 'featured', customCss: '' },
      updatedAt: new Date().toISOString()
    };
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'settings', 'theme');
        const snap = await withTimeout(getDoc(docRef));
        if (snap.exists()) return { ...DEFAULT, ...snap.data() };
      } catch (e) {}
    }
    return getLocal('theme_settings', DEFAULT);
  },

  async setActiveTheme(themeId) {
    const current = await this.getActiveTheme();
    const payload = { ...current, activeThemeId: themeId, updatedAt: new Date().toISOString() };
    if (isFirebaseConfigured()) {
      try { await setDoc(doc(db, 'settings', 'theme'), payload, { merge: true }); return payload; } catch (e) {}
    }
    setLocal('theme_settings', payload);
    return payload;
  },

  async saveThemeCustomizations(customizationsData) {
    const current = await this.getActiveTheme();
    const payload = { ...current, customizations: { ...(current.customizations || {}), ...customizationsData }, updatedAt: new Date().toISOString() };
    if (isFirebaseConfigured()) {
      try { await setDoc(doc(db, 'settings', 'theme'), payload, { merge: true }); return payload; } catch (e) {}
    }
    setLocal('theme_settings', payload);
    return payload;
  },

  async getCustomThemePackages() {
    if (isFirebaseConfigured()) {
      try {
        const snap = await withTimeout(getDocs(collection(db, 'custom_themes')));
        if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {}
    }
    return getLocal('custom_theme_packages', []);
  },

  async saveCustomThemePackage(themePackage) {
    const payload = { ...themePackage, id: themePackage.id || `custom-${Date.now()}`, createdAt: new Date().toISOString() };
    if (isFirebaseConfigured()) {
      try { await setDoc(doc(db, 'custom_themes', payload.id), payload, { merge: true }); return payload; } catch (e) {}
    }
    const pkgs = getLocal('custom_theme_packages', []);
    const idx = pkgs.findIndex(p => p.id === payload.id);
    if (idx !== -1) pkgs[idx] = payload; else pkgs.push(payload);
    setLocal('custom_theme_packages', pkgs);
    return payload;
  },

  // PLUGINS
  async getPluginStates() {
    const DEFAULT = { 'seo-analyzer': true, 'newsletter': true, 'whatsapp-float': true };
    const local = getLocal('plugin_states', null);
    if (local) return { ...DEFAULT, ...local };
    if (isFirebaseConfigured()) {
      try {
        const snap = await withTimeout(getDoc(doc(db, 'settings', 'plugins')), 1500);
        if (snap.exists()) {
          const m = { ...DEFAULT, ...snap.data() };
          setLocal('plugin_states', m);
          return m;
        }
      } catch (e) {}
    }
    return DEFAULT;
  },

  async togglePluginStatus(pluginId, isEnabled) {
    const current = await this.getPluginStates();
    const payload = { ...current, [pluginId]: isEnabled, updatedAt: new Date().toISOString() };
    setLocal('plugin_states', payload);
    if (isFirebaseConfigured()) {
      try { await setDoc(doc(db, 'settings', 'plugins'), payload, { merge: true }); } catch (e) {}
    }
    return payload;
  },

  async getPluginSettings(pluginId) {
    const DEFAULT = {
      'whatsapp-float': { phoneNumber: '6281234567890', welcomeMessage: 'Halo Admin', buttonPosition: 'bottom-right' },
      'newsletter': { headingTitle: 'Dapatkan Artikel Terbaru', buttonLabel: 'Berlangganan' },
      'seo-analyzer': { autoScan: true }
    };
    if (isFirebaseConfigured()) {
      try {
        const snap = await withTimeout(getDoc(doc(db, 'settings', `plugin_${pluginId}`)));
        if (snap.exists()) {
          const m = { ...(DEFAULT[pluginId] || {}), ...snap.data() };
          setLocal(`plugin_setting_${pluginId}`, m);
          return m;
        }
      } catch (e) {}
    }
    return getLocal(`plugin_setting_${pluginId}`, DEFAULT[pluginId] || {});
  },

  async savePluginSettings(pluginId, settingsData) {
    const current = await this.getPluginSettings(pluginId);
    const payload = { ...current, ...settingsData, updatedAt: new Date().toISOString() };
    setLocal(`plugin_setting_${pluginId}`, payload);
    if (isFirebaseConfigured()) {
      try { await setDoc(doc(db, 'settings', `plugin_${pluginId}`), payload, { merge: true }); } catch (e) {}
    }
    return payload;
  },

  async getCustomPluginPackages() {
    if (isFirebaseConfigured()) {
      try {
        const snap = await withTimeout(getDocs(collection(db, 'custom_plugins')));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setLocal('custom_plugin_packages', list);
          return list;
        }
      } catch (e) {}
    }
    return getLocal('custom_plugin_packages', []);
  },

  async saveCustomPluginPackage(pkg) {
    const payload = { ...pkg, id: pkg.id || `plugin-${Date.now()}`, createdAt: new Date().toISOString() };
    const pkgs = getLocal('custom_plugin_packages', []);
    const idx = pkgs.findIndex(p => p.id === payload.id);
    if (idx !== -1) pkgs[idx] = payload; else pkgs.push(payload);
    setLocal('custom_plugin_packages', pkgs);
    if (isFirebaseConfigured()) {
      try { await setDoc(doc(db, 'custom_plugins', payload.id), payload, { merge: true }); } catch (e) {}
    }
    return payload;
  },

  // NEWSLETTER
  async getSubscribers() {
    if (isFirebaseConfigured()) {
      try {
        const snap = await withTimeout(getDocs(collection(db, 'subscribers')));
        if (!snap.empty) return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {}
    }
    return getLocal('subscribers', [{ id: 'sub-1', email: 'pembaca1@example.com', name: 'Budi Santoso', subscribedAt: new Date().toISOString() }]);
  },

  async addSubscriber(subscriberData) {
    const payload = { email: (subscriberData.email || '').trim().toLowerCase(), name: subscriberData.name || 'Pembaca Setia', subscribedAt: new Date().toISOString() };
    if (isFirebaseConfigured()) {
      try { const res = await addDoc(collection(db, 'subscribers'), payload); return { id: res.id, ...payload }; } catch (e) {}
    }
    const subs = getLocal('subscribers', []);
    const newSub = { id: `sub-${Date.now()}`, ...payload };
    subs.unshift(newSub);
    setLocal('subscribers', subs);
    return newSub;
  },

  // DASHBOARD WIDGET
  async getDashboardWidgetLayout() {
    const DEFAULT = { order: ['welcome', 'article_management', 'stat_categories', 'stat_posts', 'stat_views', 'stat_comments', 'seo_summary', 'recent_activity', 'system_status'], columns: 10, sizes: { welcome: '5x2', article_management: '3x2', stat_categories: '2x1', stat_posts: '2x1', stat_views: '2x1', stat_comments: '2x1', seo_summary: '5x2', recent_activity: '5x2', system_status: '5x2' }, rowBreaks: {} };
    const local = getLocal('dashboard_layout_config', null);
    if (local && Array.isArray(local.order) && local.order.length > 0) {
      return { order: local.order, columns: local.columns || 10, sizes: { ...DEFAULT.sizes, ...(local.sizes || {}) }, rowBreaks: local.rowBreaks || {}, updatedAt: local.updatedAt };
    }
    if (isFirebaseConfigured()) {
      try {
        const snap = await withTimeout(getDoc(doc(db, 'settings', 'dashboard_layout')), 1500);
        if (snap.exists()) {
          const d = snap.data();
          const res = { order: Array.isArray(d.order) && d.order.length > 0 ? d.order : DEFAULT.order, columns: d.columns || DEFAULT.columns, sizes: { ...DEFAULT.sizes, ...(d.sizes || {}) }, rowBreaks: d.rowBreaks || {}, updatedAt: d.updatedAt };
          setLocal('dashboard_layout_config', res);
          return res;
        }
      } catch (e) {}
    }
    return DEFAULT;
  },

  async saveDashboardWidgetLayout(payload) {
    const timestamp = new Date().toISOString();
    const config = Array.isArray(payload) ? { order: payload, columns: 10, sizes: {}, rowBreaks: {}, updatedAt: timestamp } : { ...payload, updatedAt: timestamp };
    setLocal('dashboard_layout_config', config);
    if (isFirebaseConfigured()) {
      try { await setDoc(doc(db, 'settings', 'dashboard_layout'), config, { merge: true }); } catch (e) {}
    }
    return config;
  },

  // USER
  async getCurrentUser() {
    if (typeof window === 'undefined') return { role: 'admin', name: 'Super Admin' };
    const local = getLocal('current_user', null);
    if (local) return local;
    if (isFirebaseConfigured() && auth?.currentUser) {
      try {
        const snap = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (snap.exists()) {
          const u = snap.data();
          setLocal('current_user', u);
          return u;
        }
      } catch (e) {}
    }
    return { role: 'admin', name: 'Super Admin' };
  }
};
