import { supabase } from "@/models/supabase/client";
import type { Usuario, Role } from "@/models/types";

export const usuarioModel = {
  async getByUserId(userId: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return (data as Usuario) ?? null;
  },

  async update(userId: string, patch: Partial<Usuario>): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("user_id", userId);
    if (error) throw error;
  },

  async listByFuneraria(funerariaId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from("profiles")
      .select("user_id,nome,email,telefone,cpf,falecidos(nome),contratacoes(status)")
      .eq("funeraria_id", funerariaId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  async getRoles(userId: string): Promise<Role[]> {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (error) throw error;
    return (data ?? []).map((r) => r.role as Role);
  },

  async getFunerariaDoAdmin(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("user_roles")
      .select("funeraria_id")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    if (error) throw error;
    return data?.funeraria_id ?? null;
  },
};
