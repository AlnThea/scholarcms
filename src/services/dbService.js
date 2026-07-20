import { isFirebaseConfigured, db } from '@/lib/firebase';
import { INITIAL_CATEGORIES, INITIAL_POSTS, INITIAL_COMMENTS } from '@/constants/mockData';
import {
  collection, doc, getDocs, getDoc, addDoc, setDoc, deleteDoc, updateDoc, query, where, orderBy, increment
} from 'firebase/firestore';

// Clean up any stale demo data in localStorage on app load (if present).
if (typeof window !== 'undefined') {
  Object.keys(localStorage).forEach(k => {
    if (k.startsWith('scholarcms_')) {
      localStorage.removeItem(k);
    }
  });
}

// LocalStorage Helper for Demo Mode (disabled)
function getLocal(key, defaultData) {
  return defaultData;
}

function setLocal(key, data) {
  // No-op – demo localStorage disabled.
}

// PUBLIC API DATA SERVICE
export const dbService = {
  isRealFirebase() {
    return isFirebaseConfigured();
  },

  // POSTS
  async getPosts(options = {}) {
    const { category, search, status, limit } = options;

    if (isFirebaseConfigured()) {
      try {
        const postsRef = collection(db, 'posts');
        let q = query(postsRef, orderBy('publishedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        let posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (status && status !== 'all') posts = posts.filter(p => p.status === status);
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

    // Demo Mode Local Storage
    let posts = getLocal('posts', INITIAL_POSTS);
    if (status && status !== 'all') {
      posts = posts.filter(p => p.status === status);
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
    if (isFirebaseConfigured()) {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef, where('slug', '==', slug));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const docSnap = snap.docs[0];
          const post = { id: docSnap.id, ...docSnap.data() };
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
      posts[postIndex].views = (posts[postIndex].views || 0) + 1;
      setLocal('posts', posts);
      return posts[postIndex];
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
    const postPayload = {
      title: postData.title || 'Untitled Post',
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: postData.excerpt || '',
      category: postData.category || 'Web Development',
      tags: Array.isArray(postData.tags) ? postData.tags : (postData.tags || '').split(',').map(t => t.trim()).filter(Boolean),
      featuredImage: postData.featuredImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      status: postData.status || 'published',
      readTime: postData.readTime || '5 min read',
      author: postData.author || { name: 'Ernst Senior Dev', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', role: 'CMS Administrator' },
      blocks: postData.blocks || [],
      updatedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured()) {
      try {
        if (postData.id) {
          await updateDoc(doc(db, 'posts', postData.id), postPayload);
          return { id: postData.id, ...postPayload };
        } else {
          postPayload.publishedAt = new Date().toISOString();
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
      publishedAt: new Date().toISOString(),
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
  }
};
