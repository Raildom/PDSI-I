import { supabase } from "@/models/supabase/client";
import type { Falecido } from "@/models/types";

export const falecidoModel = {
  async getDoUsuario(userId: string): Promise<Falecido | null> {
    const { data, error } = await supabase
      .from("falecidos")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data as Falecido) ?? null;
  },

  async upsert(userId: string, f: Partial<Falecido>, id?: string | null): Promise<void> {
    const payload = {
      user_id: userId,
      nome: f.nome!,
      data_nascimento: f.data_nascimento || null,
      data_falecimento: f.data_falecimento || null,
      cpf: f.cpf || null,
      parentesco: f.parentesco || null,
      observacoes: f.observacoes || null,
    };
    const { error } = id
      ? await supabase.from("falecidos").update(payload).eq("id", id)
      : await supabase.from("falecidos").insert(payload);
    if (error) throw error;
  },
};
