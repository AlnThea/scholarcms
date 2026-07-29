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

export default function DashboardOverview() {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState(null);
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
      const [analyticsData, postsData, savedConfig, subs, comments, pages, pStates, currentUser] = await Promise.all([
        dbService.getAnalytics(),
        dbService.getPosts({ limit: 5 }),
        dbService.getDashboardWidgetLayout(),
        dbService.getSubscribers(),
        dbService.getComments({ limit: 3 }),
        dbService.getPages(),
        dbService.getPluginStates(),
        dbService.getCurrentUser()
      ]);

      setAnalytics(analyticsData);
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
      const now = new Date();
      const sched = (postsData || []).filter(p => p.status === 'scheduled' || (p.publishedAt && new Date(p.publishedAt) > now));
      setScheduledCount(sched.length);

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
        return (
          <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl relative overflow-hidden flex flex-col justify-between gap-6 h-full group hover:shadow-2xl transition-all border border-white/20">
            {/* Background Glow Accent Overlay */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
            
            <div className="relative z-10 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white border border-white/30 backdrop-blur-md inline-flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> ScholarCMS Engine v2.0 • Executive Suite
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm">
                {t('welcomeTitle')}
              </h2>
              <p className="text-xs text-blue-100 max-w-2xl leading-relaxed font-medium">
                {t('welcomeDesc')}
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0 pt-2 border-t border-white/20">
              <Link
                href="/dashboard/posts/new"
                className="px-5 py-2.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-900 font-black text-xs transition-all shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-4 h-4 text-blue-600" /> {t('navAddNewPost')}
              </Link>
              <Link
                href="/dashboard/settings"
                className="px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-extrabold text-xs transition-all backdrop-blur-md flex items-center gap-2 shadow-md hover:scale-105 active:scale-95"
              >
                <Settings className="w-4 h-4 text-amber-300" /> {t('navGlobalSettings')}
              </Link>
            </div>
          </div>
        );

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
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-blue-500" /> Chart Pie Sumber Trafik Pembaca
                </h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400">
                  Google (45%)
                </span>
              </div>

              <div className="flex items-center gap-5 pt-1">
                {/* SVG Full Conical Pie Chart */}
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                    <circle r="16" cx="16" cy="16" fill="#3b82f6" strokeDasharray="45 100" strokeWidth="32" />
                    <circle r="16" cx="16" cy="16" fill="#10b981" strokeDasharray="30 100" strokeDashoffset="-45" strokeWidth="32" />
                    <circle r="16" cx="16" cy="16" fill="#8b5cf6" strokeDasharray="15 100" strokeDashoffset="-75" strokeWidth="32" />
                    <circle r="16" cx="16" cy="16" fill="#f59e0b" strokeDasharray="10 100" strokeDashoffset="-90" strokeWidth="32" />
                  </svg>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-[var(--text-main)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Google Search (45%)
                  </div>
                  <div className="flex items-center gap-2 font-bold text-[var(--text-main)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Sosmed & Share (30%)
                  </div>
                  <div className="flex items-center gap-2 font-bold text-[var(--text-main)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Direct (15%)
                  </div>
                  <div className="flex items-center gap-2 font-bold text-[var(--text-subtle)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Referral Email (10%)
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">Mesin pencari Google menyumbang trafik terbesar ke blog.</p>
          </div>
        );

      // HORIZONTAL BAR CHART (TOP READ POSTS)
      case 'chart_top_posts_hbar':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-indigo-500" /> Chart Batang Horisontal Artikel Terpopuler
              </h3>

              <div className="space-y-3 pt-1">
                {[
                  { title: 'Panduan SEO 2026', views: '640 views', pct: 90, color: 'bg-blue-600' },
                  { title: 'Membuat Next.js Blog', views: '420 views', pct: 65, color: 'bg-emerald-500' },
                  { title: 'Arsitektur CMS Modern', views: '280 views', pct: 40, color: 'bg-purple-500' }
                ].map((post, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[var(--text-main)]">
                      <span className="truncate max-w-[180px]">{post.title}</span>
                      <span className="text-[var(--text-subtle)]">{post.views}</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div className={`h-full ${post.color} rounded-full transition-all`} style={{ width: `${post.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">Artikel "Panduan SEO 2026" paling banyak dibaca bulan ini.</p>
          </div>
        );

      // DUAL LINE COMPARISON CHART
      case 'chart_dual_line_comparison':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-emerald-500" /> Chart Komparasi Artikel vs Pembaca
                </h3>
                <div className="flex items-center gap-3 text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Pembaca</span>
                  <span className="flex items-center gap-1 text-blue-400"><span className="w-2 h-2 rounded-full bg-blue-500"/> Artikel</span>
                </div>
              </div>

              <div className="relative h-28 w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <path d="M0 70 Q 75 20, 150 50 T 300 15" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                  <path d="M0 60 Q 75 40, 150 30 T 300 35" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">Pertumbuhan pembaca (garis hijau) sejalan dengan konsistensi publikasi artikel.</p>
          </div>
        );

      // STACKED BAR CHART
      case 'chart_post_status_stacked':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" /> Chart Stacked Status Artikel
                </h3>
                <span className="text-[10px] font-bold text-[var(--text-subtle)]">Terbit vs Draft vs Terjadwal</span>
              </div>

              <div className="pt-2 flex items-end justify-between gap-3 h-28 border-b border-[var(--border-color)] pb-2">
                {[
                  { m: 'Mei', pub: 60, draft: 25, sched: 15 },
                  { m: 'Jun', pub: 70, draft: 20, sched: 10 },
                  { m: 'Jul', pub: 80, draft: 15, sched: 5 }
                ].map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col-reverse rounded-t-lg overflow-hidden h-24 bg-[var(--bg-primary)]">
                      <div className="w-full bg-emerald-500" style={{ height: `${col.pub}%` }} title={`Terbit: ${col.pub}%`} />
                      <div className="w-full bg-blue-500" style={{ height: `${col.draft}%` }} title={`Draft: ${col.draft}%`} />
                      <div className="w-full bg-amber-500" style={{ height: `${col.sched}%` }} title={`Terjadwal: ${col.sched}%`} />
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-subtle)]">{col.m}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-[var(--text-subtle)] font-bold">
              <span className="text-emerald-400">🟢 Terbit (80%)</span>
              <span className="text-blue-400">🔵 Draft (15%)</span>
              <span className="text-amber-400">🟡 Terjadwal (5%)</span>
            </div>
          </div>
        );

      // SPEEDOMETER GAUGE CHART
      case 'chart_speedometer_gauge':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-amber-500" /> Chart Gauge Speedometer Performa
                </h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400">
                  Grade A+ Super Fast
                </span>
              </div>

              <div className="relative w-40 h-20 mx-auto flex items-end justify-center overflow-hidden pt-2">
                <svg className="w-40 h-40 transform rotate-180" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="var(--bg-primary)"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3.5"
                    strokeDasharray="48, 100"
                  />
                </svg>
                <div className="absolute bottom-1 text-center">
                  <span className="text-xl font-black text-[var(--text-main)]">98</span>
                  <span className="text-[9px] block text-[var(--text-subtle)] font-bold">Skor Muat / 100</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)] text-center">Kecepatan waktu muat halaman: 0.18 detik (Kilat).</p>
          </div>
        );

      // BAR CHART (7-DAY TRAFFIC TREND)
      case 'chart_views_trend':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-500" /> Chart Tren Pembaca (7 Hari)
                </h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400">
                  +24.5% Minggu Ini
                </span>
              </div>

              <div className="pt-2 flex items-end justify-between gap-2 h-28 border-b border-[var(--border-color)] pb-2">
                {[
                  { day: 'Sen', height: '40%' },
                  { day: 'Sel', height: '65%' },
                  { day: 'Rab', height: '50%' },
                  { day: 'Kam', height: '85%' },
                  { day: 'Jum', height: '70%' },
                  { day: 'Sab', height: '95%' },
                  { day: 'Min', height: '60%' }
                ].map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="w-full bg-blue-500/20 group-hover:bg-blue-600 rounded-t-lg transition-all relative overflow-hidden" style={{ height: item.height }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-indigo-500 opacity-80" />
                    </div>
                    <span className="text-[10px] font-bold text-[var(--text-subtle)]">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Puncak kunjungan tertinggi pada hari Sabtu.
            </p>
          </div>
        );

      // SMOOTH AREA CURVE CHART (30-DAY VISITORS AREA CHART)
      case 'chart_visitors_area':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" /> Area Chart Pengunjung Unik (30 Hari)
                </h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-400">
                  1,480 Total Unik
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
                    d="M0 60 Q 50 10, 100 45 T 200 25 T 300 50 L 300 80 L 0 80 Z"
                    fill="url(#areaGrad)"
                  />
                  <path
                    d="M0 60 Q 50 10, 100 45 T 200 25 T 300 50"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Kurva tren pembaca stabil naik selama 30 hari terakhir.
            </p>
          </div>
        );

      // DONUT RING CHART (SEO KEYWORDS RANKING)
      case 'chart_seo_keywords_donut':
        const isSeoActive = pluginStates['seo-analyzer'] !== false;
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-purple-500" /> Chart Donat Kata Kunci SEO
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
                      strokeDasharray="60, 100"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.8"
                      strokeDasharray="25, 100"
                      strokeDashoffset="-60"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xs font-black text-[var(--text-main)]">60%</span>
                    <p className="text-[8px] text-[var(--text-subtle)]">Hal 1</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Hal 1 Google (60%)
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[var(--text-main)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Hal 2 Google (25%)
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-[var(--text-muted)]">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-600" /> Perlu Optimasi (15%)
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">Rata-rata 12 kata kunci utama masuk peringkat Google.</p>
          </div>
        );

      // RADAR CHART (SYSTEM ARCHITECTURE HEALTH)
      case 'chart_system_radar':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-500" /> Chart Radar Kesehatan CMS
                </h3>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-400">
                  Skor 96/100
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {[
                  { label: 'Kecepatan Muat', score: 98, color: 'bg-emerald-500' },
                  { label: 'Keamanan Firestore', score: 95, color: 'bg-blue-500' },
                  { label: 'Kesehatan SEO', score: 90, color: 'bg-purple-500' },
                  { label: 'Responsivitas Layout', score: 100, color: 'bg-indigo-500' }
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[var(--text-main)]">
                      <span>{item.label}</span>
                      <span>{item.score}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">Evaluasi performa 6-dimensi sistem CMS berjalan optimal.</p>
          </div>
        );

      // SPARKLINES MATRIX GRID
      case 'chart_sparklines_grid':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Grid Sparkline Pertumbuhan Metrik
              </h3>

              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  { label: 'Artikel', val: '+12%', color: 'text-blue-500', trend: 'Meningkat' },
                  { label: 'Pembaca', val: '+28%', color: 'text-emerald-500', trend: 'Pesat' },
                  { label: 'Komentar', val: '+15%', color: 'text-purple-500', trend: 'Aktif' },
                  { label: 'Newsletter', val: '+34%', color: 'text-rose-500', trend: 'Tinggi' }
                ].map((s, idx) => (
                  <div key={idx} className="p-2.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-bold">
                      <span className="text-[var(--text-subtle)]">{s.label}</span>
                      <span className={`font-black ${s.color}`}>{s.val}</span>
                    </div>
                    <div className="h-4 w-full flex items-end gap-0.5">
                      <div className="w-1/4 h-2 bg-blue-500/40 rounded-t" />
                      <div className="w-1/4 h-3 bg-blue-500/60 rounded-t" />
                      <div className="w-1/4 h-2.5 bg-blue-500/80 rounded-t" />
                      <div className="w-1/4 h-4 bg-blue-600 rounded-t" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">Pertumbuhan metrik di seluruh sektor mengalami tren positif.</p>
          </div>
        );

      // HOURLY HEATMAP MATRIX CHART
      case 'chart_hourly_heatmap':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Grid className="w-5 h-5 text-rose-500" /> Chart Heatmap Jam Kunjungan Pembaca
                </h3>
                <span className="text-[10px] font-bold text-rose-400">Puncak: 20:00 - 22:00</span>
              </div>

              <div className="pt-2 space-y-1.5">
                {['Pagi (06-12)', 'Siang (12-18)', 'Malam (18-24)'].map((timeSlot, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="w-24 text-[10px] font-bold text-[var(--text-subtle)] truncate">{timeSlot}</span>
                    <div className="flex-1 grid grid-cols-6 gap-1.5">
                      {[20, 40, 60, 95, 75, 30].map((opacity, i) => (
                        <div
                          key={i}
                          className="h-5 rounded-md transition-all hover:scale-110"
                          style={{
                            backgroundColor: idx === 2 ? `#e11d48` : `#3b82f6`,
                            opacity: opacity / 100
                          }}
                          title={`Kepadatan Kunjungan: ${opacity}%`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">Waktu malam hari (18:00 - 24:00) merupakan jam paling ramai pembaca.</p>
          </div>
        );

      case 'chart_category_distribution':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <PieChart className="w-5 h-5 text-indigo-500" /> Chart Batang Kategori Topik
              </h3>
              
              <div className="space-y-3 pt-1">
                {[
                  { cat: 'Teknologi & Algoritma', count: '4 Artikel', pct: 60, color: 'bg-blue-600' },
                  { cat: 'Strategi SEO Modern', count: '2 Artikel', pct: 25, color: 'bg-emerald-500' },
                  { cat: 'Panduan CMS', count: '1 Artikel', pct: 15, color: 'bg-purple-500' }
                ].map((c, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[var(--text-main)]">
                      <span>{c.cat}</span>
                      <span className="text-[var(--text-subtle)]">{c.pct}% ({c.count})</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">Kategori "Teknologi" mendominasi 60% konten blog.</p>
          </div>
        );

      case 'table_comments_moderation':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Table className="w-5 h-5 text-purple-500" /> Tabel Moderasi Komentar Cepat
                </h3>
                <Link href="/dashboard/comments" className="text-xs text-blue-500 hover:underline font-bold">
                  Kelola Semua
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                      <th className="pb-2">Pengirim</th>
                      <th className="pb-2">Komentar</th>
                      <th className="pb-2 text-right">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {[
                      { id: 1, name: 'Ahmad Fauzi', comment: 'Artikel SEO ini sangat membantu sekali!', status: 'pending' },
                      { id: 2, name: 'Rina Wijaya', comment: 'Apakah CMS ini mendukung Firebase?', status: 'pending' }
                    ].map((row) => (
                      <tr key={row.id} className="group">
                        <td className="py-2.5 font-bold text-[var(--text-main)] truncate max-w-[100px]">{row.name}</td>
                        <td className="py-2.5 text-[var(--text-muted)] truncate max-w-[160px]">{row.comment}</td>
                        <td className="py-2.5 text-right space-x-1">
                          <button
                            onClick={() => showToast(`Komentar ${row.name} disetujui!`)}
                            className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all"
                            title="Setujui Komentar"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => showToast(`Komentar ${row.name} dihapus.`)}
                            className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
                            title="Tolak Komentar"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">2 Komentar menunggu moderasi publikasi.</p>
          </div>
        );

      case 'table_seo_articles':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Table className="w-5 h-5 text-emerald-500" /> Tabel Kesehatan SEO Artikel
                </h3>
                <Link href="/dashboard/seo-analyzer" className="text-xs text-blue-500 hover:underline font-bold">
                  Buka SEO Audit
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                      <th className="pb-2">Judul Artikel</th>
                      <th className="pb-2">Skor SEO</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {[
                      { title: 'Panduan SEO 2026', score: 100, badge: 'Perfect', color: 'bg-emerald-500' },
                      { title: 'Membuat Next.js Blog', score: 85, badge: 'Bagus', color: 'bg-blue-500' },
                      { title: 'Arsitektur CMS Modern', score: 70, badge: 'Perlu Cek', color: 'bg-amber-500' }
                    ].map((row, idx) => (
                      <tr key={idx}>
                        <td className="py-2 font-bold text-[var(--text-main)] truncate max-w-[140px]">{row.title}</td>
                        <td className="py-2 font-black text-[var(--text-main)]">{row.score}/100</td>
                        <td className="py-2 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold text-white ${row.color}`}>
                            {row.badge}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-[10px] text-[var(--text-subtle)]">Rata-rata Skor SEO seluruh artikel: 85/100.</p>
          </div>
        );

      case 'article_management':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" /> Manajemen Artikel & Editor
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Tulis artikel baru dengan Visual Block Editor atau kelola postingan yang sudah ada.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard/posts"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
              >
                Lihat Postingan <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/dashboard/posts/new"
                className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold text-xs hover:bg-[var(--bg-surface)] transition-all"
              >
                + Post Baru
              </Link>
            </div>
          </div>
        );

      case 'seo_summary':
        return (
          <div className="p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-500" /> Audit SEO Real-time
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Analisis skor SEO, kata kunci fokus, dan kesehatan tag meta di seluruh artikel Anda secara otomatis.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard/seo-analyzer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
              >
                Buka SEO Auditor <ArrowRight className="w-3.5 h-3.5" />
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
                  <Clock className="w-5 h-5 text-purple-500" /> Artikel Terbaru Dibuat
                </h3>
                <Link href="/dashboard/posts" className="text-xs text-blue-500 hover:underline font-bold">
                  Semua
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
                  <MessageSquare className="w-5 h-5 text-indigo-500" /> Komentar Terbaru Pembaca
                </h3>
                <Link href="/dashboard/comments" className="text-xs text-blue-500 hover:underline font-bold">
                  Moderasi
                </Link>
              </div>
              <div className="space-y-2">
                {recentComments.length > 0 ? (
                  recentComments.map((c) => (
                    <div key={c.id} className="p-3 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[var(--text-main)]">{c.author || c.name || 'Pengunjung'}</span>
                        <span className="text-[9px] text-[var(--text-subtle)]">Baru</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{c.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-xs text-[var(--text-muted)]">Belum ada komentar terbaru.</div>
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
                <Settings className="w-5 h-5 text-indigo-500" /> Status Database & Sistem CMS
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Periksa status integrasi database cloud Firebase Firestore atau perbarui konfigurasi `.env` proyek Anda.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard/settings"
                className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] font-semibold text-xs hover:bg-[var(--bg-surface)] transition-all flex items-center gap-1.5"
              >
                Cek Pengaturan <ArrowRight className="w-3.5 h-3.5" />
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
            title="Buka Mode Kustomisasi Tata Letak Dashboard"
          >
            <Edit3 className="w-3.5 h-3.5" /> Kustomisasi Tata Letak Dashboard
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
              <h2 className="text-sm font-bold text-[var(--text-main)]">Mode Kustomisasi Canvas Active</h2>
              <p className="text-[11px] text-[var(--text-muted)]">
                Klik widget untuk mengontrol dimensi/posisi, atau klik <strong className="text-[var(--text-main)] font-black">➕ Tambah Widget</strong>.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* ROLE ACCESS PREVIEW SELECTOR */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-primary)] px-3 py-2 rounded-2xl border border-[var(--border-color)] shadow-xs">
              <Users className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-[10px] font-bold text-[var(--text-subtle)]">Role View:</span>
              <select
                value={activeRoleView}
                onChange={(e) => {
                  setActiveRoleView(e.target.value);
                  showToast(`Pratinjau canvas disesuaikan untuk Role [ ${e.target.value.toUpperCase()} ]!`);
                }}
                className="bg-transparent text-xs font-black text-[var(--text-main)] focus:outline-none cursor-pointer"
              >
                <option value="admin">👑 Super Admin (Full 20+ Widget)</option>
                <option value="writer">✍️ Writer / Penulis (Fokus Konten)</option>
                <option value="user">👤 User / Pembaca (Ringkasan Pembaca)</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              title="Buka Katalog Widget untuk Menambahkan Kartu Baru"
            >
              <Plus className="w-4 h-4" /> Tambah Widget Baru
            </button>

            <button
              onClick={handleResetLayout}
              className="px-3.5 py-2 rounded-2xl bg-[var(--bg-surface)] hover:bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-main)] text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Reset Posisi & Dimensi Matriks Widget ke Default"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" /> Reset Default
            </button>

            <button
              onClick={handleSaveAndExitEdit}
              className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> Simpan & Selesai Editing
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
                  <h3 className="text-base font-extrabold text-[var(--text-main)]">Katalog Widget Dashboard</h3>
                  <p className="text-xs text-[var(--text-muted)]">Pilih dan tambahkan kartu widget baru ke dalam canvas dashboard Anda (Mode Role: <strong className="uppercase text-blue-400">{activeRoleView}</strong>).</p>
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
                <Filter className="w-3 h-3 text-blue-500" /> Grup:
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
                  {tab}
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
                              {widget.category}
                            </span>
                            {isPluginDisabled && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                🔌 Plugin Nonaktif
                              </span>
                            )}
                          </div>
                          {isAdded && (
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Terpasang
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-[var(--text-main)]">{widget.name}</h4>
                        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">{widget.desc}</p>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-color)]/50 flex items-center justify-between">
                        <span className="text-[10px] text-[var(--text-subtle)] font-bold">Matriks: {widget.defaultSize}</span>
                        {isAdded ? (
                          <button
                            onClick={() => handleRemoveWidget(widget.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white text-xs font-bold transition-all flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAddWidget(widget.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Tambah
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
                Selesai Memilih Widget
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
