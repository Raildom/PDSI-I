import { supabase } from "@/models/supabase/client";
import type { CartaoLuto } from "@/models/types";

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const cartaoLutoModel = {
  async getDoUsuario(userId: string): Promise<CartaoLuto | null> {
    const { data, error } = await supabase
      .from("cartoes_luto").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return (data as CartaoLuto) ?? null;
  },
  async upsert(userId: string, c: Partial<CartaoLuto>, id?: string | null): Promise<string> {
    const slug = c.slug || `${slugify(c.titulo ?? "cartao")}-${Date.now().toString(36)}`;
    const payload = {
      user_id: userId,
      titulo: c.titulo!,
      mensagem: c.mensagem ?? null,
      slug,
      publicado: !!c.publicado,
      template_usado: c.template_usado ?? "classico",
    };
    const { error } = id
      ? await supabase.from("cartoes_luto").update(payload).eq("id", id)
      : await supabase.from("cartoes_luto").insert(payload);
    if (error) throw error;
    return slug;
  },
};
