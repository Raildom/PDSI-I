import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/controllers/useAuthController";
import { planoModel } from "@/models/planoModel";
import { contratacaoModel } from "@/models/contratacaoModel";
import { usuarioModel } from "@/models/usuarioModel";
import type { Contratacao, PlanoFunerario } from "@/models/types";

/** Caso de uso: listar planos disponíveis e contratar (UC03) */
export function usePlanoController() {
  const { user } = useAuth();
  const [planos, setPlanos] = useState<PlanoFunerario[]>([]);
  const [contrato, setContrato] = useState<Contratacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [contratando, setContratando] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const profile = await usuarioModel.getByUserId(user.id);
      const [p, c] = await Promise.all([
        planoModel.listAtivos(profile?.funeraria_id ?? null),
        contratacaoModel.getAtualDoUsuario(user.id),
      ]);
      setPlanos(p);
      setContrato(c);
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao carregar planos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const contratar = async (plano: PlanoFunerario) => {
    if (!user) return;
    setContratando(plano.id);
    try {
      await contratacaoModel.contratar(user.id, plano);
      toast.success("Plano contratado!");
      await refresh();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setContratando(null);
    }
  };

  return { planos, contrato, loading, contratando, contratar, refresh };
}
