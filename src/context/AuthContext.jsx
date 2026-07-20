'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { isFirebaseConfigured, auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext({
  user: null,
  role: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  switchRole: () => {},
  refreshUser: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              const userData = { id: firebaseUser.uid, uid: firebaseUser.uid, ...userDoc.data() };
              setUser(userData);
              setRole(userData.role || 'user');
            } else {
              const fallbackData = { id: firebaseUser.uid, uid: firebaseUser.uid, email: firebaseUser.email, name: firebaseUser.displayName || firebaseUser.email, role: 'user' };
              setUser(fallbackData);
              setRole('user');
            }
          } catch (e) {
            console.error('Error fetching user profile:', e);
            setUser({ id: firebaseUser.uid, uid: firebaseUser.uid, email: firebaseUser.email, role: 'user' });
            setRole('user');
          }
        } else {
          setUser(null);
          setRole(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      const active = authService.getCurrentUser();
      setUser(active);
      setRole(active?.role || null);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success) {
      setUser(res.user);
      setRole(res.user.role);
    }
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res.success) {
      setUser(res.user);
      setRole(res.user.role);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setRole(null);
  };

  const switchRole = (newRole) => {
    const updated = authService.switchRole(newRole);
    setUser(updated);
    setRole(updated?.role || newRole);
  };

  const refreshUser = async () => {
    const active = await authService.getCurrentUser();
    setUser(active);
    setRole(active?.role || null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout, switchRole, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
