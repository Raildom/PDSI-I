import { supabase } from "@/models/supabase/client";
import type { Documento, DocStatus, TipoDocumento } from "@/models/types";

export const documentoModel = {
  async listTipos(): Promise<TipoDocumento[]> {
    const { data, error } = await supabase.from("tipos_documento").select("*").order("ordem");
    if (error) throw error;
    return (data ?? []) as TipoDocumento[];
  },
  async listDoUsuario(userId: string): Promise<Documento[]> {
    const { data, error } = await supabase
      .from("documentos")
      .select("id,user_id,tipo_id,status,updated_at,arquivo_path")
      .eq("user_id", userId);
    if (error) throw error;
    return (data ?? []) as Documento[];
  },
  async listFila(): Promise<any[]> {
    const { data, error } = await supabase
      .from("documentos")
      .select("id,user_id,status,arquivo_path,updated_at,tipos_documento(nome,descricao),profiles!inner(nome,email,funeraria_id)")
      .in("status", ["analise", "pendente", "rejeitado"])
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  async upload(userId: string, tipoId: string, file: File): Promise<string> {
    const path = `${userId}/${tipoId}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("documentos").upload(path, file, { upsert: false });
    if (error) throw error;
    return path;
  },
  async registrarUpload(userId: string, tipoId: string, path: string, existingId?: string): Promise<void> {
    const payload = { user_id: userId, tipo_id: tipoId, arquivo_path: path, status: "analise" as const };
    const { error } = existingId
      ? await supabase.from("documentos").update(payload).eq("id", existingId)
      : await supabase.from("documentos").insert(payload);
    if (error) throw error;
  },
  async validar(id: string, status: DocStatus, validadoPor: string): Promise<void> {
    const { error } = await supabase.from("documentos")
      .update({ status, validado_por: validadoPor, validado_em: new Date().toISOString() })
      .eq("id", id);
    if (error) throw error;
  },
  async signedUrl(path: string): Promise<string> {
    const { data, error } = await supabase.storage.from("documentos").createSignedUrl(path, 60);
    if (error) throw error;
    return data.signedUrl;
  },
};
