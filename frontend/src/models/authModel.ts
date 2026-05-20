import { supabase } from "@/models/supabase/client";

export const authModel = {
  signIn: (email: string, senha: string) =>
    supabase.auth.signInWithPassword({ email, password: senha }),
  signUp: (email: string, senha: string, meta: Record<string, unknown>) =>
    supabase.auth.signUp({
      email, password: senha,
      options: { emailRedirectTo: `${window.location.origin}/login`, data: meta },
    }),
  signOut: () => supabase.auth.signOut(),
};
