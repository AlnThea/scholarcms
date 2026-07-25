'use client';

import { useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';
import PageHeader from '@/components/dashboard/PageHeader';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
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
      <PageHeader
        title="Kelola Kategori & Topik"
        subtitle="Organisasikan postingan blog Anda berdasarkan taksonomi kategori."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-main)] border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-500" /> Tambah Kategori Baru
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Nama Kategori *"
              required
              placeholder="misal: Cloud Computing"
              value={name}
              onChange={handleNameChange}
            />

            <Input
              label="Slug URL"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">Warna Aksen</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{color}</span>
              </div>
            </div>

            <Textarea
              label="Deskripsi Ringkas"
              rows={2}
              placeholder="Penjelasan singkat mengenai kategori ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button
              type="submit"
              loading={saving}
              className="w-full"
            >
              Tambah Kategori
            </Button>
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
