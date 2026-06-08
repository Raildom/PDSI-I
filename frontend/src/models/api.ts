/**
 * Cliente HTTP centralizado para comunicação com o backend FastAPI.
 * Adiciona automaticamente o token JWT do Supabase Auth em cada requisição.
 */

import { supabase } from "@/models/supabase/client";

const API_BASE = "/api";

async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Não definir Content-Type para FormData (o browser define automaticamente com boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // Enviar e receber cookies automaticamente
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    let message: string;
    if (Array.isArray(err.detail)) {
      // Erro de validação do Pydantic — detail é um array de objetos
      message = err.detail
        .map((e: any) => {
          const field = e.loc?.slice(1).join(" → ") ?? "";
          const msg = e.msg ?? e.message ?? JSON.stringify(e);
          return field ? `${field}: ${msg}` : msg;
        })
        .join("\n");
    } else {
      message = err.detail || `Erro ${res.status}`;
    }
    throw new Error(message);
  }

  // Para respostas blob (download)
  const ct = res.headers.get("content-type");
  const disposition = res.headers.get("content-disposition") || "";
  if ((ct && (ct.includes("image/") || ct.includes("application/octet-stream"))) || disposition.toLowerCase().includes("attachment")) {
    return res.blob() as any;
  }

  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const api = {
  // ── Perfil ────────────────────────────────────────────────────────────
  perfil: {
    get: () => request("/perfil"),
  },

  // ── Funerárias (público) ───────────────────────────────────────────
  funerarias: {
    listarAtivas: () => request("/funerarias/ativas"),
  },

  // ── Planos ────────────────────────────────────────────────────────────
  planos: {
    listar: () => request("/planos"),
    listarTodos: () => request("/planos/todos"),
    criar: (data: any) => request("/planos", { method: "POST", body: JSON.stringify(data) }),
    atualizar: (id: string, data: any) =>
      request(`/planos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },

  // ── Contratações ──────────────────────────────────────────────────────
  contratacoes: {
    get: () => request("/contratacoes"),
    contratar: (data: { plano_id: string; valor_mensal: number; carencia_ate?: string }) =>
      request("/contratacoes", { method: "POST", body: JSON.stringify(data) }),
    cancelar: () => request("/contratacoes/cancelar", { method: "POST" }),
    trocar: (data: { plano_id: string; valor_mensal: number; carencia_ate?: string }) =>
      request("/contratacoes/trocar", { method: "POST", body: JSON.stringify(data) }),
  },

  // ── Falecidos ─────────────────────────────────────────────────────────
  falecidos: {
    listar: () => request("/falecidos"),
    get: (id: string) => request(`/falecidos/${id}`),
    criar: (data: any) => request("/falecidos", { method: "POST", body: JSON.stringify(data) }),
    atualizar: (id: string, data: any) =>
      request(`/falecidos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  },

  // ── Documentos ────────────────────────────────────────────────────────
  documentos: {
    listar: () => request("/documentos"),
    upload: (tipoId: string, arquivo: File) => {
      const form = new FormData();
      form.append("tipo_id", tipoId);
      form.append("arquivo", arquivo);
      return request("/documentos/upload", { method: "POST", body: form });
    },
    validar: (id: string, data: { status: string; observacao_admin?: string }) =>
      request(`/documentos/${id}/status`, { method: "PUT", body: JSON.stringify(data) }),
    download: (id: string) => request(`/documentos/${id}/download`),
  },

  // ── Cartão de Luto ────────────────────────────────────────────────────
  cartoes: {
    get: () => request("/cartoes"),
    criar: (data: any) => request("/cartoes", { method: "POST", body: JSON.stringify(data) }),
    atualizar: (id: string, data: any) =>
      request(`/cartoes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    download: (slug: string) => request(`/cartoes/${slug}/download`, { cache: "no-store" }),
    publico: (slug: string) => request(`/cartoes/publico/${slug}`),
    uploadFoto: (arquivo: File) => {
      const form = new FormData();
      form.append("arquivo", arquivo);
      return request("/cartoes/upload-foto", { method: "POST", body: form });
    },
  },

  // ── Admin ─────────────────────────────────────────────────────────────
  admin: {
    stats: () => request("/admin/stats"),
    clientes: () => request("/admin/clientes"),
    documentos: () => request("/admin/documentos"),
  },

  // ── Super Admin ───────────────────────────────────────────────────────
  superAdmin: {
    funerarias: {
      listar: () => request("/super-admin/funerarias"),
      criar: (data: any) => request("/super-admin/funerarias", { method: "POST", body: JSON.stringify(data) }),
      atualizar: (id: string, data: any) => request(`/super-admin/funerarias/${id}`, { method: "PUT", body: JSON.stringify(data) }),
      excluir: (id: string) => request(`/super-admin/funerarias/${id}`, { method: "DELETE" }),
      credenciais: (id: string) => request(`/super-admin/funerarias/${id}/credenciais`),
    },
  },

  processos: {
    listar: () => request("/processos"),
    atualizar: (etapa_id: string, concluido: boolean) => 
      request(`/processos/${etapa_id}`, {
        method: "PUT",
        body: JSON.stringify({ concluido }),
      }),
  },
};
