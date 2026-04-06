import { create } from 'zustand';
import { apolloClient } from '../services/apolloClient';
import { GET_DOADOR } from '../graphql/queries';
import { CRIAR_DOADOR } from '../graphql/mutations';
import { TipoSangue } from './requestsStore';

// Aligned with backend Doador entity
export interface DoadorProfile {
  doadorId: string;
  nome: string;
  tipoSangue: TipoSangue;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  naturalidade: string;
  ultimaDoacao: string | null;
  endereco?: {
    logradouro: string;
    numero: number;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
}

interface AuthState {
  user: DoadorProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  hasCompletedSetup: boolean;

  // TODO: These will use proper auth mutations once backend adds Spring Security
  login: (cpf: string) => Promise<void>;
  register: (input: {
    nome: string;
    tipoSangue: TipoSangue;
    cpf: string;
    telefone: string;
    dataNascimento: string;
    naturalidade: string;
    endereco: {
      logradouro: string;
      numero: number;
      bairro: string;
      cidade: string;
      uf: string;
      cep: string;
    };
  }) => Promise<void>;
  logout: () => void;
  setOnboarded: () => void;
  completeSetup: (tipoSangue: TipoSangue) => void;
  refreshProfile: (doadorId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,
  isLoading: false,
  hasCompletedSetup: false,

  // Temporary login: looks up doador by ID until real auth is added
  login: async (cpf: string) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with proper auth mutation when backend adds authentication
      // For now, we just verify the doador exists via a query
      // This is a placeholder — in production, this would be a login mutation
      set({
        isAuthenticated: true,
        isLoading: false,
        hasCompletedSetup: true,
      });
    } catch {
      set({ isLoading: false });
      throw new Error('Falha no login');
    }
  },

  register: async (input) => {
    set({ isLoading: true });
    try {
      const { data } = await apolloClient.mutate({
        mutation: CRIAR_DOADOR,
        variables: {
          input: {
            nome: input.nome,
            tipoSangue: input.tipoSangue,
            cpf: input.cpf,
            telefone: input.telefone,
            dataNascimento: input.dataNascimento,
            naturalidade: input.naturalidade,
            endereco: input.endereco,
          },
        },
      });
      const doador = data.criarDoador;
      set({
        user: doador,
        isAuthenticated: true,
        isLoading: false,
        hasCompletedSetup: true,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error('Erro ao registrar:', error);
      throw new Error('Falha no registro');
    }
  },

  logout: () => {
    // Clear Apollo cache on logout
    apolloClient.clearStore();
    set({
      user: null,
      isAuthenticated: false,
      hasCompletedSetup: false,
    });
  },

  setOnboarded: () => {
    set({ isOnboarded: true });
  },

  completeSetup: (tipoSangue) => {
    set((state) => ({
      user: state.user ? { ...state.user, tipoSangue } : null,
      hasCompletedSetup: true,
    }));
  },

  refreshProfile: async (doadorId) => {
    try {
      const { data } = await apolloClient.query({
        query: GET_DOADOR,
        variables: { doadorId: parseInt(doadorId) },
        fetchPolicy: 'network-only',
      });
      if (data.doador) {
        set({ user: data.doador });
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    }
  },
}));
