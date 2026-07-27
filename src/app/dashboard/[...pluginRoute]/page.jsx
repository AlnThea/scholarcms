'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { getPluginComponent, PLUGINS_REGISTRY } from '@/plugins';
import { Puzzle, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function DynamicPluginRoutePage({ params }) {
  const pluginRouteSegments = params?.pluginRoute || [];
  const routePath = pluginRouteSegments.join('/');

  const [loading, setLoading] = useState(true);
  const [pluginStates, setPluginStates] = useState({});
  const [customPackages, setCustomPackages] = useState([]);

  useEffect(() => {
    async function loadPluginConfig() {
      setLoading(true);
      try {
        const [states, packages] = await Promise.all([
          dbService.getPluginStates(),
          dbService.getCustomPluginPackages()
        ]);
        setPluginStates(states || {});
        setCustomPackages(packages || []);
      } catch (err) {
        console.warn('Error loading plugin config:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPluginConfig();
  }, [routePath]);

  if (loading) {
    return (
      <div className="p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] animate-pulse space-y-4">
        <div className="h-8 w-48 bg-[var(--bg-primary)] rounded-xl" />
        <div className="h-64 w-full bg-[var(--bg-primary)] rounded-2xl" />
      </div>
    );
  }

  // Resolve matching plugin component
  const PluginComponent = getPluginComponent(routePath, customPackages);

  // Check if plugin is enabled
  const matchingBuiltin = PLUGINS_REGISTRY.find(p => p.routePath === routePath || p.id === routePath);
  const matchingCustom = customPackages.find(p => (p.routePath || p.id) === routePath);
  const pluginId = matchingBuiltin?.id || matchingCustom?.id || routePath;
  const isEnabled = pluginStates[pluginId] !== false;

  if (!PluginComponent || !isEnabled) {
    return (
      <div className="p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center space-y-4 max-w-xl mx-auto my-8 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-[var(--text-main)]">Halaman Plugin Tidak Tersedia</h2>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Plugin untuk rute <code className="px-2 py-0.5 rounded bg-[var(--bg-primary)] font-mono text-blue-500">/dashboard/{routePath}</code> tidak ditemukan atau sedang berada dalam status <strong>NONAKTIF (OFF)</strong>.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/plugins"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 transition-all inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Kelola Plugin di Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <PluginComponent />;
}
