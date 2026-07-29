import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { Search, X, LayoutDashboard, Sun, Moon, Feather, LogIn, UserPlus, LogOut, User, ShieldCheck, PenTool, Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { useMetaSidebar } from '@/context/MetaSidebarContext';
import { translateLabel } from '@/utils/menuTranslator';
import { usePathname } from 'next/navigation';
import { dbService } from '@/services/dbService';

function buildMenuTree(flatItems) {
  if (!Array.isArray(flatItems) || flatItems.length === 0) return [];
  const level1 = [];
  let currentL1 = null;
  let currentL2 = null;

  flatItems.forEach(item => {
    const linkUrl = item.type === 'category'
      ? `/?category=${encodeURIComponent(item.target)}`
      : item.type === 'page'
        ? `/page/${item.target}`
        : item.url || '/';

    const node = { ...item, href: linkUrl, children: [] };

    if (item.level === 1 || !item.level) {
      currentL1 = node;
      currentL2 = null;
      level1.push(currentL1);
    } else if (item.level === 2) {
      if (!currentL1) {
        currentL1 = node;
        level1.push(currentL1);
      } else {
        currentL2 = node;
        currentL1.children.push(currentL2);
      }
    } else if (item.level === 3) {
      if (currentL2) {
        currentL2.children.push(node);
      } else if (currentL1) {
        currentL1.children.push(node);
      } else {
        level1.push(node);
      }
    }
  });

  return level1;
}

export default function Navbar({ onSearch, searchQuery }) {
  const { isDark, toggleTheme, mounted } = useTheme();
  const { user, role, logout } = useAuth();
  const { t, language } = useLanguage();
  const [siteTitle, setSiteTitle] = useState('ScholarCMS');
  const [siteTagline, setSiteTagline] = useState('Modern Publishing Platform');
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuTree, setMenuTree] = useState([]);
  const [activeL1, setActiveL1] = useState(null);
  const [activeL2, setActiveL2] = useState(null);
  const { openSidebar } = useMetaSidebar();

  // Sliding / Expandable Search States
  const [isSearchOpen, setIsSearchOpen] = useState(Boolean(searchQuery));
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchQuery) {
      setIsSearchOpen(true);
    }
  }, [searchQuery]);

  const handleToggleSearch = () => {
    if (isSearchOpen) {
      if (!searchQuery) {
        setIsSearchOpen(false);
      }
    } else {
      setIsSearchOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleClearSearch = () => {
    if (onSearch) onSearch('');
    setIsSearchOpen(false);
  };

  useEffect(() => {
    async function loadNavbarData() {
      try {
        const [items, genSettings] = await Promise.all([
          dbService.getMenu('header'),
          dbService.getGeneralSettings()
        ]);
        
        if (genSettings) {
          const titleToUse = genSettings.siteTitle || siteTitle;
          const taglineToUse = genSettings.siteTagline || siteTagline;
          if (genSettings.siteTitle) setSiteTitle(genSettings.siteTitle);
          if (genSettings.siteTagline) setSiteTagline(genSettings.siteTagline);
          if (genSettings.allowRegistration === false) setAllowRegistration(false);

          if (typeof document !== 'undefined' && titleToUse) {
            document.title = taglineToUse ? `${titleToUse} - ${taglineToUse}` : titleToUse;
          }
        }

        const filteredHeaderItems = (items || []).filter((item) => {
          const label = (item.label || '').toLowerCase();
          const target = (item.target || item.url || '').toLowerCase();
          return !label.includes('sitemap') && !target.includes('sitemap');
        });
        setMenuTree(buildMenuTree(filteredHeaderItems));
      } catch (err) {
        console.error('Navbar data loading error:', err);
      }
    }
    loadNavbarData();
  }, []);

  // Helper to split brand title visually if ending with "CMS" or "Blog"
  const renderBrandTitle = (title) => {
    if (!title) return 'ScholarCMS';
    if (title.toLowerCase().endsWith('cms')) {
      const mainPart = title.slice(0, -3);
      return <>{mainPart}<span className="gradient-text">CMS</span></>;
    }
    return title;
  };

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-[var(--border-color)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-[var(--text-main)] flex items-center gap-1.5">
              {renderBrandTitle(siteTitle)}
            </div>
            <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">{siteTagline}</p>
          </div>
        </Link>

        {/* Dynamic 3-Level Header Menu Navigation */}
        <nav className="hidden lg:flex items-center gap-1 mx-2">
          {menuTree.map((l1Item) => {
            const hasL2 = l1Item.children && l1Item.children.length > 0;
            return (
              <div
                key={l1Item.id}
                className="relative group"
                onMouseEnter={() => setActiveL1(l1Item.id)}
                onMouseLeave={() => { setActiveL1(null); setActiveL2(null); }}
              >
                <Link
                  href={l1Item.href}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-main)] hover:text-blue-500 hover:bg-[var(--bg-surface)] transition-all"
                >
                  {translateLabel(l1Item.label, language)}
                  {hasL2 && <ChevronDown className="w-3.5 h-3.5 text-[var(--text-subtle)] group-hover:rotate-180 transition-transform" />}
                </Link>

                {/* Level 2 Dropdown */}
                {hasL2 && activeL1 === l1Item.id && (
                  <div className="absolute left-0 mt-1 w-56 rounded-2xl glass-panel shadow-2xl p-2 z-50 space-y-1 animate-fade-in border border-[var(--border-color)]">
                    {l1Item.children.map((l2Item) => {
                      const hasL3 = l2Item.children && l2Item.children.length > 0;
                      return (
                        <div
                          key={l2Item.id}
                          className="relative"
                          onMouseEnter={() => setActiveL2(l2Item.id)}
                        >
                          <Link
                            href={l2Item.href}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-main)] hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            <span>{translateLabel(l2Item.label, language)}</span>
                            {hasL3 && <ChevronRight className="w-3.5 h-3.5" />}
                          </Link>

                          {/* Level 3 Sub-Dropdown */}
                          {hasL3 && activeL2 === l2Item.id && (
                            <div className="absolute left-full top-0 ml-1 w-52 rounded-2xl glass-panel shadow-2xl p-2 z-50 space-y-1 animate-fade-in border border-[var(--border-color)]">
                              {l2Item.children.map((l3Item) => (
                                <Link
                                  key={l3Item.id}
                                  href={l3Item.href}
                                  className="block px-3 py-2 rounded-xl text-xs font-medium text-[var(--text-main)] hover:bg-indigo-600 hover:text-white transition-colors"
                                >
                                  {translateLabel(l3Item.label, language)}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Expandable Sliding Search Bar */}
        <div className="flex-1 flex justify-end max-w-md mx-2">
          {!isSearchOpen ? (
            <button
              onClick={handleToggleSearch}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-blue-500/50 shadow-sm transition-all duration-300 animate-fade-in group cursor-pointer"
              title={t('searchArticlesTitle')}
            >
              <Search className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">{t('searchArticlesPlaceholder')}</span>
            </button>
          ) : (
            <div className="relative flex items-center w-full max-w-xs sm:max-w-sm md:max-w-md transition-all duration-300 ease-out animate-fade-in">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t('searchFullPlaceholder')}
                value={searchQuery || ''}
                onChange={(e) => onSearch && onSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleClearSearch();
                  }
                }}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-[var(--bg-surface)] border border-blue-500/50 text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-md transition-all"
              />
              <button
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[var(--text-subtle)] hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Tutup & Bersihkan"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            title={mounted ? (isDark ? t('switchToLight') : t('switchToDark')) : t('switchToDark')}
          >
            {mounted && !isDark ? (
              <Moon className="w-4 h-4 text-indigo-600" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* User Auth Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-blue-500/50 transition-all"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover"
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-[var(--text-main)] leading-tight">{user.name}</p>
                  <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider flex items-center gap-1">
                    {role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                    {role === 'writer' && <PenTool className="w-3 h-3" />}
                    {role === 'user' && <User className="w-3 h-3" />}
                    {role}
                  </p>
                </div>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel shadow-2xl p-2 z-50 space-y-1 animate-fade-in border border-[var(--border-color)]">
                  <div className="px-3 py-2 border-b border-[var(--border-color)]">
                    <p className="text-xs font-bold text-[var(--text-main)] truncate">{user.name}</p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</p>
                  </div>

                  {(role === 'admin' || role === 'writer') && (
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-main)] hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard Panel
                    </Link>
                  )}

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[var(--text-main)] hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" /> Edit Profil Saya
                  </Link>

                  <button
                    onClick={() => { setUserMenuOpen(false); logout(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Keluar (Logout)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--bg-primary)] transition-all"
              >
                <LogIn className="w-4 h-4 text-blue-500" /> Masuk
              </Link>
              {allowRegistration && (
                <Link
                  href="/register"
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all"
                >
                  <UserPlus className="w-4 h-4" /> Daftar
                </Link>
              )}
            </div>
          )}

        </div>

      </div>
    </header>
  );
}
