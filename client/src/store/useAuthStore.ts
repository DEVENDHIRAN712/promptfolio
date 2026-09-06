import { create } from 'zustand';
import api from '@/lib/axios';

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified?: boolean;
}

interface AuthState {
  user: UserInfo | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserInfo, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedToken = localStorage.getItem('promptfolio_token');
  const storedUser = localStorage.getItem('promptfolio_user');

  return {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    isLoading: true,

    setAuth: (user, token) => {
      localStorage.setItem('promptfolio_token', token);
      localStorage.setItem('promptfolio_user', JSON.stringify(user));
      set({ user, token, isAuthenticated: true, isLoading: false });
    },

    logout: async () => {
      try {
        await api.post('/auth/logout');
      } catch {
        // ignore
      } finally {
        localStorage.removeItem('promptfolio_token');
        localStorage.removeItem('promptfolio_user');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    },

    checkAuth: async () => {
      const token = localStorage.getItem('promptfolio_token');
      if (!token) {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        set({ isLoading: true });
        const res = await api.get('/auth/me');
        if (res.data && res.data.user) {
          localStorage.setItem('promptfolio_user', JSON.stringify(res.data.user));
          set({
            user: res.data.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          throw new Error('Invalid user payload');
        }
      } catch {
        localStorage.removeItem('promptfolio_token');
        localStorage.removeItem('promptfolio_user');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      }
    },
  };
});
