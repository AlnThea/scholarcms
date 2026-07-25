'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import PageHeader from '@/components/dashboard/PageHeader';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import {
  ListTree, FolderTree, Layers, Link as LinkIcon, Plus, Trash2,
  ChevronLeft, ChevronRight, ArrowUp, ArrowDown, GripVertical, Check, Save, RefreshCw
} from 'lucide-react';

export default function DashboardMenusPage() {
  const [activeLocation, setActiveLocation] = useState('header'); // 'header' | 'footer'
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState([]);

  // Selection states for left panel
  const [selectedCatIds, setSelectedCatIds] = useState([]);
  const [selectedPageIds, setSelectedPageIds] = useState([]);
  const [customLabel, setCustomLabel] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeLocation]);

  async function loadData() {
    setLoading(true);
    const [fetchedItems, fetchedCats, fetchedPages] = await Promise.all([
      dbService.getMenu(activeLocation),
      dbService.getCategories(),
      dbService.getPages()
    ]);
    setMenuItems(fetchedItems || []);
    setCategories(fetchedCats || []);
    setPages(fetchedPages || []);
    setLoading(false);
  }

  const handleSaveMenu = async () => {
    setSaving(true);
    await dbService.saveMenu(activeLocation, menuItems);
    setSaving(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  // ADD CATEGORIES TO MENU
  const handleAddCategories = () => {
    if (selectedCatIds.length === 0) return;
    const newItems = [...menuItems];
    selectedCatIds.forEach(id => {
      const cat = categories.find(c => c.id === id);
      if (cat) {
        newItems.push({
          id: `menu-cat-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          label: cat.name,
          type: 'category',
          target: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
          level: 1,
          order: newItems.length + 1
        });
      }
    });
    setMenuItems(newItems);
    setSelectedCatIds([]);
  };

  // ADD PAGES TO MENU
  const handleAddPages = () => {
    if (selectedPageIds.length === 0) return;
    const newItems = [...menuItems];
    selectedPageIds.forEach(id => {
      const page = pages.find(p => p.id === id);
      if (page) {
        newItems.push({
          id: `menu-page-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          label: page.title,
          type: 'page',
          target: page.slug,
          level: 1,
          order: newItems.length + 1
        });
      }
    });
    setMenuItems(newItems);
    setSelectedPageIds([]);
  };

  // ADD CUSTOM URL TO MENU
  const handleAddCustomUrl = (e) => {
    e.preventDefault();
    if (!customLabel || !customUrl) return;
    const newItem = {
      id: `menu-url-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      label: customLabel,
      type: 'url',
      url: customUrl,
      level: 1,
      order: menuItems.length + 1
    };
    setMenuItems([...menuItems, newItem]);
    setCustomLabel('');
    setCustomUrl('');
  };

  // ITEM LEVEL ADJUSTMENT (Indent / Outdent)
  const handleIndent = (index) => {
    if (index === 0) return; // Top item cannot be indented
    const prevItem = menuItems[index - 1];
    const currentItem = menuItems[index];

    // Max level 3 enforcement
    if (currentItem.level < 3 && currentItem.level <= prevItem.level) {
      const updated = [...menuItems];
      updated[index] = { ...currentItem, level: currentItem.level + 1, parentId: prevItem.id };
      setMenuItems(updated);
    }
  };

  const handleOutdent = (index) => {
    const currentItem = menuItems[index];
    if (currentItem.level > 1) {
      const updated = [...menuItems];
      updated[index] = { ...currentItem, level: currentItem.level - 1 };
      setMenuItems(updated);
    }
  };

  // REORDER ITEMS (UP / DOWN)
  const handleMoveUp = (index) => {
    if (index === 0) return;
    const updated = [...menuItems];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setMenuItems(updated);
  };

  const handleMoveDown = (index) => {
    if (index === menuItems.length - 1) return;
    const updated = [...menuItems];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setMenuItems(updated);
  };

  const handleRemoveItem = (index) => {
    const updated = menuItems.filter((_, i) => i !== index);
    setMenuItems(updated);
  };

  // HTML5 DRAG & DROP REORDER
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const updated = [...menuItems];
    const [draggedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);
    setMenuItems(updated);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">

      <PageHeader
        title="Pengelola Navigasi & Menu (Drag & Drop)"
        subtitle="Atur struktur menu hirarki 3 level untuk Header Navbar dan Footer homepage Anda."
      >
        <Button
          onClick={handleSaveMenu}
          loading={saving}
          icon={saving ? RefreshCw : (successMsg ? Check : Save)}
          variant={successMsg ? 'emerald' : 'primary'}
        >
          {saving ? 'Menyimpan...' : (successMsg ? 'Tersimpan!' : 'Simpan Perubahan Menu')}
        </Button>
      </PageHeader>

      {/* Target Location Selector */}
      <div className="p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">Pilih Lokasi Menu:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveLocation('header')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeLocation === 'header'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              🌐 Header Navbar Utama
            </button>
            <button
              onClick={() => setActiveLocation('footer')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeLocation === 'footer'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              🦶 Footer Link Bar
            </button>
          </div>
        </div>

        {successMsg && (
          <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
            <Check className="w-4 h-4" /> Menu {activeLocation} berhasil diperbarui!
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT PANEL: ITEM SOURCES */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* SOURCE 1: CATEGORIES */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-blue-500" /> Kategori Blog
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[var(--bg-primary)] text-xs text-[var(--text-main)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCatIds.includes(cat.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedCatIds([...selectedCatIds, cat.id]);
                      else setSelectedCatIds(selectedCatIds.filter(id => id !== cat.id));
                    }}
                    className="rounded border-[var(--border-color)] text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold">{cat.name}</span>
                </label>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth
              icon={Plus}
              onClick={handleAddCategories}
              disabled={selectedCatIds.length === 0}
            >
              Tambah Kategori Terpilih
            </Button>
          </div>

          {/* SOURCE 2: STATIC PAGES */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Halaman Statis
            </h3>
            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {pages.map((p) => (
                <label key={p.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[var(--bg-primary)] text-xs text-[var(--text-main)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPageIds.includes(p.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedPageIds([...selectedPageIds, p.id]);
                      else setSelectedPageIds(selectedPageIds.filter(id => id !== p.id));
                    }}
                    className="rounded border-[var(--border-color)] text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="font-semibold">{p.title}</span>
                </label>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              fullWidth
              icon={Plus}
              onClick={handleAddPages}
              disabled={selectedPageIds.length === 0}
            >
              Tambah Halaman Terpilih
            </Button>
          </div>

          {/* SOURCE 3: CUSTOM URL */}
          <form onSubmit={handleAddCustomUrl} className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-main)] flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-emerald-500" /> Custom URL
            </h3>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">Teks Tampilan (Label)</label>
              <input
                type="text"
                placeholder="misal: Beranda / Portfolio"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">URL Tujuan</label>
              <input
                type="text"
                placeholder="misal: / atau https://example.com"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              fullWidth
              icon={Plus}
              disabled={!customLabel || !customUrl}
            >
              Tambah Custom URL
            </Button>
          </form>

        </div>

        {/* RIGHT PANEL: INTERACTIVE DRAG & DROP & HIERARCHY TREE */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] space-y-6 shadow-sm">
          
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div>
              <h2 className="text-base font-extrabold text-[var(--text-main)] flex items-center gap-2">
                <ListTree className="w-5 h-5 text-blue-500" /> Stuktur Menu ({menuItems.length} Item)
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Gunakan drag-handle 🖐️ atau tombol panah untuk mengatur urutan. Gunakan tombol 👈 👉 untuk membuat sub-menu hingga 3 level.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[var(--text-subtle)]">Memuat struktur menu...</div>
          ) : menuItems.length > 0 ? (
            <div className="space-y-3">
              {menuItems.map((item, index) => {
                const indentPadding = item.level === 3 ? 'ml-12 border-l-4 border-purple-500' : item.level === 2 ? 'ml-6 border-l-4 border-blue-500' : 'border-l-4 border-emerald-500';
                
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between gap-3 transition-all ${indentPadding} ${
                      draggedIndex === index ? 'opacity-40 scale-95 border-dashed border-blue-500' : 'hover:border-blue-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="cursor-grab active:cursor-grabbing p-1 text-[var(--text-subtle)] hover:text-[var(--text-main)]">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[var(--text-main)] truncate">{item.label}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            item.type === 'category'
                              ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                              : item.type === 'page'
                              ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          }`}>
                            {item.type === 'category' ? '📂 Kategori' : item.type === 'page' ? '📄 Page' : '🔗 URL'}
                          </span>
                          <span className="text-[10px] font-semibold text-[var(--text-subtle)] bg-[var(--bg-surface)] px-2 py-0.5 rounded-lg border border-[var(--border-color)]">
                            Level {item.level || 1}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--text-subtle)] truncate mt-0.5 font-mono">
                          {item.type === 'category' ? `/category/${item.target}` : item.type === 'page' ? `/page/${item.target}` : item.url}
                        </p>
                      </div>
                    </div>

                    {/* Controls: Outdent, Indent, Up, Down, Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOutdent(index)}
                        disabled={item.level <= 1}
                        className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-blue-500 disabled:opacity-30 transition-colors"
                        title="Geser Kiri (Outdent / Kurangi Level)"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleIndent(index)}
                        disabled={item.level >= 3 || index === 0}
                        className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-blue-500 disabled:opacity-30 transition-colors"
                        title="Geser Kanan (Indent / Tambah Sub-level)"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-[var(--border-color)] mx-1" />
                      <button
                        type="button"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-blue-500 disabled:opacity-30 transition-colors"
                        title="Naikkan Urutan"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === menuItems.length - 1}
                        className="p-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-blue-500 disabled:opacity-30 transition-colors"
                        title="Turunkan Urutan"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <div className="w-px h-4 bg-[var(--border-color)] mx-1" />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                        title="Hapus dari Menu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[var(--text-subtle)] border-2 border-dashed border-[var(--border-color)] rounded-2xl">
              Belum ada item di menu ini. Pilih item dari panel kiri untuk menambahkan.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
