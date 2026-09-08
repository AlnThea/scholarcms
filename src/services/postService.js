import { isFirebaseConfigured, db } from '@/lib/firebase';
import { INITIAL_POSTS } from '@/constants/mockData';
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, increment
} from 'firebase/firestore';
import { getLocal, setLocal } from './dbHelpers';
// Membutuhkan dbService untuk categoryService fallback (agar refactor aman step-by-step)
import { dbService } from './dbService'; 

export const postService = {
  async getPosts(options = {}) {
    const { category, search, status, limit: limitCount } = options;
    const now = new Date().toISOString();

    const processScheduledPost = (p) => {
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
          posts = posts.filter(p => p.status === 'published' && (!p.publishedAt || p.publishedAt <= now));
        }

        if (category && category !== 'All') posts = posts.filter(p => p.category === category);
        if (search) {
          const s = search.toLowerCase();
          posts = posts.filter(p => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s));
        }
        if (limitCount) posts = posts.slice(0, limitCount);
        return posts;
      } catch (err) {
        console.warn('Firestore error, falling back to local:', err);
      }
    }

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
    if (limitCount) {
      posts = posts.slice(0, limitCount);
    }
    return posts;
  },

  async getPostBySlug(slug, incrementView = true) {
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
            if (incrementView) {
              await updateDoc(doc(db, 'posts', docSnap.id), { views: increment(1) });
            }
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
      if (incrementView) {
        post.views = (post.views || 0) + 1;
        setLocal('posts', posts);
      }
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

    let finalStatus = postData.status || 'published';
    if (finalStatus !== 'draft' && pubAt > now) {
      finalStatus = 'scheduled';
    }

    const postPayload = {
      title: postData.title || 'Untitled Post',
      slug: postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: postData.excerpt || '',
      category: postData.category || 'Web Development',
      subCategory: postData.subCategory || '',
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

    if (postPayload.category) {
      dbService.ensureCategoryExists(postPayload.category, '').catch(err => console.error(err));
    }
    if (postPayload.subCategory) {
      dbService.ensureCategoryExists(postPayload.subCategory, postPayload.category).catch(err => console.error(err));
    }

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
  }
};
