import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/controllers/useAuthController";
import { usuarioModel } from "@/models/usuarioModel";
import { planoModel } from "@/models/planoModel";
import { documentoModel } from "@/models/documentoModel";
import { funerariaModel } from "@/models/funerariaModel";
import type { DocStatus, Funeraria, PlanoFunerario } from "@/models/types";

export function useFunerariaContext() {
  const { user } = useAuth();
  const [funerariaId, setFunerariaId] = useState<string | null>(null);
  const [funeraria, setFuneraria] = useState<Funeraria | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    (async () => {
      const fid = await usuarioModel.getFunerariaDoAdmin(user.id);
      setFunerariaId(fid);
      if (fid) setFuneraria(await funerariaModel.getById(fid));
      setLoading(false);
    })();
  }, [user]);

  return { funerariaId, funeraria, loading };
}

export function useEditorPlanosController() {
  const { funerariaId, loading: ctxLoading } = useFunerariaContext();
  const [planos, setPlanos] = useState<PlanoFunerario[]>([]);
  const [selId, setSelId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<PlanoFunerario>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    if (!funerariaId) return;
    try {
      const list = await planoModel.listByFuneraria(funerariaId);
      setPlanos(list);
      if (!selId && list[0]) { setSelId(list[0].id); setEdit(list[0]); }
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [funerariaId, selId]);

  useEffect(() => { if (!ctxLoading) refresh(); }, [ctxLoading, refresh]);

  const select = (p: PlanoFunerario) => { setSelId(p.id); setEdit(p); };
  const novo = () => { setSelId(null); setEdit({ titulo: "", descricao: "", valor_mensal: 0, destaque: false, ativo: true, beneficios: {} }); };

  const salvar = async () => {
    if (!funerariaId) { toast.error("Funerária não vinculada ao admin"); return; }
    setSaving(true);
    try {
      await planoModel.upsert({ ...edit, funeraria_id: funerariaId }, selId);
      toast.success("Plano salvo"); await refresh();
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return { planos, selId, edit, setEdit, loading: loading || ctxLoading, saving, select, novo, salvar };
}

export function useClientesController() {
  const { funerariaId, loading: ctxLoading } = useFunerariaContext();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    if (ctxLoading) return;
    if (!funerariaId) { setLoading(false); return; }
    usuarioModel.listByFuneraria(funerariaId).then((data) => {
      setRows(data.map((p: any) => ({
        user_id: p.user_id, nome: p.nome, email: p.email,
        falecido: p.falecidos?.[0]?.nome ?? null,
        status_contrato: p.contratacoes?.[0]?.status ?? null,
      })));
      setLoading(false);
    });
  }, [ctxLoading, funerariaId]);

  const filtered = rows.filter((r) =>
    [r.nome, r.email, r.falecido].some((v) => v?.toLowerCase().includes(busca.toLowerCase())));

  return { rows, filtered, busca, setBusca, loading };
}

export function useValidacaoDocsController() {
  const { user } = useAuth();
  const { funerariaId, loading: ctxLoading } = useFunerariaContext();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const data = await documentoModel.listFila();
      const filtered = funerariaId
        ? data.filter((d: any) => d.profiles?.funeraria_id === funerariaId)
        : data;
      setDocs(filtered);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [funerariaId]);

  useEffect(() => { if (!ctxLoading) refresh(); }, [ctxLoading, refresh]);

  const validar = async (docId: string, status: DocStatus) => {
    if (!user) return;
    setActing(docId);
    try {
      await documentoModel.validar(docId, status, user.id);
      toast.success(status === "aprovado" ? "Documento aprovado" : "Documento rejeitado");
      await refresh();
    } catch (e: any) { toast.error(e.message); }
    finally { setActing(null); }
  };

  const baixar = async (path: string | null) => {
    if (!path) return;
    try {
      const url = await documentoModel.signedUrl(path);
      window.open(url, "_blank");
    } catch (e: any) { toast.error(e.message); }
  };

  return { docs, loading: loading || ctxLoading, acting, validar, baixar };
}

export function useAdminDashboardController() {
  const { funerariaId, loading: ctxLoading } = useFunerariaContext();
  const [stats, setStats] = useState({ pendentes: 0, planos: 0, clientes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ctxLoading) return;
    if (!funerariaId) { setLoading(false); return; }
    (async () => {
      const [planos, clientes, fila] = await Promise.all([
        planoModel.listByFuneraria(funerariaId),
        usuarioModel.listByFuneraria(funerariaId),
        documentoModel.listFila(),
      ]);
      const pendentes = fila.filter((d: any) => d.profiles?.funeraria_id === funerariaId).length;
      setStats({
        pendentes,
        planos: planos.filter((p) => p.ativo).length,
        clientes: clientes.length,
      });
      setLoading(false);
    })();
  }, [ctxLoading, funerariaId]);

  return { stats, loading };
}
