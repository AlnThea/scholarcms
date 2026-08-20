'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { dbService } from '@/services/dbService';
import { 
  FileText, Eye, MessageSquare, FolderTree, PlusCircle, 
  Settings, ArrowRight, ArrowLeft, ShieldCheck, Clock, GripVertical, RotateCcw,
  Sparkles, CheckCircle2, Search, ExternalLink, LayoutGrid, Edit3, Save, Check,
  MousePointerClick, Move, X, Sliders, ArrowUp, ArrowDown, Layout, CornerDownRight,
  Mail, PhoneCall, Users, Palette, Puzzle, Layers, Trash2, Plus,
  BarChart3, PieChart, Table, TrendingUp, CheckCircle, XCircle, Tag, Filter,
  Activity, BarChart2, Zap, Grid, Calendar, ShieldAlert, Compass, Gauge, GitBranch,
  UserCheck
} from 'lucide-react';

import StatsCard from '@/components/dashboard/StatsCard';
import Button from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';
import WelcomeWidget from '@/components/dashboard/widgets/WelcomeWidget';
import TrafficSourcePieWidget from '@/components/dashboard/widgets/TrafficSourcePieWidget';

export default function DashboardOverview() {
  const { t, language } = useLanguage();
  const [analytics, setAnalytics] = useState(null);
  const [analyticsSeries, setAnalyticsSeries] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  const [recentComments, setRecentComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  // Edit Layout Mode State
  const [isEditMode, setIsEditMode] = useState(false);

  // Role-Based Access Control View State ('admin' | 'writer' | 'user')
  const [activeRoleView, setActiveRoleView] = useState('admin');

  // Add Widget Modal Catalog State & Selected Category Tab
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [catalogTab, setCatalogTab] = useState('Semua');

  // Active Widget Drawer Inspector State
  const [activeWidgetId, setActiveWidgetId] = useState(null);

  // Click-to-Pick Target Swap State
  const [isSelectingSwapTarget, setIsSelectingSwapTarget] = useState(false);

  // Draggable Floating Modal Window Coordinates
  const [modalPos, setModalPos] = useState({ x: 20, y: 80 });
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Widget Layout & 10-Column Grid Matrix State
  const [widgetOrder, setWidgetOrder] = useState([
    'welcome',
    'article_management',
    'stat_categories',
    'stat_posts',
    'stat_views',
    'stat_comments',
    'seo_summary',
    'recent_activity',
    'system_status'
  ]);

  const [widgetSizes, setWidgetSizes] = useState({
    welcome: '5x2',
    article_management: '3x2',
    stat_categories: '2x1',
    stat_posts: '2x1',
    stat_views: '2x1',
    stat_comments: '2x1',
    stat_subscribers: '2x1',
    stat_whatsapp: '2x1',
    stat_users: '2x1',
    stat_theme: '2x1',
    stat_plugins: '2x1',
    stat_pages: '2x1',
    stat_scheduled: '2x1',
    chart_views_trend: '5x2',
    chart_category_distribution: '5x2',
    chart_visitors_area: '5x2',
    chart_seo_keywords_donut: '5x2',
    chart_system_radar: '5x2',
    chart_sparklines_grid: '5x2',
    chart_hourly_heatmap: '5x2',
    chart_traffic_source_pie: '5x2',
    chart_top_posts_hbar: '5x2',
    chart_dual_line_comparison: '5x2',
    chart_post_status_stacked: '5x2',
    chart_speedometer_gauge: '5x2',
    table_comments_moderation: '5x2',
    table_seo_articles: '5x2',
    recent_comments: '5x2',
    seo_summary: '5x2',
    recent_activity: '5x2',
    system_status: '5x2'
  });

  // Per-Widget Row Break State (col-start-1 force new row line break)
  const [widgetRowBreaks, setWidgetRowBreaks] = useState({});
  
  // Drag & Drop Interaction States
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const [pluginStates, setPluginStates] = useState({});

  const ALL_AVAILABLE_WIDGETS = [
    { id: 'welcome', name: 'Banner Selamat Datang', category: 'Informasi', desc: 'Banner penyambutan & tombol aksi cepat', defaultSize: '5x2', allowedRoles: ['admin', 'writer', 'user'] },
    { id: 'stat_posts', name: 'Total Artikel', category: 'Metrik Statistik', desc: 'Kartu indikator jumlah artikel terbit & draf', defaultSize: '2x1', allowedRoles: ['admin', 'writer', 'user'] },
    { id: 'stat_views', name: 'Total Pembaca', category: 'Metrik Statistik', desc: 'Akumulasi pembaca seluruh artikel blog', defaultSize: '2x1', allowedRoles: ['admin', 'writer', 'user'] },
    { id: 'stat_comments', name: 'Komentar Pengunjung', category: 'Metrik Statistik', desc: 'Total komentar pembaca terdaftar', defaultSize: '2x1', allowedRoles: ['admin', 'writer', 'user'] },
    { id: 'stat_categories', name: 'Kategori Topik', category: 'Metrik Statistik', desc: 'Jumlah taksonomi kategori artikel', defaultSize: '2x1', allowedRoles: ['admin', 'writer'] },
    { id: 'stat_subscribers', name: 'Pelanggan Newsletter', category: 'Ekstensi Plugin', pluginId: 'newsletter', desc: 'Jumlah email pembaca terdaftar newsletter', defaultSize: '2x1', allowedRoles: ['admin'] },
    { id: 'stat_whatsapp', name: 'WhatsApp Support', category: 'Ekstensi Plugin', pluginId: 'whatsapp-float', desc: 'Status tombol melayang WhatsApp Float', defaultSize: '2x1', allowedRoles: ['admin'] },
    { id: 'stat_users', name: 'Kelola Pengguna', category: 'Administrasi', desc: 'Jumlah pengguna & peranan hak akses', defaultSize: '2x1', allowedRoles: ['admin'] },
    { id: 'stat_theme', name: 'Tema Aktif CMS', category: 'Desain & Tema', desc: 'Status nama tema aktif & kustomisasi warna', defaultSize: '2x1', allowedRoles: ['admin'] },
    { id: 'stat_plugins', name: 'Ekstensi Plugin Aktif', category: 'Ekstensi Plugin', desc: 'Jumlah plugin built-in yang sedang aktif', defaultSize: '2x1', allowedRoles: ['admin'] },
    { id: 'stat_pages', name: 'Halaman Statis', category: 'Manajemen Konten', desc: 'Jumlah halaman statis yang dipublikasikan', defaultSize: '2x1', allowedRoles: ['admin', 'writer'] },
    { id: 'stat_scheduled', name: 'Artikel Terjadwal', category: 'Manajemen Konten', desc: 'Artikel dalam antrean rilis otomatis', defaultSize: '2x1', allowedRoles: ['admin', 'writer'] },
    
    // CHART WIDGET SUITE (WITH RBAC ROLES)
    { id: 'chart_traffic_source_pie', name: 'Chart Pie Lingkaran Sumber Trafik', category: 'Chart & Grafik', desc: 'Visual pie chart lingkaran sumber kedatangan pembaca', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },
    { id: 'chart_views_trend', name: 'Chart Bar Tren Pembaca (7 Hari)', category: 'Chart & Grafik', desc: 'Visual grafik batang statistik tren pembaca harian', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },
    { id: 'chart_top_posts_hbar', name: 'Chart Batang Horisontal Artikel Terpopuler', category: 'Chart & Grafik', desc: 'Visual grafik batang horisontal pembaca artikel terbanyak', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },
    { id: 'chart_visitors_area', name: 'Chart Area Kurva Pengunjung (30 Hari)', category: 'Chart & Grafik', desc: 'Visual grafik kurva area pembaca unik bulanan', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },
    { id: 'chart_seo_keywords_donut', name: 'Chart Donat Performa Kata Kunci SEO', category: 'Chart & Grafik', pluginId: 'seo-analyzer', desc: 'Visual grafik donat distribusi peringkat kata kunci', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },
    { id: 'chart_dual_line_comparison', name: 'Chart Garis Komparasi Artikel vs Pembaca', category: 'Chart & Grafik', desc: 'Visual grafik dua garis perbandingan rilis vs pembaca', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },
    { id: 'chart_post_status_stacked', name: 'Chart Stacked Bar Status Postingan', category: 'Chart & Grafik', desc: 'Visual grafik batang bertumpuk status artikel bulanan', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },
    { id: 'chart_speedometer_gauge', name: 'Chart Gauge Speedometer Performa CMS', category: 'Chart & Grafik', desc: 'Visual grafik speedometer gauge skor kecepatan muat', defaultSize: '5x2', allowedRoles: ['admin'] },
    { id: 'chart_system_radar', name: 'Chart Radar Kesehatan CMS', category: 'Chart & Grafik', desc: 'Visual grafik radar evaluasi 6 dimensi sistem CMS', defaultSize: '5x2', allowedRoles: ['admin'] },
    { id: 'chart_sparklines_grid', name: 'Chart Grid Sparkline Metrik', category: 'Chart & Grafik', desc: '4 grafik kurva sparkline mini perbandingan pertumbuhan', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },
    { id: 'chart_hourly_heatmap', name: 'Chart Heatmap Jam Kunjungan', category: 'Chart & Grafik', desc: 'Visual heatmap jam sibuk kedatangan pembaca', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },

    // INTERACTIVE TABLE WIDGETS
    { id: 'table_comments_moderation', name: 'Tabel Moderasi Komentar', category: 'Tabel & Konten', desc: 'Tabel cepat moderasi komentar pembaca', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },
    { id: 'table_seo_articles', name: 'Tabel Kesehatan SEO Artikel', category: 'Tabel & Konten', pluginId: 'seo-analyzer', desc: 'Tabel perbandingan skor SEO per artikel', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },

    { id: 'article_management', name: 'Manajemen Artikel & Editor', category: 'Manajemen Konten', desc: 'Pintu masuk Visual Block Editor & postingan', defaultSize: '3x2', allowedRoles: ['admin', 'writer'] },
    { id: 'seo_summary', name: 'Audit SEO Real-time', category: 'Ekstensi Plugin', pluginId: 'seo-analyzer', desc: 'Ringkasan skor kesehatan SEO seluruh artikel', defaultSize: '5x2', allowedRoles: ['admin', 'writer'] },
    { id: 'recent_activity', name: 'Artikel Terbaru Dibuat', category: 'Manajemen Konten', desc: 'Daftar 3 artikel terbaru yang baru ditulis', defaultSize: '5x2', allowedRoles: ['admin', 'writer', 'user'] },
    { id: 'recent_comments', name: 'Feed Komentar Terbaru', category: 'Interaksi Pembaca', desc: 'Daftar komentar terbaru dari pembaca blog', defaultSize: '5x2', allowedRoles: ['admin', 'writer', 'user'] },
    { id: 'system_status', name: 'Status Database & Sistem', category: 'Administrasi', desc: 'Status koneksi Firestore Cloud & Local Storage', defaultSize: '5x2', allowedRoles: ['admin'] }
  ];

  const CATALOG_TABS = [
    'Semua',
    'Chart & Grafik',
    'Tabel & Konten',
    'Metrik Statistik',
    'Ekstensi Plugin',
    'Manajemen Konten',
    'Administrasi'
  ];

  const WIDGET_NAMES = ALL_AVAILABLE_WIDGETS.reduce((acc, w) => {
    acc[w.id] = w.name;
    return acc;
  }, {});

  const DEFAULT_ORDER = [
    'welcome',
    'article_management',
    'stat_categories',
    'stat_posts',
    'stat_views',
    'stat_comments',
    'seo_summary',
    'recent_activity',
    'system_status'
  ];

  const DEFAULT_SIZES = {
    welcome: '5x2',
    article_management: '3x2',
    stat_categories: '2x1',
    stat_posts: '2x1',
    stat_views: '2x1',
    stat_comments: '2x1',
    stat_subscribers: '2x1',
    stat_whatsapp: '2x1',
    stat_users: '2x1',
    stat_theme: '2x1',
    stat_plugins: '2x1',
    stat_pages: '2x1',
    stat_scheduled: '2x1',
    chart_views_trend: '5x2',
    chart_category_distribution: '5x2',
    chart_visitors_area: '5x2',
    chart_seo_keywords_donut: '5x2',
    chart_system_radar: '5x2',
    chart_sparklines_grid: '5x2',
    chart_hourly_heatmap: '5x2',
    chart_traffic_source_pie: '5x2',
    chart_top_posts_hbar: '5x2',
    chart_dual_line_comparison: '5x2',
    chart_post_status_stacked: '5x2',
    chart_speedometer_gauge: '5x2',
    table_comments_moderation: '5x2',
    table_seo_articles: '5x2',
    recent_comments: '5x2',
    seo_summary: '5x2',
    recent_activity: '5x2',
    system_status: '5x2'
  };

  useEffect(() => {
    setMounted(true);
    loadData();
    if (typeof window !== 'undefined') {
      const defaultX = Math.max(20, window.innerWidth - 410);
      setModalPos({ x: defaultX, y: 90 });
    }
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [analyticsData, seriesData, postsData, savedConfig, subs, comments, pages, pStates, currentUser] = await Promise.all([
        dbService.getAnalytics(),
        dbService.getAnalyticsSeries(30),
        dbService.getPosts({ limit: 200, status: 'all' }),
        dbService.getDashboardWidgetLayout(),
        dbService.getSubscribers(),
        dbService.getComments({ limit: 3 }),
        dbService.getPages(),
        dbService.getPluginStates(),
        dbService.getCurrentUser()
      ]);

      setAnalytics(analyticsData);
      setAnalyticsSeries(seriesData || []);
      setRecentPosts(postsData || []);
      setSubscribersCount((subs || []).length);
      setRecentComments(comments || []);
      setPagesCount((pages || []).length);
      setPluginStates(pStates || {});

      // Auto-detect logged-in user role
      if (currentUser?.role) {
        setActiveRoleView(currentUser.role);
      }

      // Calculate scheduled posts count
      setScheduledCount(analyticsData?.scheduledPosts || 0);

      if (savedConfig) {
        if (Array.isArray(savedConfig.order) && savedConfig.order.length > 0) {
          setWidgetOrder(savedConfig.order);
        }
        if (savedConfig.sizes) {
          setWidgetSizes(prev => ({ ...DEFAULT_SIZES, ...savedConfig.sizes }));
        }
        if (savedConfig.rowBreaks) {
          setWidgetRowBreaks(savedConfig.rowBreaks);
        }
      }
    } catch (e) {
      console.warn('Error loading dashboard overview:', e);
    } finally {
      setLoading(false);
    }
  }

  // Pointer Events for Draggable Floating Modal Window Header
  function handleModalPointerDown(e) {
    setIsDraggingModal(true);
    setDragOffset({
      x: e.clientX - modalPos.x,
      y: e.clientY - modalPos.y
    });
    e.target.setPointerCapture(e.pointerId);
  }

  function handleModalPointerMove(e) {
    if (!isDraggingModal) return;
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    const modalWidth = 360;
    const maxX = Math.max(10, window.innerWidth - modalWidth - 10);
    const maxY = Math.max(10, window.innerHeight - 80);

    const clampedX = Math.min(Math.max(10, newX), maxX);
    const clampedY = Math.min(Math.max(10, newY), maxY);

    setModalPos({ x: clampedX, y: clampedY });
  }

  function handleModalPointerUp(e) {
    setIsDraggingModal(false);
  }

  // Add Widget to Dashboard Canvas
  async function handleAddWidget(widgetId) {
    if (widgetOrder.includes(widgetId)) return;
    const newOrder = [...widgetOrder, widgetId];
    setWidgetOrder(newOrder);

    const targetWidget = ALL_AVAILABLE_WIDGETS.find(w => w.id === widgetId);
    const updatedSizes = { ...widgetSizes, [widgetId]: targetWidget?.defaultSize || '2x1' };
    setWidgetSizes(updatedSizes);

    await dbService.saveDashboardWidgetLayout({
      order: newOrder,
      columns: 10,
      sizes: updatedSizes,
      rowBreaks: widgetRowBreaks
    });

    showToast(`Widget "${WIDGET_NAMES[widgetId]}" berhasil ditambahkan ke dashboard!`);
  }

  // Remove Widget from Dashboard Canvas
  async function handleRemoveWidget(widgetId) {
    const newOrder = widgetOrder.filter(id => id !== widgetId);
    setWidgetOrder(newOrder);
    if (activeWidgetId === widgetId) {
      setActiveWidgetId(null);
    }

    await dbService.saveDashboardWidgetLayout({
      order: newOrder,
      columns: 10,
      sizes: widgetSizes,
      rowBreaks: widgetRowBreaks
    });

    showToast(`Widget "${WIDGET_NAMES[widgetId]}" dihapus dari dashboard.`);
  }

  // Target Position Swap Handler
  async function handleTargetSwap(sourceId, targetId) {
    if (!sourceId || !targetId || sourceId === targetId) {
      setIsSelectingSwapTarget(false);
      return;
    }

    const currentOrder = [...widgetOrder];
    const fromIndex = currentOrder.indexOf(sourceId);
    const toIndex = currentOrder.indexOf(targetId);

    if (fromIndex !== -1 && toIndex !== -1) {
      currentOrder.splice(fromIndex, 1);
      currentOrder.splice(toIndex, 0, sourceId);
      setWidgetOrder(currentOrder);

      await dbService.saveDashboardWidgetLayout({
        order: currentOrder,
        columns: 10,
        sizes: widgetSizes,
        rowBreaks: widgetRowBreaks
      });

      showToast(`Widget "${WIDGET_NAMES[sourceId]}" dipindahkan ke lokasi target!`);
    }

    setIsSelectingSwapTarget(false);
  }

  // 1-Click Move Handler
  async function moveWidget(id, direction) {
    const currentOrder = [...widgetOrder];
    const index = currentOrder.indexOf(id);
    if (index === -1) return;

    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    setWidgetOrder(currentOrder);
    await dbService.saveDashboardWidgetLayout({
      order: currentOrder,
      columns: 10,
      sizes: widgetSizes,
      rowBreaks: widgetRowBreaks
    });
    showToast('Posisi widget berhasil dipindahkan!');
  }

  // Toggle Row Break (Force New Row Line Break via col-start-1)
  async function handleToggleRowBreak(id) {
    const updatedBreaks = { ...widgetRowBreaks, [id]: !widgetRowBreaks[id] };
    setWidgetRowBreaks(updatedBreaks);
    await dbService.saveDashboardWidgetLayout({
      order: widgetOrder,
      columns: 10,
      sizes: widgetSizes,
      rowBreaks: updatedBreaks
    });

    if (updatedBreaks[id]) {
      showToast(`Widget "${WIDGET_NAMES[id]}" dipaksa mulai di Baris Baru (Bawah)!`);
    } else {
      showToast(`Widget "${WIDGET_NAMES[id]}" dikembalikan ke alur grid otomatis.`);
    }
  }

  // Move specifically directly after stat_categories to fill empty slot
  async function moveUnderCategories(id) {
    const catIndex = widgetOrder.indexOf('stat_categories');
    if (catIndex === -1) return;

    const currentOrder = widgetOrder.filter(item => item !== id);
    currentOrder.splice(catIndex + 1, 0, id);
    setWidgetOrder(currentOrder);

    const updatedSizes = { ...widgetSizes, [id]: '2x1' };
    setWidgetSizes(updatedSizes);

    await dbService.saveDashboardWidgetLayout({
      order: currentOrder,
      columns: 10,
      sizes: updatedSizes,
      rowBreaks: widgetRowBreaks
    });

    showToast(`Widget "${WIDGET_NAMES[id]}" disisipkan di bawah Kategori Topik (2x1)!`);
  }

  // Native HTML5 Drag and Drop Handlers
  function handleDragStart(e, id) {
    if (!isEditMode) return;
    setDraggingId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }

  function handleDragOver(e, id) {
    if (!isEditMode) return;
    e.preventDefault();
    if (dragOverId !== id) {
      setDragOverId(id);
    }
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverId(null);
  }

  async function handleDrop(e, targetId) {
    if (!isEditMode) return;
    e.preventDefault();
    setDragOverId(null);
    const sourceId = e.dataTransfer.getData('text/plain') || draggingId;
    if (!sourceId || sourceId === targetId) {
      setDraggingId(null);
      return;
    }

    await handleTargetSwap(sourceId, targetId);
    setDraggingId(null);
  }

  async function handleResizeWidget(id, newSize) {
    const updatedSizes = { ...widgetSizes, [id]: newSize };
    setWidgetSizes(updatedSizes);
    await dbService.saveDashboardWidgetLayout({
      order: widgetOrder,
      columns: 10,
      sizes: updatedSizes,
      rowBreaks: widgetRowBreaks
    });
    showToast(`Ukuran widget diubah ke matriks [ ${newSize.toUpperCase()} ]!`);
  }

  async function handleResetLayout() {
    setWidgetOrder(DEFAULT_ORDER);
    setWidgetSizes(DEFAULT_SIZES);
    setWidgetRowBreaks({});
    setActiveWidgetId(null);
    setIsSelectingSwapTarget(false);
    await dbService.saveDashboardWidgetLayout({
      order: DEFAULT_ORDER,
      columns: 10,
      sizes: DEFAULT_SIZES,
      rowBreaks: {}
    });
    showToast('Tata letak 10-Kolom Matriks dikembalikan ke posisi default!');
  }

  async function handleSaveAndExitEdit() {
    await dbService.saveDashboardWidgetLayout({
      order: widgetOrder,
      columns: 10,
      sizes: widgetSizes,
      rowBreaks: widgetRowBreaks
    });
    setIsEditMode(false);
    setActiveWidgetId(null);
    setIsSelectingSwapTarget(false);
    showToast('Tata letak dashboard berhasil disimpan!');
  }

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }

  // Role-Based Canvas Widget Filtering
  const visibleCanvasWidgets = widgetOrder.filter(id => {
    const widget = ALL_AVAILABLE_WIDGETS.find(w => w.id === id);
    if (!widget) return false;
    return !widget.allowedRoles || widget.allowedRoles.includes(activeRoleView);
  });

  // Role-Based Catalog Widget Filtering by Selected Tab
  const filteredCatalogWidgets = ALL_AVAILABLE_WIDGETS.filter(widget => {
    const isRoleAllowed = !widget.allowedRoles || widget.allowedRoles.includes(activeRoleView);
    if (!isRoleAllowed) return false;
    if (catalogTab === 'Semua') return true;
    return widget.category === catalogTab;
  });

  // 10-Column Grid Span & Row Start Calculator
  const getWidgetSpanClass = (id) => {
    const size = widgetSizes[id] || '2x1';
    const isNewRow = widgetRowBreaks[id] || false;
    const startClass = isNewRow ? 'col-start-1' : '';

    switch (size) {
      case '2x1':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-2 row-span-1`;
      case '2x2':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-2 row-span-2`;
      case '2x3':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-2 row-span-3`;
      case '3x1':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-3 row-span-1`;
      case '3x2':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-3 row-span-2`;
      case '3x3':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-3 row-span-3`;
      case '4x1':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-4 row-span-1`;
      case '4x2':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-4 row-span-2`;
      case '4x3':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-4 row-span-3`;
      case '5x1':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-5 row-span-1`;
      case '5x2':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-5 row-span-2`;
      case '5x3':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-5 row-span-3`;
      case '6x1':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-6 row-span-1`;
      case '6x2':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-6 row-span-2`;
      case '6x3':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-6 row-span-3`;
      case '7x1':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-7 row-span-1`;
      case '7x2':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-7 row-span-2`;
      case '7x3':
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-7 row-span-3`;
      case '10x1':
        return `${startClass} col-span-full row-span-1`;
      case '10x2':
        return `${startClass} col-span-full row-span-2`;
      default:
        return `${startClass} col-span-1 md:col-span-5 lg:col-span-2 row-span-1`;
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[var(--text-subtle)]">
        Memuat data statistik dashboard...
      </div>
    );
  }

  // Render Individual Separate Widget Content
  const renderWidgetContent = (id) => {
    switch (id) {
      case 'welcome':
        return <WelcomeWidget />;

      case 'stat_posts':
        return (
          <StatsCard
            title={t('widgetTotalPosts')}
            value={analytics?.totalPosts || 0}
            subtitle={`${analytics?.publishedPosts || 0} ${t('published')} • ${analytics?.draftPosts || 0} ${t('draft')}`}
            icon={FileText}
            color="blue"
          />
        );

      case 'stat_views':
        return (
          <StatsCard
            title={t('widgetTotalViews')}
            value={analytics?.totalViews || 0}
            subtitle={t('widgetSubViews')}
            icon={Eye}
            color="emerald"
          />
        );

      case 'stat_comments':
        return (
          <StatsCard
            title={t('widgetComments')}
            value={analytics?.totalComments || 0}
            subtitle={t('widgetSubComments')}
            icon={MessageSquare}
            color="purple"
          />
        );

      case 'stat_categories':
        return (
          <StatsCard
            title={t('widgetCategories')}
            value={analytics?.totalCategories || 0}
            subtitle={t('widgetSubCategories')}
            icon={FolderTree}
            color="amber"
          />
        );

      case 'stat_subscribers':
        const isNewsActive = pluginStates['newsletter'] !== false;
        return (
          <StatsCard
            title={t('widgetSubscribers')}
            value={isNewsActive ? subscribersCount : t('inactive')}
            subtitle={isNewsActive ? t('widgetSubSubscribers') : t('inactive')}
            icon={Mail}
            color={isNewsActive ? 'emerald' : 'amber'}
          />
        );

      case 'stat_whatsapp':
        const isWaActive = pluginStates['whatsapp-float'] !== false;
        return (
          <StatsCard
            title={t('widgetWaSupport')}
            value={isWaActive ? t('active') : t('inactive')}
            subtitle={isWaActive ? t('widgetSubWaSupport') : t('inactive')}
            icon={PhoneCall}
            color={isWaActive ? 'emerald' : 'amber'}
          />
        );

      case 'stat_users':
        return (
          <StatsCard
            title={t('widgetUsersRole')}
            value="1 User"
            subtitle={t('widgetSubUsers')}
            icon={Users}
            color="purple"
          />
        );

      case 'stat_theme':
        return (
          <StatsCard
            title={t('widgetActiveTheme')}
            value="Editorial"
            subtitle="By ScholarCMS Team"
            icon={Palette}
            color="indigo"
          />
        );

      case 'stat_plugins':
        return (
          <StatsCard
            title={t('widgetActivePlugins')}
            value="3 Plugins"
            subtitle="SEO, Newsletter, WhatsApp"
            icon={Puzzle}
            color="amber"
          />
        );

      case 'stat_pages':
        return (
          <StatsCard
            title={t('widgetPages')}
            value={pagesCount}
            subtitle={t('widgetSubPages')}
            icon={Layers}
            color="rose"
          />
        );

      case 'stat_scheduled':
        return (
          <StatsCard
            title={t('widgetScheduled')}
            value={scheduledCount}
            subtitle={t('widgetSubScheduled')}
            icon={Clock}
            color="blue"
          />
        );

      // CLASSIC FULL PIE CHART (TRAFFIC SOURCES)
      case 'chart_traffic_source_pie':
        return <TrafficSourcePieWidget analyticsSeries={analyticsSeries} />;

      // HORIZONTAL BAR CHART (TOP READ POSTS)
      case 'chart_top_posts_hbar': {
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

      // DUAL LINE COMPARISON CHART
      case 'chart_dual_line_comparison': {
        const trendData = [...analyticsSeries].slice(-7);
        const maxViews = Math.max(...trendData.map(d => d.views || 0), 1);
        
        const articlesPerDay = trendData.map(day => {
          return recentPosts.filter(p => {
            if (p.status !== 'published') return false;
            const dateToUse = p.publishedAt || p.createdAt;
            if (!dateToUse) return false;
            const postDate = new Date(dateToUse.seconds ? dateToUse.seconds * 1000 : dateToUse).toISOString().split('T')[0];
            return postDate === day.date;
          }).length;
        });
        
        const maxArticles = Math.max(...articlesPerDay, 1);
        
        const getPath = (data, max) => {
          if (data.length === 0) return '';
          return data.map((val, i) => {
            const x = (i / (data.length - 1)) * 300;
            const y = 80 - ((val / max) * 70) - 5; 
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
          }).join(' ');
        };

        const pathViews = getPath(trendData.map(d => d.views || 0), maxViews);
        const pathArticles = getPath(articlesPerDay, maxArticles);

        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-emerald-500" /> {t('widgetHeaderArticleComparison')}
                </h3>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"/> {t('widgetContentReaders')}</span>
                  <span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"/> {t('widgetContentArticles')}</span>
                </div>
              </div>

              <div className="relative h-28 w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <path d={pathViews} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={pathArticles} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">{t('widgetContentComparisonDesc')}</p>
          </div>
        );
      }

      // STACKED BAR CHART
      case 'chart_post_status_stacked': {
        const today = new Date();
        const months = [];
        for (let i = 2; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          months.push({
            m: d.toLocaleString(language === 'en' ? 'en-US' : 'id-ID', { month: 'short' }),
            year: d.getFullYear(),
            month: d.getMonth(),
            pub: 0,
            draft: 0,
            sched: 0
          });
        }

        recentPosts.forEach(p => {
          const d = new Date(p.createdAt?.seconds ? p.createdAt.seconds * 1000 : p.createdAt || Date.now());
          const y = d.getFullYear();
          const m = d.getMonth();
          const targetMonth = months.find(col => col.year === y && col.month === m);
          if (targetMonth) {
            if (p.status === 'published') targetMonth.pub++;
            else if (p.status === 'draft') targetMonth.draft++;
            else if (p.status === 'scheduled') targetMonth.sched++;
          }
        });

        const colData = months.map(col => {
          const total = col.pub + col.draft + col.sched;
          if (total === 0) return { ...col, pubPct: 0, draftPct: 0, schedPct: 0, total: 0 };
          return {
            ...col,
            pubPct: Math.round((col.pub / total) * 100),
            draftPct: Math.round((col.draft / total) * 100),
            schedPct: Math.round((col.sched / total) * 100),
            total
          };
        });

        const grandTotal = colData.reduce((acc, c) => acc + c.total, 0);
        const overallPub = grandTotal ? Math.round((colData.reduce((acc, c) => acc + c.pub, 0) / grandTotal) * 100) : 0;
        const overallDraft = grandTotal ? Math.round((colData.reduce((acc, c) => acc + c.draft, 0) / grandTotal) * 100) : 0;
        const overallSched = grandTotal ? Math.round((colData.reduce((acc, c) => acc + c.sched, 0) / grandTotal) * 100) : 0;

        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" /> {t('widgetHeaderPostStatus')}
                </h3>
                <span className="text-[10px] font-bold text-[var(--text-subtle)]">{t('widgetContentLast3Months')}</span>
              </div>

              <div className="pt-2 flex items-end justify-between gap-3 h-28 border-b border-[var(--border-color)] pb-2">
                {colData.map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col-reverse rounded-t-lg overflow-hidden h-24 bg-[var(--bg-primary)]">
                      <div className="w-full bg-emerald-500 transition-all" style={{ height: `${col.pubPct}%` }} title={`${t('filterPublished')}: ${col.pub} (${col.pubPct}%)`} />
                      <div className="w-full bg-blue-500 transition-all" style={{ height: `${col.draftPct}%` }} title={`${t('filterDraft')}: ${col.draft} (${col.draftPct}%)`} />
                      <div className="w-full bg-amber-500 transition-all" style={{ height: `${col.schedPct}%` }} title={`${t('filterScheduled')}: ${col.sched} (${col.schedPct}%)`} />
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-subtle)]">{col.m}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[var(--text-subtle)] font-bold">
              <span className="text-emerald-400">🟢 {t('filterPublished')} ({overallPub}%)</span>
              <span className="text-blue-400">🔵 {t('filterDraft')} ({overallDraft}%)</span>
              <span className="text-amber-400">🟡 {t('filterScheduled')} ({overallSched}%)</span>
            </div>
          </div>
        );
      }

      // SPEEDOMETER GAUGE CHART
      case 'chart_speedometer_gauge': {
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

      // BAR CHART (7-DAY TRAFFIC TREND)
      case 'chart_views_trend': {
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

      // SMOOTH AREA CURVE CHART (30-DAY VISITORS AREA CHART)
      case 'chart_visitors_area': {
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

      // DONUT RING CHART (SEO KEYWORDS RANKING)
      case 'chart_seo_keywords_donut': {
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

      // RADAR CHART (SYSTEM ARCHITECTURE HEALTH)
      case 'chart_system_radar': {
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

      // SPARKLINES MATRIX GRID
      case 'chart_sparklines_grid': {
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

      // HOURLY HEATMAP MATRIX CHART
      case 'chart_hourly_heatmap': {
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

      case 'chart_category_distribution': {
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

      case 'table_comments_moderation': {
        const pendingComments = recentComments.filter(c => c.status === 'pending').slice(0, 3);

        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Table className="w-5 h-5 text-purple-500" /> {t('widgetHeaderCommentsModeration')}
                </h3>
                <Link href="/dashboard/comments" className="text-xs text-blue-500 hover:underline font-bold">
                  {t('widgetContentManageAll')}
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                      <th className="pb-2">{t('thSender')}</th>
                      <th className="pb-2">{t('thComment')}</th>
                      <th className="pb-2 text-right">{t('thQuickAction')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {pendingComments.length > 0 ? (
                      pendingComments.map((row) => (
                        <tr key={row.id} className="group">
                          <td className="py-2.5 font-bold text-[var(--text-main)] truncate max-w-[100px]">{row.authorName || 'Anonim'}</td>
                          <td className="py-2.5 text-[var(--text-muted)] truncate max-w-[160px]">{row.content}</td>
                          <td className="py-2.5 text-right space-x-1">
                            <button
                              onClick={() => showToast(t('widgetContentApproveCommentHint'))}
                              className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                              title="Setujui Komentar"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => showToast(t('widgetContentApproveCommentHint'))}
                              className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                              title="Tolak Komentar"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-4 text-center text-xs text-[var(--text-muted)] italic">
                          {t('widgetContentNoPendingComments')}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">{t('widgetContentShowingPendingComments').replace('{count}', pendingComments.length)}</p>
          </div>
        );
      }

      case 'table_seo_articles': {
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

        const seoPosts = [...recentPosts].filter(p => p.status === 'published').map(p => ({
          title: p.title,
          score: getSeoScore(p),
        })).sort((a, b) => b.score - a.score);

        const avgScore = seoPosts.length ? Math.round(seoPosts.reduce((acc, p) => acc + p.score, 0) / seoPosts.length) : 0;
        const top3Seo = seoPosts.slice(0, 3);
        const getBadge = (score) => {
          if (score >= 80) return { badge: t('widgetContentSeoPerfect'), color: 'bg-emerald-500' };
          if (score >= 50) return { badge: t('widgetContentSeoGood'), color: 'bg-blue-500' };
          return { badge: t('widgetContentSeoNeedsCheck'), color: 'bg-amber-500' };
        };

        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Table className="w-5 h-5 text-emerald-500" /> {t('widgetHeaderSeoArticles')}
                </h3>
                <Link href="/dashboard/seo-analyzer" className="text-xs text-blue-500 hover:underline font-bold">
                  {t('widgetContentOpenSeoAudit')}
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                      <th className="pb-2">{t('thTitle')}</th>
                      <th className="pb-2">SEO</th>
                      <th className="pb-2 text-right">{t('thStatus')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {top3Seo.map((row, idx) => {
                      const { badge, color } = getBadge(row.score);
                      return (
                        <tr key={idx}>
                          <td className="py-2 font-bold text-[var(--text-main)] truncate max-w-[140px]">{row.title}</td>
                          <td className="py-2 font-black text-[var(--text-main)]">{row.score}/100</td>
                          <td className="py-2 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold text-white ${color}`}>
                              {badge}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">{t('widgetContentAvgSeoScore')} {avgScore}/100.</p>
          </div>
        );
      }

      case 'article_management':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" /> {t('widgetHeaderArticleMgmt')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t('widgetContentManageArticlesDesc')}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard/posts"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
              >
                {t('widgetContentViewPostsBtn')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard/posts/new"
                className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold text-xs hover:bg-[var(--bg-surface)] transition-all"
              >
                {t('widgetContentNewPostBtn')}
              </Link>
            </div>
          </div>
        );

      case 'seo_summary':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-500" /> {t('widgetHeaderSeoAudit')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t('widgetContentSeoAuditDesc')}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard/seo-analyzer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
              >
                {t('widgetContentOpenSeoAudit')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );

      case 'recent_activity':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" /> {t('widgetHeaderRecentActivity')}
                </h3>
                <Link href="/dashboard/posts" className="text-xs text-blue-500 hover:underline font-bold">
                  {t('all')}
                </Link>
              </div>
              <div className="space-y-2">
                {recentPosts.length > 0 ? (
                  recentPosts.slice(0, 3).map((p) => (
                    <div key={p.id} className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-[var(--text-main)] truncate">{p.title}</h4>
                        <p className="text-[10px] text-[var(--text-subtle)] truncate">{p.category} • {p.status}</p>
                      </div>
                      <Link href={`/dashboard/posts/edit/${p.id}`} className="p-1.5 rounded-lg bg-[var(--bg-surface)] hover:text-blue-500 text-[var(--text-muted)]">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-[var(--text-muted)]">Belum ada artikel.</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'recent_comments':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-500" /> {t('widgetHeaderRecentComments')}
                </h3>
                <Link href="/dashboard/comments" className="text-xs text-blue-500 hover:underline font-bold">
                  {t('widgetContentModerationPrompt')}
                </Link>
              </div>
              <div className="space-y-2">
                {recentComments.length > 0 ? (
                  recentComments.slice(0, 3).map((c) => (
                    <div key={c.id} className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--text-main)]">{c.authorName || c.name || t('widgetContentAnonymous')}</span>
                        <span className="text-[9px] text-[var(--text-subtle)]">{t('widgetContentNewBadge')}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{c.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-[var(--text-muted)]">{t('widgetContentNoRecentComments')}</div>
                )}
              </div>
            </div>
          </div>
        );

      case 'system_status':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-500" /> {t('widgetHeaderSystemStatus')}
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                {t('widgetContentSystemStatusDesc')}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard/settings"
                className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold text-xs hover:bg-[var(--bg-surface)] transition-all flex items-center gap-1.5"
              >
                {t('widgetContentCheckSettings')} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Toast Notification Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> {toastMsg}
        </div>
      )}

      {/* HEADER ACTION: FLOATING TOP-RIGHT CUSTOMIZE BUTTON (CLEAN VIEWING MODE) */}
      {!isEditMode ? (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setIsEditMode(true)}
            className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 border border-blue-400/30 backdrop-blur-md"
            title={t('customizeLayout')}
          >
            <Edit3 className="w-3.5 h-3.5" /> {t('customizeLayout')}
          </button>
        </div>
      ) : (
        /* EDIT MODE CONTROLS BAR WITH ROLE SWITCHER PREVIEW */
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-3xl bg-blue-600/10 border-2 border-blue-500 shadow-md">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-sm">
              <Edit3 className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-main)]">{t('canvasModeActive')}</h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                {t('canvasModeHint1')} <strong className="text-[var(--text-main)] font-black">➕ {t('canvasModeHint2')}</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* ROLE ACCESS PREVIEW SELECTOR */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-primary)] px-3 py-2 rounded-2xl border border-[var(--border-color)] shadow-xs">
              <Users className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[10px] font-bold text-[var(--text-subtle)]">{t('roleViewLabel')}</span>
              <select
                value={activeRoleView}
                onChange={(e) => {
                  setActiveRoleView(e.target.value);
                  showToast(`Pratinjau canvas disesuaikan untuk Role [ ${e.target.value.toUpperCase()} ]!`);
                }}
                className="bg-transparent text-xs font-black text-[var(--text-main)] focus:outline-none cursor-pointer"
              >
                <option value="admin">{t('roleAdminOption')}</option>
                <option value="writer">{t('roleWriterOption')}</option>
                <option value="user">{t('roleUserOption')}</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              title={t('openWidgetCatalogTitle')}
            >
              <Plus className="w-4 h-4" /> {t('addNewWidgetBtn')}
            </button>

            <button
              onClick={handleResetLayout}
              className="px-3.5 py-2 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title={t('resetLayoutDefaultTitle')}
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" /> {t('resetDefaultBtn')}
            </button>

            <button
              onClick={handleSaveAndExitEdit}
              className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> {t('saveExitEditingBtn')}
            </button>
          </div>
        </div>
      )}

      {/* DYNAMIC 10-COLUMN GRID MATRIX CANVAS (FILTERED BY ROLE) */}
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-10 gap-6 [grid-auto-flow:dense]">
        {visibleCanvasWidgets.map((id) => {
          const isDragging = draggingId === id;
          const isDragOver = dragOverId === id;
          const isActiveSelected = activeWidgetId === id;
          const spanClass = getWidgetSpanClass(id);
          const isNewRow = widgetRowBreaks[id];

          return (
            <div
              key={id}
              draggable={isEditMode}
              onDragStart={(e) => handleDragStart(e, id)}
              onDragOver={(e) => handleDragOver(e, id)}
              onDragEnter={(e) => handleDragOver(e, id)}
              onDragEnd={handleDragEnd}
              onDrop={(e) => handleDrop(e, id)}
              onClick={() => {
                if (isEditMode) {
                  if (isSelectingSwapTarget && activeWidgetId && activeWidgetId !== id) {
                    handleTargetSwap(activeWidgetId, id);
                  } else {
                    setActiveWidgetId(id);
                  }
                }
              }}
              className={`relative group rounded-3xl transition-all duration-200 ${spanClass} ${
                isEditMode ? 'cursor-pointer hover:ring-2 hover:ring-blue-400' : ''
              } ${
                isActiveSelected ? 'ring-4 ring-blue-500 shadow-2xl scale-[1.01] z-30' : ''
              } ${
                isDragging ? 'opacity-40 scale-[0.98] border-2 border-dashed border-blue-500' : ''
              } ${
                isDragOver ? 'ring-4 ring-blue-500/30 border-blue-500 scale-[1.01]' : ''
              }`}
            >
              {/* Subtle Edit Badge in Edit Mode */}
              {isEditMode && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-blue-600/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md opacity-80 group-hover:opacity-100 transition-opacity">
                  <Sliders className="w-3 h-3" />
                  <span>{isActiveSelected ? 'Aktif' : 'Edit'}</span>
                  {isNewRow && <span className="bg-emerald-500 text-white px-1.5 py-0.2 rounded-full text-[9px] font-black">↵ Baris Baru</span>}
                </div>
              )}

              {/* Target Swap Confirmation Banner Overlay */}
              {isEditMode && isSelectingSwapTarget && activeWidgetId !== id && (
                <div className="absolute inset-0 z-40 bg-blue-900/60 backdrop-blur-xs rounded-3xl flex items-center justify-center p-4 border-2 border-dashed border-white">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTargetSwap(activeWidgetId, id);
                    }}
                    className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-2xl flex items-center gap-1.5 animate-bounce"
                  >
                    <Check className="w-4 h-4" /> Pindahkan Ke Sini
                  </button>
                </div>
              )}

              {renderWidgetContent(id)}
            </div>
          );
        })}
      </div>

      {/* DRAGGABLE FLOATING MODAL WINDOW (BODY PORTAL HUD PANEL) */}
      {mounted && isEditMode && activeWidgetId && createPortal(
        <div
          style={{
            position: 'fixed',
            left: `${modalPos.x}px`,
            top: `${modalPos.y}px`,
            zIndex: 9999
          }}
          className="w-80 sm:w-96 bg-[var(--bg-surface)] border-2 border-blue-500/60 shadow-2xl rounded-3xl p-5 flex flex-col space-y-4 max-h-[85vh] animate-fade-in backdrop-blur-xl"
        >
          {/* DRAGGABLE MODAL HEADER */}
          <div
            onPointerDown={handleModalPointerDown}
            onPointerMove={handleModalPointerMove}
            onPointerUp={handleModalPointerUp}
            className="flex items-center justify-between pb-3 border-b border-[var(--border-color)] cursor-grab active:cursor-grabbing select-none bg-blue-600/10 p-2.5 rounded-2xl border border-blue-500/20"
            title="Tarik & Geser header ini untuk memindahkan lokasi jendela pengontrol di layar"
          >
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-blue-600 text-white shadow-sm">
                <GripVertical className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black text-[var(--text-main)] truncate max-w-[180px]">
                  {WIDGET_NAMES[activeWidgetId]}
                </h3>
                <p className="text-[9px] font-bold text-blue-400">⋮⋮ Tarik Panel Ini Ke Mana Saja</p>
              </div>
            </div>

            <button
              onClick={() => setActiveWidgetId(null)}
              className="p-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-gray-700 text-[var(--text-muted)] hover:text-white transition-all"
              title="Tutup Panel Pengontrol"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto pr-1">
            
            {/* SECTION 1: MATRIKS DIMENSI KOTAK */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-[var(--text-main)] flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-blue-500" /> Ukuran Dimensi Matriks
              </label>

              <select
                value={widgetSizes[activeWidgetId] || '2x1'}
                onChange={(e) => handleResizeWidget(activeWidgetId, e.target.value)}
                className="w-full px-3 py-2 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs font-bold text-[var(--text-main)] focus:outline-none cursor-pointer"
              >
                <option value="2x1">▫️ 2×1 Kotak (Kartu Stat Kecil - 20% Lebar)</option>
                <option value="2x2">▫️ 2×2 Kotak (20% Lebar 2 Baris)</option>
                <option value="2x3">▫️ 2×3 Kotak (20% Lebar 3 Baris)</option>
                <option value="3x1">◽ 3×1 Kotak (30% Lebar)</option>
                <option value="3x2">◽ 3×2 Kotak (30% Lebar 2 Baris)</option>
                <option value="3x3">◽ 3×3 Kotak (30% Lebar 3 Baris)</option>
                <option value="4x1">◽ 4×1 Kotak (40% Lebar)</option>
                <option value="4x2">◻️ 4×2 Kotak (40% Lebar 2 Baris)</option>
                <option value="4x3">⬜ 4×3 Kotak (40% Lebar 3 Baris)</option>
                <option value="5x1">◽ 5×1 Kotak (Setengah Layar - 50% Lebar)</option>
                <option value="5x2">◻️ 5×2 Kotak (Setengah Layar 2 Baris)</option>
                <option value="5x3">⬜ 5×3 Kotak (Besar 3 Baris)</option>
                <option value="6x1">◽ 6×1 Kotak (60% Lebar)</option>
                <option value="6x2">◻️ 6×2 Kotak (60% Lebar 2 Baris)</option>
                <option value="6x3">⬜ 6×3 Kotak (60% Lebar 3 Baris)</option>
                <option value="7x1">◽ 7×1 Kotak (70% Lebar)</option>
                <option value="7x2">◻️ 7×2 Kotak (70% Lebar 2 Baris)</option>
                <option value="7x3">⬜ 7×3 Kotak (70% Lebar 3 Baris)</option>
                <option value="10x1">↔️ 10×1 Kotak (Layar Penuh - 100% Lebar)</option>
                <option value="10x2">↔️ 10×2 Kotak (Layar Penuh 2 Baris)</option>
              </select>
            </div>

            {/* SECTION 2: ALUR BARIS BARU (NEW ROW LINE BREAK) */}
            <div className="space-y-1.5 pt-2 border-t border-[var(--border-color)]">
              <label className="text-xs font-extrabold text-[var(--text-main)] flex items-center gap-1.5">
                <CornerDownRight className="w-4 h-4 text-emerald-500" /> Alur Posisi Baris (Row Break)
              </label>
              <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                Paksa widget ini untuk langsung mulai di <strong>Baris Baru (Ke Bawah)</strong>.
              </p>

              <button
                type="button"
                onClick={() => handleToggleRowBreak(activeWidgetId)}
                className={`w-full py-2 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 border shadow-sm ${
                  widgetRowBreaks[activeWidgetId]
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg'
                    : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--bg-surface)]'
                }`}
              >
                <CornerDownRight className="w-4 h-4" />
                {widgetRowBreaks[activeWidgetId]
                  ? '↵ Aktif: Mulai Di Baris Baru (Ke Bawah)'
                  : 'Ikuti Alur Kanan (Auto-Flow)'}
              </button>
            </div>

            {/* SECTION 3: POSISI DAN GOLONGAN */}
            <div className="space-y-2 pt-2 border-t border-[var(--border-color)]">
              <label className="text-xs font-extrabold text-[var(--text-main)] flex items-center gap-1.5">
                <Move className="w-4 h-4 text-purple-500" /> Pindahkan Posisi Widget
              </label>

              {/* 1-Click Move Arrows */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => moveWidget(activeWidgetId, 'left')}
                  disabled={widgetOrder.indexOf(activeWidgetId) === 0}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-blue-600 hover:text-white border border-[var(--border-color)] text-xs font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Geser Kiri / Atas
                </button>
                <button
                  type="button"
                  onClick={() => moveWidget(activeWidgetId, 'right')}
                  disabled={widgetOrder.indexOf(activeWidgetId) === widgetOrder.length - 1}
                  className="px-3 py-2 rounded-xl bg-[var(--bg-primary)] hover:bg-blue-600 hover:text-white border border-[var(--border-color)] text-xs font-bold transition-all disabled:opacity-30 flex items-center justify-center gap-1.5"
                >
                  Geser Kanan / Bawah <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Target Swap Mode */}
              <button
                type="button"
                onClick={() => setIsSelectingSwapTarget(true)}
                className={`w-full py-2 rounded-2xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
                  isSelectingSwapTarget
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <MousePointerClick className="w-4 h-4" />
                {isSelectingSwapTarget ? 'Pilih Slot di Canvas...' : 'Pindahkan Ke Target Slot'}
              </button>

              {/* QUICK FIT SHORTCUT: Move under stat_categories */}
              <button
                type="button"
                onClick={() => moveUnderCategories(activeWidgetId)}
                className="w-full py-2 rounded-2xl bg-[var(--bg-primary)] hover:bg-blue-600 hover:text-white border border-[var(--border-color)] text-[11px] font-bold transition-all flex items-center justify-center gap-1.5"
                title="Sisipkan widget ini persis di bawah kartu Kategori Topik (isi area kosong)"
              >
                <CornerDownRight className="w-3.5 h-3.5 text-blue-400" /> Sisipkan Di Bawah Kategori Topik (2×1)
              </button>
            </div>

            {/* SECTION 4: HAPUS WIDGET DARI CANVAS */}
            <div className="pt-2 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={() => handleRemoveWidget(activeWidgetId)}
                className="w-full py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Hapus Widget Ini Dari Canvas
              </button>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="pt-2 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={() => setActiveWidgetId(null)}
              className="w-full py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" /> Selesai Mengatur Widget Ini
            </button>
          </div>

        </div>,
        document.body
      )}

      {/* KATALOG TAMBAH WIDGET BARU MODAL WINDOW (WITH CATEGORY TABS & RBAC) */}
      {mounted && isAddModalOpen && createPortal(
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen min-h-screen z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between bg-blue-600/10">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-sm">
                  <Plus className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-main)]">{t('widgetCatalogHeader')}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{t('catalogModalDesc1')}<strong className="uppercase text-blue-400">{activeRoleView}</strong>{t('catalogModalDesc2')}</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-2xl bg-[var(--bg-primary)] hover:bg-gray-700 text-[var(--text-muted)] hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CATEGORY FILTER TABS BAR */}
            <div className="px-6 pt-4 pb-2 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/50 overflow-x-auto flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-[var(--text-subtle)] uppercase tracking-wider flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3 text-blue-500" /> {t('groupLabel')}
              </span>
              {CATALOG_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCatalogTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    catalogTab === tab
                      ? 'bg-blue-600 text-white shadow-sm font-black'
                      : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)]'
                  }`}
                >
                  {t(`cat_${tab.replace(/[^a-zA-Z]/g, '')}`) || tab}
                </button>
              ))}
            </div>

            {/* Modal Content Grid */}
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredCatalogWidgets.map((widget) => {
                  const isAdded = widgetOrder.includes(widget.id);
                  const isPluginDisabled = widget.pluginId && pluginStates[widget.pluginId] === false;

                  return (
                    <div
                      key={widget.id}
                      className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                        isAdded
                          ? 'bg-blue-500/5 border-blue-500/30'
                          : 'bg-[var(--bg-primary)] border-[var(--border-color)] hover:border-blue-500/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {t(`cat_${widget.category.replace(/[^a-zA-Z]/g, '')}`) || widget.category}
                            </span>
                            {isPluginDisabled && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                🔌 {t('widgetContentPluginDisabled')}
                              </span>
                            )}
                          </div>
                          {isAdded && (
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {t('installedBadge')}
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-[var(--text-main)]">{t(`widgetName_${widget.id}`) || widget.name}</h4>
                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{t(`widgetDesc_${widget.id}`) || widget.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-color)]/50 flex items-center justify-between">
                        <span className="text-[10px] text-[var(--text-subtle)] font-bold">{t('matrixLabel')}{widget.defaultSize}</span>
                        {isAdded ? (
                          <button
                            onClick={() => handleRemoveWidget(widget.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> {t('delete')}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddWidget(widget.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> {t('addBtn')}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-primary)] flex justify-end">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md transition-all"
              >
                {t('doneSelectingWidgetBtn')}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
