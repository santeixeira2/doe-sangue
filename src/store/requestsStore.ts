import { create } from 'zustand';
import { BloodRequest, BloodType } from '../types';
import { mockApi } from '../services/mockApi';

interface RequestsState {
  requests: BloodRequest[];
  selectedRequest: BloodRequest | null;
  isLoading: boolean;
  filters: {
    bloodType?: BloodType;
    urgentOnly: boolean;
  };

  fetchRequests: () => Promise<void>;
  setFilters: (filters: { bloodType?: BloodType; urgentOnly: boolean }) => void;
  addRequest: (request: Omit<BloodRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  selectRequest: (request: BloodRequest | null) => void;
}

export const useRequestsStore = create<RequestsState>((set, get) => ({
  requests: [],
  selectedRequest: null,
  isLoading: false,
  filters: {
    urgentOnly: false,
  },

  fetchRequests: async () => {
    set({ isLoading: true });
    try {
      const requests = await mockApi.requests.getAll();
      set({ requests, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setFilters: (filters) => {
    set({ filters });
  },

  addRequest: async (requestData) => {
    try {
      await mockApi.requests.create(requestData);
      await get().fetchRequests();
    } catch (error) {
      console.error('Erro ao adicionar solicitação:', error);
    }
  },

  selectRequest: (request) => {
    set({ selectedRequest: request });
  },
}));
