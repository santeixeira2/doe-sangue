// ─── Enums (aligned with GraphQL schema) ───────────────

export type TipoSangue =
  | 'A_POS' | 'A_NEG'
  | 'B_POS' | 'B_NEG'
  | 'O_POS' | 'O_NEG'
  | 'AB_POS' | 'AB_NEG';

export type Status = 'Pendente' | 'Finalizado' | 'Cancelado';

export type Cargos = 'Paciente' | 'Doador' | 'Funcionario' | 'Gestor';

export type UF =
  | 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES'
  | 'GO' | 'MA' | 'MT' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR'
  | 'PE' | 'PI' | 'RJ' | 'RN' | 'RO' | 'RR' | 'SC' | 'SP'
  | 'SE' | 'TO';

// ─── Display helpers ───────────────────────────────────

/** Maps GraphQL enum values to user-friendly display labels */
export const TIPO_SANGUE_LABELS: Record<TipoSangue, string> = {
  A_POS: 'A+',
  A_NEG: 'A-',
  B_POS: 'B+',
  B_NEG: 'B-',
  O_POS: 'O+',
  O_NEG: 'O-',
  AB_POS: 'AB+',
  AB_NEG: 'AB-',
};

export const STATUS_LABELS: Record<Status, string> = {
  Pendente: 'Pendente',
  Finalizado: 'Finalizado',
  Cancelado: 'Cancelado',
};

// ─── Entities (aligned with GraphQL types) ──────────────

export interface Endereco {
  enderecoId: string;
  logradouro: string;
  numero: number;
  bairro: string;
  cidade: string;
  uf: UF;
  cep: string;
}

export interface Estoque {
  estoqueId: string;
  quantidadeAPos: number;
  quantidadeANeg: number;
  quantidadeBPos: number;
  quantidadeBNeg: number;
  quantidadeOPos: number;
  quantidadeONeg: number;
  quantidadeABPos: number;
  quantidadeABNeg: number;
}

export interface Doador {
  doadorId: string;
  nome: string;
  tipoSangue: TipoSangue;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  naturalidade: UF;
  endereco: Endereco;
  ultimaDoacao: string | null;
}

export interface Doacao {
  doacaoId: string;
  quantidade: number;
  doador: Doador;
}

export interface Usuario {
  usuarioId: string;
  login: string;
  cargo: Cargos;
}

export interface Funcionario {
  funcionarioId: string;
  nome: string;
  tipoSangue: TipoSangue;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  naturalidade: UF;
  endereco: Endereco;
  salario: number;
  setor: string;
  dataAdmissao: string;
  usuario: Usuario;
}

export interface Gestor {
  gestorId: string;
  nome: string;
  tipoSangue: TipoSangue;
  cpf: string;
}

export interface Banco {
  bancoId: string;
  nomeFantasia: string;
  endereco: Endereco;
  estoque: Estoque;
  gestor: Gestor | null;
}

export interface Solicitacao {
  solicitacaoId: string;
  quantidade: number;
  tipoSangue: TipoSangue;
  dataPedido: string;
  dataRecebido: string | null;
  status: Status;
  bancoId: string;
}

// ─── Paginated responses ────────────────────────────────

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

// ─── Input types (for mutations) ────────────────────────

export interface EnderecoInput {
  logradouro: string;
  numero: number;
  bairro: string;
  cidade: string;
  uf: UF;
  cep: string;
}

export interface EstoqueInput {
  quantidadeAPos: number;
  quantidadeANeg: number;
  quantidadeBPos: number;
  quantidadeBNeg: number;
  quantidadeOPos: number;
  quantidadeONeg: number;
  quantidadeABPos: number;
  quantidadeABNeg: number;
}

export interface BancoInput {
  nomeFantasia: string;
  endereco: EnderecoInput;
  estoque: EstoqueInput;
}

export interface DoacaoInput {
  quantidade: number;
  cpf: string;
  bancoId: string;
}

export interface DoadorInput {
  nome: string;
  tipoSangue: TipoSangue;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  naturalidade: UF;
  endereco: EnderecoInput;
}

export interface SolicitacaoInput {
  quantidade: number;
  tipoSangue: TipoSangue;
  bancoId: string;
}

// ─── Client-only types (not in backend yet) ─────────────

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'urgent_request' | 'donation_reminder' | 'thank_you' | 'general';
  isRead: boolean;
  createdAt: string;
  relatedRequestId?: string;
}

export interface EligibilityQuestion {
  id: string;
  question: string;
  disqualifyOnYes: boolean;
}
