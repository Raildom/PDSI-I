import { supabase } from "@/models/supabase/client";
import type { Contratacao, PlanoFunerario } from "@/models/types";

export const contratacaoModel = {
  async getAtualDoUsuario(userId: string): Promise<Contratacao | null> {
    const { data, error } = await supabase
      .from("contratacoes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return (data as Contratacao) ?? null;
  },

  async getAtualComPlano(userId: string) {
    const { data, error } = await supabase
      .from("contratacoes")
      .select("id, plano:planos(titulo)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async contratar(userId: string, plano: PlanoFunerario): Promise<void> {
    const carencia = new Date();
    carencia.setDate(carencia.getDate() + 90);
    const { error } = await supabase.from("contratacoes").insert({
      user_id: userId,
      plano_id: plano.id,
      valor_mensal: plano.valor_mensal,
      status: "carencia",
      carencia_ate: carencia.toISOString().slice(0, 10),
    });
    if (error) throw error;
  },
};
