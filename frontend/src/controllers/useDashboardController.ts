import { useEffect, useState } from "react";
import { useAuth } from "@/controllers/useAuthController";
import { toast } from "sonner";
import { api } from "@/models/api";

export interface Etapa { id: string; titulo: string; subtitulo: string | null; concluido: boolean; acao: string | null; ordem: number; }

export function useDashboardController() {
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [planoTitulo, setPlanoTitulo] = useState<string | null>(null);
  const [contratoId, setContratoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    if (!user) return;
    try {
      const [perfil, contrato, etapasData] = await Promise.all([
        api.perfil.get(),
        api.contratacoes.get(),
        api.processos.listar(),
      ]);
      setNome(perfil?.nome ?? "");
      if (contrato && contrato.status !== "cancelado") {
        setContratoId(contrato.id);
        setPlanoTitulo(contrato.planos?.titulo ?? null);
      } else {
        setContratoId(null);
        setPlanoTitulo(null);
      }
      setEtapas(etapasData ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { carregarDados(); }, [user]);

  const toggleEtapa = async (etapa: Etapa) => {
    if (!user) return;
    const novoStatus = !etapa.concluido;
    setEtapas(prev => prev.map(e => e.id === etapa.id ? { ...e, concluido: novoStatus } : e));
    try {
      await api.processos.atualizar(etapa.id, novoStatus);
      toast.success(novoStatus ? "Etapa marcada como concluída" : "Etapa desmarcada");
    } catch (err: any) {
      setEtapas(prev => prev.map(e => e.id === etapa.id ? { ...e, concluido: !novoStatus } : e));
      toast.error(err.message || "Erro ao atualizar etapa");
    }
  };

  const concluidos = etapas.filter((p) => p.concluido).length;
  const progresso = etapas.length ? Math.round((concluidos / etapas.length) * 100) : 0;

  return { state: { nome, etapas, planoTitulo, contratoId, loading, progresso }, actions: { toggleEtapa } };
}
