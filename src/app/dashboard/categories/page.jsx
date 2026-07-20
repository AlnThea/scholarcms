'use client';
import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import { Plus, Trash2 } from 'lucide-react';

export default function DashboardCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const data = await dbService.getCategories();
    setCategories(data);
  }

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    setSlug(val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    setSaving(true);
    await dbService.saveCategory({ name, slug, color, description });
    setName('');
    setSlug('');
    setDescription('');
    setSaving(false);
    loadCategories();
  };

  const handleDelete = async (id, name) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${name}"?`)) {
      await dbService.deleteCategory(id);
      loadCategories();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-extrabold text-[var(--text-main)]">Kelola Kategori & Topik</h2>
        <p className="text-xs text-[var(--text-muted)]">Organisasikan postingan blog Anda berdasarkan taksonomi kategori.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-main)] border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-500" /> Tambah Kategori Baru
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Nama Kategori *</label>
              <input
                type="text"
                required
                placeholder="misal: Cloud Computing"
                value={name}
                onChange={handleNameChange}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Slug URL</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Warna Aksen</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono text-[var(--text-muted)]">{color}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">Deskripsi Ringkas</label>
              <textarea
                rows={2}
                placeholder="Penjelasan singkat mengenai kategori ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-main)]"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Tambah Kategori'}
            </button>
          </form>
        </div>
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">
            Daftar Kategori Aktif ({categories.length})
          </h3>
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color || '#2563eb' }} />
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-main)]">{cat.name}</h4>
                    <p className="text-xs text-[var(--text-subtle)]">slug: /{cat.slug}</p>
                    {cat.description && <p className="text-xs text-[var(--text-muted)] mt-1">{cat.description}</p>}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
