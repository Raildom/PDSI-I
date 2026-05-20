import { supabase } from "@/models/supabase/client";
import type { Funeraria } from "@/models/types";

export const funerariaModel = {
  async listAtivas(): Promise<Funeraria[]> {
    const { data, error } = await supabase
      .from("funerarias")
      .select("*")
      .eq("ativo", true)
      .order("razao_social");
    if (error) throw error;
    return (data ?? []) as Funeraria[];
  },

  async create(payload: Omit<Funeraria, "id">): Promise<Funeraria> {
    const { data, error } = await supabase
      .from("funerarias")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw error;
    return data as Funeraria;
  },

  async getById(id: string): Promise<Funeraria | null> {
    const { data, error } = await supabase
      .from("funerarias")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as Funeraria) ?? null;
  },
};
