import { isFirebaseConfigured, db, auth } from '@/lib/firebase';
import { INITIAL_CATEGORIES, INITIAL_POSTS, INITIAL_COMMENTS, INITIAL_PAGES, INITIAL_MENUS } from '@/constants/mockData';
import {
  collection, doc, getDocs, getDoc, addDoc, setDoc, deleteDoc, updateDoc, query, where, orderBy, increment
} from 'firebase/firestore';

// Clean up any stale demo data in localStorage on app load (if present).
if (typeof window !== 'undefined') {
  Object.keys(localStorage).forEach(k => {
    // Preserve theme, plugin states/settings, custom packages, palette layout, and dashboard layout configuration
    if (
      k.startsWith('scholarcms_') &&
      k !== 'scholarcms_theme' &&
      !k.startsWith('scholarcms_plugin_') &&
      !k.startsWith('scholarcms_custom_plugin_') &&
      !k.startsWith('scholarcms_palette_') &&
      !k.startsWith('scholarcms_dashboard_')
    ) {
      localStorage.removeItem(k);
    }
  });
}

// Fast Timeout Wrapper (Abort hanging Firestore calls after 3000ms for stable connection)
function withTimeout(promise, ms = 3000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore Timeout')), ms))
  ]);
}

// LocalStorage Helper for Fast Offline / Demo Mode
function getLocal(key, defaultData) {
  if (typeof window === 'undefined') return defaultData;
  try {
    const item = localStorage.getItem(`scholarcms_${key}`);
    return item ? JSON.parse(item) : defaultData;
  } catch (e) {
    return defaultData;
  }
}

function setLocal(key, data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`scholarcms_${key}`, JSON.stringify(data));
  } catch (e) {}
}

// PUBLIC API DATA SERVICE
export const dbService = {
  isRealFirebase() {
    return isFirebaseConfigured();
  },

  // POSTS
  async getPosts(options = {}) {
    const { category, search, status, limit } = options;
    const now = new Date().toISOString();

    const processScheduledPost = (p) => {
      // Just-In-Time Auto-Publish: Jika waktu jadwal rilis sudah terlewati, ubah status ke published
      if (p.status === 'scheduled' && p.publishedAt && p.publishedAt <= now) {
        p.status = 'published';
        if (isFirebaseConfigured() && p.id) {
          try {
            updateDoc(doc(db, 'posts', p.id), { status: 'published' }).catch(() => {});
          } catch(e) {}
        }
      }
      return p;
    };

    if (isFirebaseConfigured()) {
      try {
        const postsRef = collection(db, 'posts');
        let q = query(postsRef, orderBy('publishedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        let posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        posts = posts.map(processScheduledPost);

        if (status && status !== 'all') {
          if (status === 'published') {
            posts = posts.filter(p => p.status === 'published' && (!p.publishedAt || p.publishedAt <= now));
          } else if (status === 'scheduled') {
            posts = posts.filter(p => p.status === 'scheduled' || (p.publishedAt && p.publishedAt > now && p.status !== 'draft'));
          } else {
            posts = posts.filter(p => p.status === status);
          }
        } else if (!status) {
          // Default public view: Hapus artikel terjadwal di masa depan
          posts = posts.filter(p => p.status === 'published' && (!p.publishedAt || p.publishedAt <= now));
        }

        if (category && category !== 'All') posts = posts.filter(p => p.category === category);
        if (search) {
          const s = search.toLowerCase();
          posts = posts.filter(p => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s));
        }
        if (limit) posts = posts.slice(0, limit);
        return posts;
      } catch (err) {
        console.warn('Firestore error, falling back to local:', err);
      }
    }

    // Demo Mode / Local Storage Fallback
    let posts = getLocal('posts', INITIAL_POSTS);
    posts = posts.map(processScheduledPost);

    if (status && status !== 'all') {
      if (status === 'published') {
        posts = posts.filter(p => p.status === 'published' && (!p.publishedAt || p.publishedAt <= now));
      } else if (status === 'scheduled') {
        posts = posts.filter(p => p.status === 'scheduled' || (p.publishedAt && p.publishedAt > now && p.status !== 'draft'));
      } else {
        posts = posts.filter(p => p.status === status);
      }
    } else if (!status) {
      posts = posts.filter(p => p.status === 'published' && (!p.publishedAt || p.publishedAt <= now));
    }

    if (category && category !== 'All') {
      posts = posts.filter(p => p.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      posts = posts.filter(p => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s));
    }
    if (limit) {
      posts = posts.slice(0, limit);
    }
    return posts;
  },

  async getPostBySlug(slug) {
    const now = new Date().toISOString();
    if (isFirebaseConfigured()) {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docSnap = snap.docs[0];
          let post = { id: docSnap.id, ...docSnap.data() };
          
          if (post.status === 'scheduled' && post.publishedAt && post.publishedAt <= now) {
            post.status = 'published';
            try { await updateDoc(doc(db, 'posts', docSnap.id), { status: 'published' }); } catch(e){}
          }
          
          try {
            await updateDoc(doc(db, 'posts', docSnap.id), { views: increment(1) });
          } catch(e){}
          return post;
        }
      } catch (err) {
        console.warn('Firestore getBySlug error:', err);
      }
    }

    const posts = getLocal('posts', INITIAL_POSTS);
    const postIndex = posts.findIndex(p => p.slug === slug);
    if (postIndex !== -1) {
      let post = posts[postIndex];
      if (post.status === 'scheduled' && post.publishedAt && post.publishedAt <= now) {
        post.status = 'published';
      }
      post.views = (post.views || 0) + 1;
      setLocal('posts', posts);
      return post;
    }
    return null;
  },

  async getPostById(id) {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'posts', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) return { id: snap.id, ...snap.data() };
      } catch (e) {}
    }
    const posts = getLocal('posts', INITIAL_POSTS);
    return posts.find(p => p.id === id) || null;
  },

  async savePost(postData) {
    const now = new Date().toISOString();
    const pubAt = postData.publishedAt
      ? new Date(postData.publishedAt).toISOString()
      : now;

    // Tentukan status otomatis: jika publishedAt di masa depan dan bukan draft -> 'scheduled'
    let finalStatus = postData.status || 'published';
    if (finalStatus !== 'draft' && pubAt > now) {
      finalStatus = 'scheduled';
    }

    const postPayload = {
      title: postData.title || 'Untitled Post',
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: postData.excerpt || '',
      category: postData.category || 'Web Development',
      tags: Array.isArray(postData.tags) ? postData.tags : (postData.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      featuredImage: postData.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      status: finalStatus,
      publishedAt: pubAt,
      readTime: postData.readTime || '5 min read',
      author: postData.author || { name: 'Ernst Senior Dev', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', role: 'CMS Administrator' },
      seoTitle: postData.seoTitle || postData.title || '',
      seoDescription: postData.seoDescription || postData.excerpt || '',
      focusKeyword: postData.focusKeyword || '',
      canonicalUrl: postData.canonicalUrl || '',
      noIndex: postData.noIndex || false,
      enableAds: postData.enableAds !== undefined ? postData.enableAds : true,
      adPlacement: postData.adPlacement || 'all',
      adClient: postData.adClient || 'ca-pub-9999999999999999',
      adSlot: postData.adSlot || '1234567890',
      isSponsored: postData.isSponsored || false,
      content: postData.content || '',
      blocks: postData.blocks || [],
      updatedAt: now
    };

    if (isFirebaseConfigured()) {
      try {
        if (postData.id) {
          await updateDoc(doc(db, 'posts', postData.id), postPayload);
          return { id: postData.id, ...postPayload };
        } else {
          postPayload.views = 0;
          const newDoc = await addDoc(collection(db, 'posts'), postPayload);
          return { id: newDoc.id, ...postPayload };
        }
      } catch (err) {
        console.warn('Firestore savePost error:', err);
      }
    }

    // Local Storage Fallback
    let posts = getLocal('posts', INITIAL_POSTS);
    if (postData.id) {
      const idx = posts.findIndex(p => p.id === postData.id);
      if (idx !== -1) {
        posts[idx] = { ...posts[idx], ...postPayload };
        setLocal('posts', posts);
        return posts[idx];
      }
    }
    const newPost = {
      id: `post-${Date.now()}`,
      views: 0,
      ...postPayload
    };
    posts.unshift(newPost);
    setLocal('posts', posts);
    return newPost;
  },

  async deletePost(id) {
    if (isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'posts', id));
        return true;
      } catch (err) {
        console.warn('Firestore delete error:', err);
      }
    }
    let posts = getLocal('posts', INITIAL_POSTS);
    posts = posts.filter(p => p.id !== id);
    setLocal('posts', posts);
    return true;
  },

  // CATEGORIES
  async getCategories() {
    if (isFirebaseConfigured()) {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        if (!snap.empty) {
          return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
      } catch (err) {}
    }
    return getLocal('categories', INITIAL_CATEGORIES);
  },

  async createCategory(catData) {
    return this.saveCategory(catData);
  },

  async saveCategory(catData) {
    const payload = {
      name: catData.name,
      slug: catData.slug || catData.name.toLowerCase().replace(/\s+/g, '-'),
      color: catData.color || '#2563eb',
      description: catData.description || ''
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
      cats.push({ id: `cat-${Date.now()}`, ...payload });
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

  // COMMENTS
  async getComments(postId) {
    if (isFirebaseConfigured()) {
      try {
        const q = query(collection(db, 'comments'), where('postId', '==', postId));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {}
    }
    const comms = getLocal('comments', INITIAL_COMMENTS);
    return postId ? comms.filter(c => c.postId === postId) : comms;
  },

  async addComment(commentData) {
    const payload = {
      postId: commentData.postId,
      authorName: commentData.authorName,
      authorEmail: commentData.authorEmail,
      content: commentData.content,
      createdAt: new Date().toISOString(),
      status: 'approved'
    };

    if (isFirebaseConfigured()) {
      try {
        const res = await addDoc(collection(db, 'comments'), payload);
        return { id: res.id, ...payload };
      } catch (e) {}
    }

    let comms = getLocal('comments', INITIAL_COMMENTS);
    const newComm = { id: `comm-${Date.now()}`, ...payload };
    comms.unshift(newComm);
    setLocal('comments', comms);
    return newComm;
  },

  async updateCommentStatus(commentId, status) {
    if (isFirebaseConfigured()) {
      try {
        await updateDoc(doc(db, 'comments', commentId), { status });
      } catch (e) {}
    }
    let comms = getLocal('comments', INITIAL_COMMENTS);
    const idx = comms.findIndex(c => c.id === commentId);
    if (idx !== -1) {
      comms[idx].status = status;
      setLocal('comments', comms);
    }
    return true;
  },

  async deleteComment(commentId) {
    if (isFirebaseConfigured()) {
      try {
        await deleteDoc(doc(db, 'comments', commentId));
      } catch (e) {}
    }
    let comms = getLocal('comments', INITIAL_COMMENTS);
    comms = comms.filter(c => c.id !== commentId);
    setLocal('comments', comms);
    return true;
  },

  // ANALYTICS & OVERVIEW
  async getAnalytics() {
    const posts = await this.getPosts({ status: 'all' });
    const comms = await this.getComments();
    const cats = await this.getCategories();

    const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
    const publishedCount = posts.filter(p => p.status === 'published').length;
    const draftCount = posts.filter(p => p.status === 'draft').length;

    return {
      totalPosts: posts.length,
      publishedPosts: publishedCount,
      draftPosts: draftCount,
      totalViews,
      totalComments: comms.length,
      totalCategories: cats.length,
      isFirebaseActive: isFirebaseConfigured()
    };
  },

  async resetDemoData() {
    // Demo data reset is disabled because localStorage demo mode is turned off.
    // Function retained for API compatibility.
  },

  // ADSENSE GLOBAL SETTINGS (ADMIN ONLY)
  async getAdSenseSettings() {
    const DEFAULT_SETTINGS = {
      globalEnableAds: true,
      adClient: 'ca-pub-9999999999999999',
      headerAdSlot: '1234567890',
      inArticleAdSlot: '0987654321',
      footerAdSlot: '1122334455',
      autoAdsEnabled: true,
    };

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'settings', 'adsense');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return { ...DEFAULT_SETTINGS, ...snap.data() };
        }
      } catch (e) {
        console.warn('Firestore getAdSenseSettings error:', e);
      }
    }

    return getLocal('adsense_settings', DEFAULT_SETTINGS);
  },

  async saveAdSenseSettings(settingsData) {
    const payload = {
      globalEnableAds: settingsData.globalEnableAds !== undefined ? settingsData.globalEnableAds : true,
      adClient: settingsData.adClient || 'ca-pub-9999999999999999',
      headerAdSlot: settingsData.headerAdSlot || '1234567890',
      inArticleAdSlot: settingsData.inArticleAdSlot || '0987654321',
      footerAdSlot: settingsData.footerAdSlot || '1122334455',
      autoAdsEnabled: settingsData.autoAdsEnabled !== undefined ? settingsData.autoAdsEnabled : true,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'settings', 'adsense'), payload, { merge: true });
        return payload;
      } catch (e) {
        console.warn('Firestore saveAdSenseSettings error:', e);
      }
    }

    setLocal('adsense_settings', payload);
    return payload;
  },

  // GENERAL SITE SETTINGS (REGISTRATION SWITCH & SITE IDENTITIES)
  async getGeneralSettings() {
    const DEFAULT_SETTINGS = {
      siteTitle: 'ScholarCMS',
      siteTagline: 'Modern Publishing Platform',
      allowRegistration: true,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'settings', 'general');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return { ...DEFAULT_SETTINGS, ...snap.data() };
        }
      } catch (e) {
        console.warn('Firestore getGeneralSettings error:', e);
      }
    }

    return getLocal('general_settings', DEFAULT_SETTINGS);
  },

  async saveGeneralSettings(settingsData) {
    const payload = {
      siteTitle: (settingsData.siteTitle || 'ScholarCMS').trim(),
      siteTagline: (settingsData.siteTagline || 'Modern Publishing Platform').trim(),
      allowRegistration: settingsData.allowRegistration !== undefined ? settingsData.allowRegistration : true,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'settings', 'general'), payload, { merge: true });
        return payload;
      } catch (e) {
        console.warn('Firestore saveGeneralSettings error:', e);
      }
    }

    setLocal('general_settings', payload);
    return payload;
  },

  // STATIC PAGES
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
        
        // Auto-seed default legal pages if database collection is empty or missing initial pages
        if (snap.empty) {
          await this.seedDefaultPagesToFirestore();
          snap = await getDocs(collection(db, 'pages'));
        }

        if (!snap.empty) {
          const firestorePages = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          
          // Check if any default legal page is missing and seed it in background
          const existingSlugs = new Set(firestorePages.map(p => p.slug));
          const missingPages = INITIAL_PAGES.filter(p => !existingSlugs.has(p.slug));
          if (missingPages.length > 0) {
            for (const page of missingPages) {
              try {
                await setDoc(doc(db, 'pages', page.id), page, { merge: true });
                firestorePages.push(page);
              } catch(e) {}
            }
          }

          return firestorePages;
        }
      } catch (e) {
        console.warn('Firestore getPages error:', e);
      }
    }
    return INITIAL_PAGES;
  },

  async getPageBySlug(slug) {
    if (isFirebaseConfigured()) {
      try {
        const q = query(collection(db, 'pages'), where('slug', '==', slug));
        let snap = await getDocs(q);

        // If page is not in Firestore yet, check if it's a default legal page and seed it
        if (snap.empty) {
          const mockPage = INITIAL_PAGES.find(p => p.slug === slug);
          if (mockPage) {
            try {
              await setDoc(doc(db, 'pages', mockPage.id), mockPage, { merge: true });
              snap = await getDocs(q);
            } catch(e) {}
          }
        }

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
    const pages = INITIAL_PAGES;
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
        return true;
      } catch (e) {
        console.warn('Firestore deletePage error:', e);
      }
    }
    let pages = getLocal('pages', INITIAL_PAGES);
    pages = pages.filter(p => p.id !== id);
    setLocal('pages', pages);
    return true;
  },

  // MENUS (HEADER & FOOTER 3-LEVEL NAVIGATION)
  async getMenu(location = 'header') {
    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'menus', location);
        const snap = await getDoc(docRef);
        if (snap.exists() && snap.data().items) {
          return snap.data().items;
        }
      } catch (e) {
        console.warn('Firestore getMenu error:', e);
      }
    }
    const menus = getLocal('menus', INITIAL_MENUS);
    return menus[location] || INITIAL_MENUS[location] || [];
  },

  async saveMenu(location = 'header', items = []) {
    const payload = {
      location,
      items,
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'menus', location), payload, { merge: true });
        return items;
      } catch (e) {
        console.warn('Firestore saveMenu error:', e);
      }
    }

    let menus = getLocal('menus', INITIAL_MENUS);
    menus[location] = items;
    setLocal('menus', menus);
    return items;
  },

  // THEMES SYSTEM MANAGEMENT (MODULAR THEMES ENGINE)
  async getActiveTheme() {
    const DEFAULT_THEME_SETTING = {
      activeThemeId: 'modern',
      customizations: {
        primaryColor: '#2563eb',
        accentColor: '#3b82f6',
        fontFamily: 'Inter',
        cardStyle: 'glassmorphism', // glassmorphism, flat, elevated, classic
        heroStyle: 'featured', // featured, split, minimal
        customCss: ''
      },
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'settings', 'theme');
        const snap = await withTimeout(getDoc(docRef));
        if (snap.exists()) {
          return { ...DEFAULT_THEME_SETTING, ...snap.data() };
        }
      } catch (e) {
        console.warn('Firestore getActiveTheme error:', e);
      }
    }

    return getLocal('theme_settings', DEFAULT_THEME_SETTING);
  },

  async setActiveTheme(themeId) {
    const current = await this.getActiveTheme();
    const payload = {
      ...current,
      activeThemeId: themeId,
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'settings', 'theme'), payload, { merge: true });
        return payload;
      } catch (e) {
        console.warn('Firestore setActiveTheme error:', e);
      }
    }

    setLocal('theme_settings', payload);
    return payload;
  },

  async saveThemeCustomizations(customizationsData) {
    const current = await this.getActiveTheme();
    const payload = {
      ...current,
      customizations: {
        ...(current.customizations || {}),
        ...customizationsData
      },
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'settings', 'theme'), payload, { merge: true });
        return payload;
      } catch (e) {
        console.warn('Firestore saveThemeCustomizations error:', e);
      }
    }

    setLocal('theme_settings', payload);
    return payload;
  },

  async getCustomThemePackages() {
    if (isFirebaseConfigured()) {
      try {
        const snap = await withTimeout(getDocs(collection(db, 'custom_themes')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {}
    }
    return getLocal('custom_theme_packages', []);
  },

  async saveCustomThemePackage(themePackage) {
    const payload = {
      id: themePackage.id || `custom-${Date.now()}`,
      name: themePackage.name || 'Custom Theme',
      description: themePackage.description || 'Imported Custom Theme Package',
      version: themePackage.version || '1.0.0',
      author: themePackage.author || 'Anonymous',
      category: themePackage.category || 'Custom',
      layoutType: themePackage.layoutType || 'dynamic',
      customizations: themePackage.customizations || {},
      layoutConfig: themePackage.layoutConfig || {},
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'custom_themes', payload.id), payload, { merge: true });
        return payload;
      } catch (e) {
        console.warn('Firestore saveCustomThemePackage error:', e);
      }
    }

    const currentPackages = getLocal('custom_theme_packages', []);
    const idx = currentPackages.findIndex(p => p.id === payload.id);
    if (idx !== -1) {
      currentPackages[idx] = payload;
    } else {
      currentPackages.push(payload);
    }
    setLocal('custom_theme_packages', currentPackages);
    return payload;
  },

  // PLUGINS SYSTEM MANAGEMENT (DYNAMIC PLUGINS ENGINE)
  async getPluginStates() {
    const DEFAULT_STATES = {
      'seo-analyzer': true,
      'newsletter': true,
      'whatsapp-float': true
    };

    const localSaved = getLocal('plugin_states', null);
    if (localSaved) {
      return { ...DEFAULT_STATES, ...localSaved };
    }

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'settings', 'plugins');
        const snap = await withTimeout(getDoc(docRef), 1500);
        if (snap.exists()) {
          const merged = { ...DEFAULT_STATES, ...snap.data() };
          setLocal('plugin_states', merged);
          return merged;
        }
      } catch (e) {}
    }

    return DEFAULT_STATES;
  },

  async togglePluginStatus(pluginId, isEnabled) {
    const current = await this.getPluginStates();
    const payload = {
      ...current,
      [pluginId]: isEnabled,
      updatedAt: new Date().toISOString()
    };

    // Always persist to local cache first so status survives refreshes and timeouts
    setLocal('plugin_states', payload);

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'settings', 'plugins'), payload, { merge: true });
      } catch (e) {
        console.warn('Firestore togglePluginStatus error:', e);
      }
    }

    return payload;
  },

  async getPluginSettings(pluginId) {
    const DEFAULT_SETTINGS = {
      'whatsapp-float': {
        phoneNumber: '6281234567890',
        welcomeMessage: 'Halo Admin ScholarCMS, saya mau bertanya mengenai artikel blog!',
        buttonPosition: 'bottom-right'
      },
      'newsletter': {
        headingTitle: 'Dapatkan Artikel Terbaru di Email Anda',
        buttonLabel: 'Berlangganan Gratis'
      },
      'seo-analyzer': {
        autoScan: true
      }
    };

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'settings', `plugin_${pluginId}`);
        const snap = await withTimeout(getDoc(docRef));
        if (snap.exists()) {
          const merged = { ...(DEFAULT_SETTINGS[pluginId] || {}), ...snap.data() };
          setLocal(`plugin_setting_${pluginId}`, merged);
          return merged;
        }
      } catch (e) {
        console.warn('Firestore getPluginSettings error:', e);
      }
    }

    return getLocal(`plugin_setting_${pluginId}`, DEFAULT_SETTINGS[pluginId] || {});
  },

  async savePluginSettings(pluginId, settingsData) {
    const current = await this.getPluginSettings(pluginId);
    const payload = {
      ...current,
      ...settingsData,
      updatedAt: new Date().toISOString()
    };

    setLocal(`plugin_setting_${pluginId}`, payload);

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'settings', `plugin_${pluginId}`), payload, { merge: true });
      } catch (e) {
        console.warn('Firestore savePluginSettings error:', e);
      }
    }

    return payload;
  },

  async getCustomPluginPackages() {
    if (isFirebaseConfigured()) {
      try {
        const snap = await withTimeout(getDocs(collection(db, 'custom_plugins')));
        if (!snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setLocal('custom_plugin_packages', list);
          return list;
        }
      } catch (e) {}
    }
    return getLocal('custom_plugin_packages', []);
  },

  async saveCustomPluginPackage(pluginPackage) {
    const payload = {
      id: pluginPackage.id || `plugin-${Date.now()}`,
      name: pluginPackage.name || 'Custom Plugin',
      description: pluginPackage.description || 'Imported Plugin Package',
      version: pluginPackage.version || '1.0.0',
      author: pluginPackage.author || 'Anonymous',
      routePath: pluginPackage.routePath || pluginPackage.id,
      navLabel: pluginPackage.navLabel || pluginPackage.name,
      createdAt: new Date().toISOString()
    };

    const currentPackages = getLocal('custom_plugin_packages', []);
    const idx = currentPackages.findIndex(p => p.id === payload.id);
    if (idx !== -1) {
      currentPackages[idx] = payload;
    } else {
      currentPackages.push(payload);
    }
    setLocal('custom_plugin_packages', currentPackages);

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'custom_plugins', payload.id), payload, { merge: true });
      } catch (e) {}
    }

    return payload;
  },

  // NEWSLETTER SUBSCRIBERS
  async getSubscribers() {
    if (isFirebaseConfigured()) {
      try {
        const snap = await withTimeout(getDocs(collection(db, 'subscribers')));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
      } catch (e) {}
    }
    return getLocal('subscribers', [
      { id: 'sub-1', email: 'pembaca1@example.com', name: 'Budi Santoso', subscribedAt: new Date().toISOString() },
      { id: 'sub-2', email: 'pembaca2@example.com', name: 'Siti Rahma', subscribedAt: new Date().toISOString() }
    ]);
  },

  async addSubscriber(subscriberData) {
    const payload = {
      email: (subscriberData.email || '').trim().toLowerCase(),
      name: subscriberData.name || 'Pembaca Setia',
      subscribedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured()) {
      try {
        const res = await addDoc(collection(db, 'subscribers'), payload);
        return { id: res.id, ...payload };
      } catch (e) {
        console.warn('Firestore addSubscriber error:', e);
      }
    }

    const subs = getLocal('subscribers', []);
    const newSub = { id: `sub-${Date.now()}`, ...payload };
    subs.unshift(newSub);
    setLocal('subscribers', subs);
    return newSub;
  },

  // DASHBOARD DRAG & DROP WIDGET LAYOUT MANAGEMENT
  async getDashboardWidgetLayout() {
    const DEFAULT_LAYOUT = {
      order: [
        'welcome',
        'article_management',
        'stat_categories',
        'stat_posts',
        'stat_views',
        'stat_comments',
        'seo_summary',
        'recent_activity',
        'system_status'
      ],
      columns: 10,
      sizes: {
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
        recent_comments: '5x2',
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
        seo_summary: '5x2',
        recent_activity: '5x2',
        system_status: '5x2'
      },
      rowBreaks: {}
    };

    const localSaved = getLocal('dashboard_layout_config', null);
    if (localSaved && Array.isArray(localSaved.order) && localSaved.order.length > 0) {
      return {
        order: localSaved.order,
        columns: localSaved.columns || 10,
        sizes: { ...DEFAULT_LAYOUT.sizes, ...(localSaved.sizes || {}) },
        rowBreaks: localSaved.rowBreaks || {},
        updatedAt: localSaved.updatedAt
      };
    }

    if (isFirebaseConfigured()) {
      try {
        const docRef = doc(db, 'settings', 'dashboard_layout');
        const snap = await withTimeout(getDoc(docRef), 1500);
        if (snap.exists()) {
          const data = snap.data();
          const res = {
            order: Array.isArray(data.order) && data.order.length > 0 ? data.order : DEFAULT_LAYOUT.order,
            columns: data.columns || DEFAULT_LAYOUT.columns,
            sizes: { ...DEFAULT_LAYOUT.sizes, ...(data.sizes || {}) },
            rowBreaks: data.rowBreaks || {},
            updatedAt: data.updatedAt
          };
          setLocal('dashboard_layout_config', res);
          return res;
        }
      } catch (e) {}
    }
    return DEFAULT_LAYOUT;
  },

  async saveDashboardWidgetLayout(payload) {
    const timestamp = new Date().toISOString();
    const config = Array.isArray(payload) 
      ? { order: payload, columns: 10, sizes: {}, rowBreaks: {}, updatedAt: timestamp } 
      : { ...payload, updatedAt: timestamp };

    setLocal('dashboard_layout_config', config);

    if (isFirebaseConfigured()) {
      try {
        await setDoc(doc(db, 'settings', 'dashboard_layout'), config, { merge: true });
      } catch (e) {}
    }
    return config;
  },

  async getCurrentUser() {
    if (typeof window === 'undefined') return { role: 'admin', name: 'Super Admin' };
    const localUser = getLocal('current_user', null);
    if (localUser) return localUser;

    if (isFirebaseConfigured() && auth?.currentUser) {
      try {
        const uid = auth.currentUser.uid;
        const snap = await getDoc(doc(db, 'users', uid));
        if (snap.exists()) {
          const uData = snap.data();
          setLocal('current_user', uData);
          return uData;
        }
      } catch (e) {}
    }
    return { role: 'admin', name: 'Super Admin' };
  }
};


