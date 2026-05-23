import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/controllers/useAuthController";
import { documentoModel } from "@/models/documentoModel";
import type { Documento, TipoDocumento } from "@/models/types";

export function useDocumentosController() {
  const { user } = useAuth();
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [docs, setDocs] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      const [t, d] = await Promise.all([documentoModel.listTipos(), documentoModel.listDoUsuario(user.id)]);
      setTipos(t); setDocs(d);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const upload = async (tipoId: string, file: File) => {
    if (!user) return;
    setUploadingId(tipoId);
    try {
      const path = await documentoModel.upload(user.id, tipoId, file);
      const existing = docs.find((d) => d.tipo_id === tipoId);
      await documentoModel.registrarUpload(user.id, tipoId, path, existing?.id);
      toast.success("Documento enviado para análise");
      await refresh();
    } catch (e: any) { toast.error(e.message); }
    finally { setUploadingId(null); }
  };

  const total = tipos.length;
  const aprovados = docs.filter((d) => d.status === "aprovado").length;
  const progresso = total ? Math.round((aprovados / total) * 100) : 0;

  return { tipos, docs, loading, uploadingId, upload, fileRefs, total, aprovados, progresso };
}
