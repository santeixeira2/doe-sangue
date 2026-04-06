import { gql } from '@apollo/client';

// ─── Banco Mutations ────────────────────────
export const CRIAR_BANCO = gql`
  mutation CriarBanco($input: BancoInput!) {
    criarBanco(input: $input) {
      bancoId
      nomeFantasia
      endereco {
        logradouro
        cidade
        uf
      }
      estoque {
        estoqueId
      }
    }
  }
`;

export const EDITAR_BANCO = gql`
  mutation EditarBanco($bancoId: ID!, $input: BancoUpdateInput!) {
    editarBanco(bancoId: $bancoId, input: $input) {
      bancoId
      nomeFantasia
      endereco {
        logradouro
        cidade
        uf
      }
    }
  }
`;

export const EXCLUIR_BANCO = gql`
  mutation ExcluirBanco($bancoId: ID!) {
    excluirBanco(bancoId: $bancoId)
  }
`;

// ─── Doação Mutations ───────────────────────
export const CRIAR_DOACAO = gql`
  mutation CriarDoacao($input: DoacaoInput!) {
    criarDoacao(input: $input) {
      doacaoId
      quantidade
      doador {
        doadorId
        nome
        tipoSangue
      }
    }
  }
`;

export const EDITAR_DOACAO = gql`
  mutation EditarDoacao($doacaoId: ID!, $input: DoacaoInput!) {
    editarDoacao(doacaoId: $doacaoId, input: $input) {
      doacaoId
      quantidade
      doador {
        doadorId
        nome
      }
    }
  }
`;

export const EXCLUIR_DOACAO = gql`
  mutation ExcluirDoacao($doacaoId: ID!) {
    excluirDoacao(doacaoId: $doacaoId)
  }
`;

// ─── Doador Mutations ───────────────────────
export const CRIAR_DOADOR = gql`
  mutation CriarDoador($input: DoadorInput!) {
    criarDoador(input: $input) {
      doadorId
      nome
      tipoSangue
      cpf
      telefone
      dataNascimento
      naturalidade
      endereco {
        logradouro
        cidade
        uf
      }
    }
  }
`;

// ─── Solicitação Mutations ──────────────────
export const ABRIR_SOLICITACAO = gql`
  mutation AbrirSolicitacao($input: SolicitacaoInput!) {
    abrirSolicitacao(input: $input) {
      solicitacaoId
      quantidade
      tipoSangue
      status
      dataPedido
    }
  }
`;

export const ENVIAR_SOLICITACAO = gql`
  mutation EnviarSolicitacao($input: EnvioSolicitacaoInput!) {
    enviarSolicitacao(input: $input)
  }
`;

// ─── Funcionário Mutations ──────────────────
export const CRIAR_FUNCIONARIO = gql`
  mutation CriarFuncionario($input: FuncionarioInput!) {
    criarFuncionario(input: $input) {
      funcionarioId
      nome
      setor
    }
  }
`;

export const EDITAR_FUNCIONARIO = gql`
  mutation EditarFuncionario($funcionarioId: ID!, $input: FuncionarioInput!) {
    editarFuncionario(funcionarioId: $funcionarioId, input: $input) {
      funcionarioId
      nome
      setor
    }
  }
`;

export const EXCLUIR_FUNCIONARIO = gql`
  mutation ExcluirFuncionario($funcionarioId: ID!) {
    excluirFuncionario(funcionarioId: $funcionarioId)
  }
`;

// ─── Usuário Mutations ──────────────────────
export const CRIAR_USUARIO = gql`
  mutation CriarUsuario($input: UsuarioInput!) {
    criarUsuario(input: $input) {
      usuarioId
      login
      cargo
    }
  }
`;
