'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { getThemeComponent, THEMES_REGISTRY } from '@/themes';
import PluginWidgetInjector from '@/components/blog/PluginWidgetInjector';

export default function ThemeRenderer({
  posts = [],
  categories = [],
  selectedCategory = 'All',
  onSelectCategory = () => {},
  searchQuery = '',
  onSearch = () => {},
  loading = false
}) {
  const [activeThemeId, setActiveThemeId] = useState('modern');
  const [customizations, setCustomizations] = useState({});
  const [customPackages, setCustomPackages] = useState([]);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    async function loadThemeSettings() {
      try {
        const [themeSetting, packages] = await Promise.all([
          dbService.getActiveTheme(),
          dbService.getCustomThemePackages()
        ]);

        if (themeSetting?.activeThemeId) {
          setActiveThemeId(themeSetting.activeThemeId);
        }
        if (themeSetting?.customizations) {
          setCustomizations(themeSetting.customizations);
        }
        if (Array.isArray(packages)) {
          setCustomPackages(packages);
        }
      } catch (err) {
        console.warn('Error loading theme settings:', err);
      } finally {
        setThemeLoaded(true);
      }
    }
    loadThemeSettings();
  }, []);

  const ComponentToRender = getThemeComponent(activeThemeId, customPackages);

  return (
    <>
      <ComponentToRender
        posts={posts}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        searchQuery={searchQuery}
        onSearch={onSearch}
        loading={loading}
        customizations={customizations}
      />
      <PluginWidgetInjector />
    </>
  );
}
