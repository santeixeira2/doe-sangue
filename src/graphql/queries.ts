import { gql } from '@apollo/client';

// ─── Banco Queries ──────────────────────────
export const GET_BANCOS = gql`
  query GetBancos($page: Int!, $size: Int!) {
    bancos(page: $page, size: $size) {
      content {
        bancoId
        nomeFantasia
        endereco {
          enderecoId
          logradouro
          numero
          bairro
          cidade
          uf
          cep
        }
        estoque {
          estoqueId
          quantidadeAPos
          quantidadeANeg
          quantidadeBPos
          quantidadeBNeg
          quantidadeOPos
          quantidadeONeg
          quantidadeABPos
          quantidadeABNeg
        }
        gestor {
          gestorId
          nome
        }
      }
      totalPages
      totalElements
      number
    }
  }
`;

export const GET_BANCO = gql`
  query GetBanco($bancoId: ID!) {
    banco(bancoId: $bancoId) {
      bancoId
      nomeFantasia
      endereco {
        logradouro
        numero
        bairro
        cidade
        uf
        cep
      }
      estoque {
        estoqueId
        quantidadeAPos
        quantidadeANeg
        quantidadeBPos
        quantidadeBNeg
        quantidadeOPos
        quantidadeONeg
        quantidadeABPos
        quantidadeABNeg
      }
    }
  }
`;

// ─── Doação Queries ─────────────────────────
export const GET_DOACOES = gql`
  query GetDoacoes($page: Int!, $size: Int!) {
    doacoes(page: $page, size: $size) {
      content {
        doacaoId
        quantidade
        doador {
          doadorId
          nome
          tipoSangue
          cpf
        }
      }
      totalPages
      totalElements
      number
    }
  }
`;

export const GET_DOACAO = gql`
  query GetDoacao($doacaoId: ID!) {
    doacao(doacaoId: $doacaoId) {
      doacaoId
      quantidade
      doador {
        doadorId
        nome
        tipoSangue
        cpf
        telefone
      }
    }
  }
`;

// ─── Doador Queries ─────────────────────────
export const GET_DOADORES = gql`
  query GetDoadores($page: Int!, $size: Int!) {
    doadores(page: $page, size: $size) {
      content {
        doadorId
        nome
        tipoSangue
        cpf
        telefone
        dataNascimento
        naturalidade
        ultimaDoacao
        endereco {
          logradouro
          cidade
          uf
        }
      }
      totalPages
      totalElements
      number
    }
  }
`;

export const GET_DOADOR = gql`
  query GetDoador($doadorId: ID!) {
    doador(doadorId: $doadorId) {
      doadorId
      nome
      tipoSangue
      cpf
      telefone
      dataNascimento
      naturalidade
      ultimaDoacao
      endereco {
        enderecoId
        logradouro
        numero
        bairro
        cidade
        uf
        cep
      }
    }
  }
`;

// ─── Solicitação Queries ────────────────────
export const GET_SOLICITACOES = gql`
  query GetSolicitacoes($page: Int!, $size: Int!) {
    solicitacoes(page: $page, size: $size) {
      content {
        solicitacaoId
        quantidade
        tipoSangue
        dataPedido
        dataRecebido
        status
        bancoId
      }
      totalPages
      totalElements
      number
    }
  }
`;

// ─── Estoque Queries ────────────────────────
export const GET_ESTOQUE = gql`
  query GetEstoque($estoqueId: ID!) {
    estoque(estoqueId: $estoqueId) {
      estoqueId
      quantidadeAPos
      quantidadeANeg
      quantidadeBPos
      quantidadeBNeg
      quantidadeOPos
      quantidadeONeg
      quantidadeABPos
      quantidadeABNeg
    }
  }
`;
