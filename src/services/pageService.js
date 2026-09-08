import { isFirebaseConfigured, db } from '@/lib/firebase';
import { INITIAL_PAGES } from '@/constants/mockData';
import { collection, doc, getDocs, getDoc, addDoc, setDoc, deleteDoc, updateDoc, query, where, increment } from 'firebase/firestore';
import { getLocal, setLocal } from './dbHelpers';

export const pageService = {
  async seedDefaultPagesToFirestore() {
    if (!isFirebaseConfigured()) return false;
    try {
      for (const page of INITIAL_PAGES) {
        const docRef = doc(db, 'pages', page.id);
        const snap = await getDoc(docRef);
        if (!snap.exists()) {
          await setDoc(docRef, page, { merge: true });
        }
      }
      return true;
    } catch (e) {
      console.warn('seedDefaultPagesToFirestore error:', e);
      return false;
    }
  },

  async getPages() {
    if (isFirebaseConfigured()) {
      try {
        let snap = await getDocs(collection(db, 'pages'));
        
        if (snap.empty) {
          const seeded = getLocal('pages_firestore_seeded', false);
          if (!seeded) {
            await this.seedDefaultPagesToFirestore();
            setLocal('pages_firestore_seeded', true);
            snap = await getDocs(collection(db, 'pages'));
          }
        }

        if (!snap.empty) {
          return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        return [];
      } catch (e) {
        console.warn('Firestore getPages error:', e);
      }
    }
    return getLocal('pages', INITIAL_PAGES);
  },

  async getPageBySlug(slug) {
    if (isFirebaseConfigured()) {
      try {
        const q = query(collection(db, 'pages'), where('slug', '==', slug));
        const snap = await getDocs(q);

        if (!snap.empty) {
          const docSnap = snap.docs[0];
          let page = { id: docSnap.id, ...docSnap.data() };
          try {
            await updateDoc(doc(db, 'pages', docSnap.id), { views: increment(1) });
          } catch(e){}
          return page;
        }
      } catch (e) {
        console.warn('Firestore getPageBySlug error:', e);
      }
    }
    const pages = getLocal('pages', INITIAL_PAGES);
    const p = pages.find(page => page.slug === slug);
    if (p) {
      p.views = (p.views || 0) + 1;
      return p;
    }
    return null;
  },

  async getPageById(id) {
    if (isFirebaseConfigured()) {
      try {
        const snap = await getDoc(doc(db, 'pages', id));
        if (snap.exists()) return { id: snap.id, ...snap.data() };
      } catch (e) {}
    }
    const pages = getLocal('pages', INITIAL_PAGES);
    return pages.find(p => p.id === id) || null;
  },

  async savePage(pageData) {
    const now = new Date().toISOString();
    const payload = {
      title: pageData.title || 'Untitled Page',
      slug: pageData.slug || pageData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: pageData.excerpt || '',
      status: pageData.status || 'published',
      publishedAt: pageData.publishedAt || now,
      author: pageData.author || { name: 'Ernst Senior Dev', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', role: 'CMS Administrator' },
      seoTitle: pageData.seoTitle || pageData.title || '',
      seoDescription: pageData.seoDescription || pageData.excerpt || '',
      focusKeyword: (pageData.focusKeyword || '').toLowerCase(),
      content: pageData.content || '',
      blocks: pageData.blocks || [],
      updatedAt: now
    };

    if (isFirebaseConfigured()) {
      try {
        if (pageData.id) {
          await updateDoc(doc(db, 'pages', pageData.id), payload);
          return { id: pageData.id, ...payload };
        } else {
          payload.views = 0;
          const newDoc = await addDoc(collection(db, 'pages'), payload);
          return { id: newDoc.id, ...payload };
        }
      } catch (e) {
        console.warn('Firestore savePage error:', e);
      }
    }

    let pages = getLocal('pages', INITIAL_PAGES);
    if (pageData.id) {
      const idx = pages.findIndex(p => p.id === pageData.id);
      if (idx !== -1) {
        pages[idx] = { ...pages[idx], ...payload };
        setLocal('pages', pages);
        return pages[idx];
      }
    }
    const newPage = { id: `page-${Date.now()}`, views: 0, ...payload };
    pages.unshift(newPage);
    setLocal('pages', pages);
    return newPage;
  },

  async deletePage(id) {
    if (isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'pages', id));
      } catch (e) {
        console.warn('Firestore deletePage error:', e);
      }
    }
    let pages = getLocal('pages', INITIAL_PAGES);
    pages = pages.filter(p => p.id !== id);
    setLocal('pages', pages);
    return true;
  }
};
