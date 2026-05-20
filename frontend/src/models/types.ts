/**
 * Modelos de domínio da plataforma Saint Luzia.
 * Refletem o Diagrama de Classes da documentação (seção 12).
 */

export type Role = "super_admin" | "admin" | "cliente";
export type DocStatus = "pendente" | "analise" | "aprovado" | "rejeitado";
export type ContratacaoStatus = "ativo" | "carencia" | "suspenso" | "cancelado";

export interface Usuario {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  cpf?: string | null;
  endereco?: string | null;
  funeraria_id?: string | null;
}

export interface Funeraria {
  id: string;
  razao_social: string;
  cnpj?: string | null;
  logo_url?: string | null;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  ativo: boolean;
}

export interface PlanoFunerario {
  id: string;
  titulo: string;
  descricao: string;
  valor_mensal: number;
  destaque: boolean;
  ativo: boolean;
  beneficios: string | null;
  funeraria_id?: string | null;
}

export interface Contratacao {
  id: string;
  user_id: string;
  plano_id: string;
  valor_mensal: number;
  dependentes: number;
  status: ContratacaoStatus;
  data_inicio: string;
  carencia_ate: string | null;
}

export interface Falecido {
  id: string;
  user_id: string;
  nome: string;
  data_nascimento: string | null;
  data_falecimento: string | null;
  cpf: string | null;
  parentesco: string | null;
  observacoes: string | null;
}

export interface TipoDocumento {
  id: string;
  nome: string;
  descricao: string;
  obrigatorio: boolean;
  ordem: number;
}

export interface Documento {
  id: string;
  user_id: string;
  tipo_id: string;
  arquivo_path: string | null;
  status: DocStatus;
  observacao_admin?: string | null;
  validado_por?: string | null;
  validado_em?: string | null;
  updated_at: string;
}

export interface ProcessoEtapa {
  id: string;
  user_id: string;
  titulo: string;
  subtitulo: string | null;
  ordem: number;
  concluido: boolean;
  acao: string | null;
}

export interface CartaoLuto {
  id: string;
  user_id: string;
  falecido_id: string | null;
  titulo: string;
  mensagem: string | null;
  slug: string;
  publicado: boolean;
  template_usado: string;
  url_arquivo: string | null;
  foto_path: string | null;
}
