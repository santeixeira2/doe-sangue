import { create } from 'zustand';
import { DonorProfile, BloodType } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthState {
  user: DonorProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  hasCompletedSetup: boolean;

  login: (cpf: string) => Promise<void>;
  logout: () => void;
  setOnboarded: () => void;
  completeSetup: (bloodType: BloodType) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: false,
  hasCompletedSetup: false,

  login: async (cpf: string) => {
    set({ isLoading: true });
    try {
      const user = await mockApi.auth.login(cpf);
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        hasCompletedSetup: !!user.bloodType 
      });
    } catch {
      set({ isLoading: false });
      throw new Error('Login failed');
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, hasCompletedSetup: false });
  },

  setOnboarded: () => {
    set({ isOnboarded: true });
  },

  completeSetup: (bloodType) => {
    set((state) => ({
      user: state.user ? { ...state.user, bloodType } : null,
      hasCompletedSetup: true,
    }));
  },
}));
