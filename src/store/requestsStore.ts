import { create } from 'zustand';
import { apolloClient } from '../services/apolloClient';
import { GET_SOLICITACOES } from '../graphql/queries';
import { ABRIR_SOLICITACAO, ENVIAR_SOLICITACAO } from '../graphql/mutations';

// Types aligned with GraphQL schema
export type TipoSangue =
  | 'A_POS' | 'A_NEG'
  | 'B_POS' | 'B_NEG'
  | 'O_POS' | 'O_NEG'
  | 'AB_POS' | 'AB_NEG';

export type Status = 'Pendente' | 'Finalizado' | 'Cancelado';

export interface Solicitacao {
  solicitacaoId: string;
  quantidade: number;
  tipoSangue: TipoSangue;
  dataPedido: string;
  dataRecebido: string | null;
  status: Status;
  bancoId: string;
}

interface RequestsState {
  solicitacoes: Solicitacao[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  filters: {
    tipoSangue?: TipoSangue;
    status?: Status;
  };

  fetchSolicitacoes: (page?: number, size?: number) => Promise<void>;
  setFilters: (filters: { tipoSangue?: TipoSangue; status?: Status }) => void;
  abrirSolicitacao: (quantidade: number, tipoSangue: TipoSangue, bancoId: string) => Promise<void>;
  enviarSolicitacao: (bancoReceberId: string, bancoEnviarId: string) => Promise<void>;
}

export const useRequestsStore = create<RequestsState>((set, get) => ({
  solicitacoes: [],
  isLoading: false,
  totalPages: 0,
  currentPage: 0,
  filters: {},

  fetchSolicitacoes: async (page = 0, size = 20) => {
    set({ isLoading: true });
    try {
      const { data } = await apolloClient.query({
        query: GET_SOLICITACOES,
        variables: { page, size },
        fetchPolicy: 'network-only',
      });
      set({
        solicitacoes: data.solicitacoes.content,
        totalPages: data.solicitacoes.totalPages,
        currentPage: data.solicitacoes.number,
        isLoading: false,
      });
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      set({ isLoading: false });
    }
  },

  setFilters: (filters) => {
    set({ filters });
    get().fetchSolicitacoes();
  },

  abrirSolicitacao: async (quantidade, tipoSangue, bancoId) => {
    try {
      await apolloClient.mutate({
        mutation: ABRIR_SOLICITACAO,
        variables: {
          input: { quantidade, tipoSangue, bancoId: parseInt(bancoId) },
        },
      });
      await get().fetchSolicitacoes();
    } catch (error) {
      console.error('Erro ao abrir solicitação:', error);
      throw error;
    }
  },

  enviarSolicitacao: async (bancoReceberId, bancoEnviarId) => {
    try {
      await apolloClient.mutate({
        mutation: ENVIAR_SOLICITACAO,
        variables: {
          input: {
            bancoReceberId: parseInt(bancoReceberId),
            bancoEnviarId: parseInt(bancoEnviarId),
          },
        },
      });
      await get().fetchSolicitacoes();
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      throw error;
    }
  },
}));
