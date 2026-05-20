import { supabase } from "@/models/supabase/client";
import type { ProcessoEtapa } from "@/models/types";

export const processoModel = {
  async listDoUsuario(userId: string): Promise<ProcessoEtapa[]> {
    const { data, error } = await supabase
      .from("processo_etapas").select("*").eq("user_id", userId).order("ordem");
    if (error) throw error;
    return (data ?? []) as ProcessoEtapa[];
  },
};
