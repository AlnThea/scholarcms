'use client';

import SeoAnalyzerPluginPage from './seo-analyzer';
import NewsletterPluginPage from './newsletter';
import WhatsAppPluginPage from './whatsapp-float';
import { Search, Mail, MessageCircle, Puzzle } from 'lucide-react';

export const PLUGINS_REGISTRY = [
  {
    id: 'seo-analyzer',
    name: 'SEO Analyzer & Realtime Auditor',
    description: 'Audit skor SEO artikel blog Anda secara otomatis, periksa kata kunci fokus, ketersediaan meta description, dan kesehatan tag.',
    version: '1.2.0',
    author: 'ScholarCMS Team',
    category: 'SEO & Analytics',
    routePath: 'seo-analyzer',
    navLabel: 'SEO Analyzer',
    icon: Search,
    hasPublicWidget: false,
    component: SeoAnalyzerPluginPage
  },
  {
    id: 'newsletter',
    name: 'Newsletter & Subscriber Manager',
    description: 'Kumpulkan daftar email subscriber pembaca blog Anda dan kirimkan update broadcast email secara instan.',
    version: '2.0.0',
    author: 'ScholarCMS Team',
    category: 'Marketing & Subscriptions',
    routePath: 'newsletter',
    navLabel: 'Newsletter Email',
    icon: Mail,
    hasPublicWidget: true,
    component: NewsletterPluginPage
  },
  {
    id: 'whatsapp-float',
    name: 'WhatsApp Contact Floating Button',
    description: 'Tampilkan tombol kontak obrolan WhatsApp melayang interaktif di sudut blog pembaca untuk memudahkan komunikasi langsung.',
    version: '1.1.0',
    author: 'ScholarCMS Team',
    category: 'Customer Chat Widget',
    routePath: 'whatsapp-float',
    navLabel: 'WhatsApp Chat',
    icon: MessageCircle,
    hasPublicWidget: true,
    component: WhatsAppPluginPage
  }
];

// DYNAMIC PLUGIN RESOLVER FOR ROUTE: /dashboard/[...pluginRoute]
export function getPluginComponent(routePath, customPackages = []) {
  const cleanRoute = Array.isArray(routePath) ? routePath.join('/') : (routePath || '').replace(/^\//, '');

  const foundBuiltin = PLUGINS_REGISTRY.find(p => p.routePath === cleanRoute || p.id === cleanRoute);
  if (foundBuiltin) {
    return foundBuiltin.component;
  }

  // Check if custom uploaded plugin package match
  const foundCustom = customPackages.find(p => p.routePath === cleanRoute || p.id === cleanRoute);
  if (foundCustom) {
    return function CustomPluginWrapper() {
      return (
        <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              <Puzzle className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-main)]">{foundCustom.name}</h1>
              <p className="text-xs text-[var(--text-muted)]">Plugin Kustom v{foundCustom.version || '1.0.0'} • Oleh {foundCustom.author || 'Anonymous'}</p>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] border-t border-[var(--border-color)] pt-4">
            {foundCustom.description || 'Halaman plugin kustom ini berjalan secara dinamis di bawah Dynamic Catch-All Plugin Router.'}
          </p>
        </div>
      );
    };
  }

  return null;
}

// RESOLVE ENABLED PLUGIN NAVIGATION ITEMS FOR ADMIN SIDEBAR
export function getEnabledPluginNavItems(pluginStates = {}, customPackages = []) {
  const items = [];

  PLUGINS_REGISTRY.forEach(p => {
    // Enabled by default if not explicitly false
    const isEnabled = pluginStates[p.id] !== false;
    if (isEnabled) {
      items.push({
        label: p.navLabel,
        href: `/dashboard/${p.routePath}`,
        icon: p.icon || Puzzle,
        roles: ['admin', 'writer'],
        isPlugin: true
      });
    }
  });

  customPackages.forEach(cp => {
    const isEnabled = pluginStates[cp.id] !== false;
    if (isEnabled) {
      items.push({
        label: cp.navLabel || cp.name,
        href: `/dashboard/${cp.routePath || cp.id}`,
        icon: Puzzle,
        roles: ['admin', 'writer'],
        isPlugin: true
      });
    }
  });

  return items;
}
