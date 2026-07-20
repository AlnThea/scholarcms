import { isFirebaseConfigured, auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged 
} from 'firebase/auth';
import { 
  collection, doc, getDoc, setDoc, getDocs, updateDoc 
} from 'firebase/firestore';

let activeUser = null;







function getLocalActiveUser() {
  return activeUser;
}

function setLocalActiveUser(user) {
  activeUser = user;
}

export const authService = {
  async getCurrentUser() {
    if (isFirebaseConfigured() && auth?.currentUser) {
      const uid = auth.currentUser.uid;
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { id: uid, uid, ...userDoc.data() };
      }
    }
    return null;
  },

  async login(email, password) {
    if (isFirebaseConfigured() && auth) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          const user = { id: uid, uid, ...userDoc.data() };
          setLocalActiveUser(user);
          return { success: true, user };
        }
        return { success: false, error: 'User profile not found' };
      } catch (error) {
        console.error('Firebase login error:', error.message);
        let errorMsg = error.message;
        if (error.code === 'auth/configuration-not-found' || error.message?.includes('auth/configuration-not-found')) {
          errorMsg = 'Firebase Auth belum diaktifkan di Firebase Console. Buka Firebase Console -> Authentication -> Sign-in method, lalu aktifkan "Email/Password".';
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
          errorMsg = 'Email atau kata sandi yang Anda masukkan salah.';
        }
        return { success: false, error: errorMsg };
      }
    }
    return { success: false, error: 'Firebase not configured' };
  },

  async register({ name, email, password, role = 'user' }) {
    if (isFirebaseConfigured() && auth) {
      try {
        // Cek apakah ini pengguna pertama di database
        let assignedRole = role;
        try {
          const usersSnap = await getDocs(collection(db, 'users'));
          if (usersSnap.empty) {
            assignedRole = 'admin';
          }
        } catch (e) {
          console.warn('Checks for first user failed, using default role:', e);
        }

        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;
        const newUserProfile = {
          id: uid,
          uid: uid,
          name,
          email,
          role: assignedRole,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', uid), newUserProfile);
        setLocalActiveUser(newUserProfile);
        return { success: true, user: newUserProfile };
      } catch (error) {
        console.error('Firebase register error:', error.message);
        let errorMsg = error.message;
        if (error.code === 'auth/configuration-not-found' || error.message?.includes('auth/configuration-not-found')) {
          errorMsg = 'Firebase Auth belum diaktifkan di Firebase Console. Buka Firebase Console -> Authentication -> Sign-in method, lalu aktifkan "Email/Password".';
        } else if (error.code === 'auth/email-already-in-use') {
          errorMsg = 'Alamat email ini sudah terdaftar. Silakan gunakan email lain atau masuk.';
        } else if (error.code === 'auth/weak-password') {
          errorMsg = 'Kata sandi terlalu lemah. Silakan gunakan minimal 6 karakter.';
        } else if (error.code === 'permission-denied' || error.message?.includes('permissions') || error.message?.includes('permission')) {
          errorMsg = 'Akses Firestore ditolak (Missing or insufficient permissions). Buka Firebase Console -> Firestore Database -> Rules, lalu perbarui Security Rules agar mengizinkan akses simpan.';
        }
        return { success: false, error: errorMsg };
      }
    }
    return { success: false, error: 'Firebase not configured' };
  },

  async logout() {
    if (isFirebaseConfigured() && auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.error('Firebase logout error:', e);
      }
    }
    // Clear active user reference
    setLocalActiveUser(null);
    return true;
  },

  async getUsers() {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        }
        return [];
      } catch (e) {
        console.error('Firebase getUsers error:', e);
        return [];
      }
    }
    // Firebase not configured, return empty list.
    return [];
  },

  async updateUserRole(userId, newRole) {
    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'users', userId), { role: newRole });
        return true;
      } catch (e) {
        console.error('Firebase updateUserRole error:', e);
        return false;
      }
    }
    // Firebase not configured, cannot update role.
    return false;
  },

  async switchRole(role) {
    // Fetch first user with the specified role from Firestore.
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const matching = snap.docs.find(d => d.data().role === role);
        if (matching) {
          const user = { id: matching.id, ...matching.data() };
          setLocalActiveUser(user);
          return user;
        }
      } catch (e) {
        console.error('Firebase switchRole error:', e);
      }
    }
    // Fallback: no user found.
    return null;
  }
};
