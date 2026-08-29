'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { dbService } from '@/services/dbService';
import PageHeader from '@/components/dashboard/PageHeader';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { Plus, Trash2, CornerDownRight } from 'lucide-react';

export default function DashboardCategories() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#2563eb');
  const [description, setDescription] = useState('');
  const [parentCategory, setParentCategory] = useState('');
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
    await dbService.saveCategory({ 
      name, 
      slug, 
      color, 
      description,
      parentCategory: parentCategory || null
    });
    setName('');
    setSlug('');
    setDescription('');
    setParentCategory('');
    setSaving(false);
    loadCategories();
  };

  const handleDelete = async (id, catName) => {
    if (confirm(`Delete category "${catName}"?`)) {
      await dbService.deleteCategory(id);
      loadCategories();
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // You can adjust items per page here

  const mainCategories = categories.filter(c => !c.parentCategory);
  const getSubCategories = (parentName) => categories.filter(c => c.parentCategory === parentName);

  // Flatten categories to keep hierarchy in pagination
  const flattenedCategories = [];
  mainCategories.forEach(cat => {
    flattenedCategories.push({ ...cat, isSub: false });
    getSubCategories(cat.name).forEach(subCat => {
      flattenedCategories.push({ ...subCat, isSub: true, parentSlug: cat.slug });
    });
  });

  const totalPages = Math.ceil(flattenedCategories.length / itemsPerPage);
  const paginatedCategories = flattenedCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t('categoriesTitle') || 'Kategori'}
        subtitle={t('categoriesSubtitle') || 'Kelola kategori dan sub-kategori'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 self-start">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-main)] border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-500" /> {t('addCategoryHeader') || 'Tambah Kategori'}
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label={t('categoryNameLabel') || 'Nama Kategori'}
              required
              placeholder={t('categoryNamePlaceholder') || 'Misal: Teknologi'}
              value={name}
              onChange={handleNameChange}
            />

            <Input
              label={t('urlSlugLabel') || 'Slug URL'}
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            />

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                {isEn ? 'Parent Category (Optional)' : 'Kategori Induk (Opsional)'}
              </label>
              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-xs text-[var(--text-main)] focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">-- {isEn ? 'None (Main Category)' : 'Tidak ada (Kategori Utama)'} --</option>
                {mainCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">{t('accentColorLabel') || 'Warna Aksen'}</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                />
                <span className="text-xs font-mono font-bold text-[var(--text-muted)]">{color}</span>
              </div>
            </div>

            <Textarea
              label={t('shortDescLabel') || 'Deskripsi Singkat'}
              rows={2}
              placeholder={t('shortDescPlaceholder') || 'Deskripsi kategori...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button
              type="submit"
              loading={saving}
              className="w-full"
            >
              {t('addCategoryBtn') || 'Simpan Kategori'}
            </Button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-color)] shadow-sm space-y-4 self-start">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[var(--text-main)] border-b border-[var(--border-color)] pb-3">
            {t('activeCategoriesList') || 'Kategori Aktif'} ({categories.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[var(--text-main)] whitespace-nowrap">
              <thead className="bg-[var(--bg-primary)] text-xs uppercase text-[var(--text-muted)] font-semibold border-y border-[var(--border-color)]">
                <tr>
                  <th className="py-3 px-4">{isEn ? 'Category' : 'Kategori'}</th>
                  <th className="py-3 px-4">{isEn ? 'Slug' : 'Slug'}</th>
                  <th className="py-3 px-4 text-right">{isEn ? 'Actions' : 'Aksi'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-xs text-[var(--text-subtle)]">
                      {isEn ? 'No categories found.' : 'Tidak ada kategori.'}
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[var(--bg-primary)] transition-colors">
                      <td className="py-3 px-4">
                        <div className={`flex items-center gap-3 ${cat.isSub ? 'pl-6' : ''}`}>
                          {cat.isSub && <CornerDownRight className="w-4 h-4 text-[var(--text-muted)] shrink-0" />}
                          <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color || '#2563eb' }} />
                          <div>
                            <p className="font-bold">{cat.name}</p>
                            {cat.description && <p className="text-xs text-[var(--text-muted)] mt-0.5">{cat.description}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-[var(--text-subtle)]">
                          /{cat.isSub ? `${cat.parentSlug}/${cat.slug}` : cat.slug}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors inline-flex"
                          title={t('deleteCategory') || 'Hapus'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
              <span className="text-xs text-[var(--text-muted)]">
                {isEn ? `Page ${currentPage} of ${totalPages}` : `Halaman ${currentPage} dari ${totalPages}`}
              </span>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePrevPage} 
                  disabled={currentPage === 1}
                  variant="outline" 
                  size="sm"
                >
                  {isEn ? 'Previous' : 'Sebelumnya'}
                </Button>
                <Button 
                  onClick={handleNextPage} 
                  disabled={currentPage === totalPages}
                  variant="outline" 
                  size="sm"
                >
                  {isEn ? 'Next' : 'Selanjutnya'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
