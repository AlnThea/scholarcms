import { isFirebaseConfigured, db } from '@/lib/firebase';
import { INITIAL_COMMENTS } from '@/constants/mockData';
import { collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getLocal, setLocal } from './dbHelpers';

export const commentService = {
  async getComments(postId) {
    if (isFirebaseConfigured()) {
      try {
        let q;
        if (postId) {
          q = query(collection(db, 'comments'), where('postId', '==', postId));
        } else {
          q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
        }
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.warn('Firestore getComments error:', e);
      }
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
        return true;
      } catch (e) {
        console.warn('Firestore updateCommentStatus error:', e);
      }
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
        return true;
      } catch (e) {
        console.warn('Firestore deleteComment error:', e);
      }
    }
    let comms = getLocal('comments', INITIAL_COMMENTS);
    comms = comms.filter(c => c.id !== commentId);
    setLocal('comments', comms);
    return true;
  }
};
