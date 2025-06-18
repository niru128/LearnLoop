// src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist((set) => (
    {
      token: null,
      user: null,
      loading: true,
      setAuth: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setLoading: (loading) => set({ loading }),
    }
  ),
    {
      name: 'auth-storage', // key in localStorage
      getStorage: () => localStorage, // use sessionStorage if needed
    })
);

export default useAuthStore;
