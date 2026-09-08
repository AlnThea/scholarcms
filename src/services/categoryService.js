import { isFirebaseConfigured, db } from '@/lib/firebase';
import { INITIAL_CATEGORIES } from '@/constants/mockData';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getLocal, setLocal } from './dbHelpers';

export const categoryService = {
  async getCategories() {
    let raw = [];
    if (isFirebaseConfigured()) {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        if (!snap.empty) {
          raw = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      } catch (err) {}
    }
    if (raw.length === 0) {
      raw = getLocal('categories', INITIAL_CATEGORIES);
    }
    const uniqueMap = new Map();
    raw.forEach(cat => {
      if (cat && cat.name) {
        const key = cat.name.trim().toLowerCase();
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, cat);
        }
      }
    });
    const result = Array.from(uniqueMap.values());
    setLocal('categories', result);
    return result;
  },

  async createCategory(catData) {
    return this.saveCategory(catData);
  },

  async saveCategory(catData) {
    const payload = {
      name: catData.name,
      slug: catData.slug || catData.name.toLowerCase().replace(/\s+/g, '-'),
      color: catData.color || '#2563eb',
      description: catData.description || '',
      parentCategory: catData.parentCategory || ''
    };

    if (isFirebaseConfigured()) {
      try {
        if (catData.id) {
          await updateDoc(doc(db, 'categories', catData.id), payload);
          return { id: catData.id, ...payload };
        } else {
          const res = await addDoc(collection(db, 'categories'), payload);
          return { id: res.id, ...payload };
        }
      } catch (e) {}
    }

    let cats = getLocal('categories', INITIAL_CATEGORIES);
    if (catData.id) {
      const idx = cats.findIndex(c => c.id === catData.id);
      if (idx !== -1) cats[idx] = { ...cats[idx], ...payload };
    } else {
      const existsIdx = cats.findIndex(c => c.name.toLowerCase() === catData.name.toLowerCase());
      if (existsIdx === -1) {
        cats.push({ id: `cat-${Date.now()}`, ...payload });
      }
    }
    setLocal('categories', cats);
    return cats;
  },

  async deleteCategory(id) {
    if (isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch (e) {}
    }
    let cats = getLocal('categories', INITIAL_CATEGORIES);
    cats = cats.filter(c => c.id !== id);
    setLocal('categories', cats);
    return true;
  },

  async ensureCategoryExists(categoryInput, parentNiche = 'Teknologi') {
    if (!categoryInput) return null;
    const catList = Array.isArray(categoryInput)
      ? categoryInput
      : String(categoryInput).split(',').map(s => s.trim()).filter(Boolean);

    for (const catName of catList) {
      const cleanName = catName.trim();
      if (!cleanName) continue;
      try {
        const cats = await this.getCategories();
        const exists = cats.some(c => c.name.toLowerCase() === cleanName.toLowerCase());
        if (!exists) {
          const paletteColors = ['#8b5cf6', '#2563eb', '#ef4444', '#f59e0b', '#ec4899', '#10b981', '#06b6d4', '#3b82f6', '#84cc16', '#a855f7'];
          const randomColor = paletteColors[Math.floor(Math.random() * paletteColors.length)];
          await this.saveCategory({
            name: cleanName,
            slug: cleanName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
            color: randomColor,
            description: `Sub-kategori ${cleanName} dalam payung ${parentNiche}`,
            parentCategory: parentNiche || ''
          });
        }
      } catch (e) {
        console.warn('Failed to auto-create category:', e);
      }
    }
    return true;
  }
};
