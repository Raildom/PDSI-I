import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

let _client: SupabaseClient<Database> | null = null;

export function supabaseEnvOk(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_PUBLISHABLE_KEY;
}

export function getSupabase(): SupabaseClient<Database> {
  if (_client) return _client;
  if (!supabaseEnvOk()) {
    throw new Error(
      "Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY em frontend/.env.local e reinicie o npm run dev."
    );
  }
  _client = createClient<Database>(SUPABASE_URL!, SUPABASE_PUBLISHABLE_KEY!, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return _client;
}

// Mantém compatibilidade com imports existentes: `import { supabase } from ...`
export const supabase: SupabaseClient<Database> = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = getSupabase() as any;
    return client[prop];
  },
}) as SupabaseClient<Database>;
