import { supabase } from "@/models/supabase/client";
import type { PlanoFunerario } from "@/models/types";

export const planoModel = {
  async listAtivos(funerariaId?: string | null): Promise<PlanoFunerario[]> {
    let q = supabase.from("planos").select("*").eq("ativo", true);
    if (funerariaId) q = q.eq("funeraria_id", funerariaId);
    const { data, error } = await q.order("destaque", { ascending: false });
    if (error) throw error;
    return (data ?? []) as PlanoFunerario[];
  },

  async listByFuneraria(funerariaId: string): Promise<PlanoFunerario[]> {
    const { data, error } = await supabase
      .from("planos")
      .select("*")
      .eq("funeraria_id", funerariaId)
      .order("destaque", { ascending: false });
    if (error) throw error;
    return (data ?? []) as PlanoFunerario[];
  },

  async getById(id: string): Promise<PlanoFunerario | null> {
    const { data, error } = await supabase
      .from("planos").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return (data as PlanoFunerario) ?? null;
  },

  async upsert(p: Partial<PlanoFunerario> & { funeraria_id: string }, id?: string | null) {
    const payload = {
      titulo: p.titulo!,
      descricao: p.descricao!,
      valor_mensal: Number(p.valor_mensal ?? 0),
      destaque: !!p.destaque,
      ativo: p.ativo ?? true,
      beneficios: (p.beneficios ?? {}) as any,
      funeraria_id: p.funeraria_id,
    };
    const { error } = id
      ? await supabase.from("planos").update(payload).eq("id", id)
      : await supabase.from("planos").insert(payload);
    if (error) throw error;
  },
};
