import { useEffect, useState } from "react";
import { useAuth } from "@/controllers/useAuthController";
import { toast } from "sonner";
import { api } from "@/models/api";
import { supabase } from "@/models/supabase/client";
import { formatPtBrDate } from "@/views/lib/utils";
import { slugify } from "@/models/cartaoLutoModel";

export function useCartaoController() {
  const { user } = useAuth();
  const [tpl, setTpl] = useState("classico");
  const [id, setId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [nasc, setNasc] = useState("");
  const [fal, setFal] = useState("");
  const [falecidoId, setFalecidoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [publicado, setPublicado] = useState(false);
  const [fotoPath, setFotoPath] = useState<string | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [cartao, falecidos] = await Promise.all([api.cartoes.get(), api.falecidos.listar()]);
        if (cartao) {
          setId(cartao.id); setTitulo(cartao.titulo); setMensagem(cartao.mensagem ?? "");
          setSlug(cartao.slug); setPublicado(cartao.publicado);
          setFotoPath(cartao.foto_path ?? null);
          setFalecidoId(cartao.falecido_id ?? null);
          if (cartao.template_usado) setTpl(cartao.template_usado);
          if (cartao.foto_path) {
            const { data } = supabase.storage.from("cartoes").getPublicUrl(cartao.foto_path);
            setFotoUrl(data.publicUrl);
          }
        }

        if (falecidos?.[0]) {
          const selected = cartao?.falecido_id
            ? falecidos.find((f: any) => f.id === cartao.falecido_id)
            : falecidos[0];
          if (selected) {
            if (!cartao) setTitulo(selected.nome);
            setFalecidoId(selected.id);
            if (selected.data_nascimento) setNasc(selected.data_nascimento);
            if (selected.data_falecimento) setFal(selected.data_falecimento);
          }
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [user]);

  const salvar = async (opts?: { silent?: boolean }): Promise<string | null> => {
    if (!user) return null;
    setSaving(true);
    try {
      let currentFalecidoId = falecidoId;
      if (!currentFalecidoId && (nasc || fal || titulo)) {
        try {
          const novo = await api.falecidos.criar({ 
            nome: titulo || "Desconhecido", 
            data_nascimento: nasc || null, 
            data_falecimento: fal || null 
          });
          currentFalecidoId = novo.id;
          setFalecidoId(currentFalecidoId);
        } catch (e) {
          console.error("Erro ao criar falecido automático", e);
        }
      } else if (currentFalecidoId) {
        try {
          await api.falecidos.atualizar(currentFalecidoId, {
            nome: titulo || undefined,
            data_nascimento: nasc || null,
            data_falecimento: fal || null,
          });
        } catch (e) {
          console.error("Erro ao atualizar falecido automático", e);
        }
      }

      const finalSlug = slug || `${slugify(titulo)}-${Date.now().toString(36)}`;
      const payload = {
        titulo,
        mensagem,
        slug: finalSlug,
        publicado,
        foto_path: fotoPath,
        falecido_id: currentFalecidoId,
        template_usado: tpl,
      };
      if (id) {
        await api.cartoes.atualizar(id, payload);
      } else {
        const result = await api.cartoes.criar(payload);
        setId(result.id);
      }
      setSlug(finalSlug);
      if (!opts?.silent) toast.success("Cartão salvo");
      return finalSlug;
    } catch (e: any) {
      if (!opts?.silent) toast.error(e.message);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const baixarCartao = async () => {
    setDownloading(true);
    try {
      const finalSlug = await salvar({ silent: true });
      if (!finalSlug) return;
      const blob = await api.cartoes.download(finalSlug);
      if (!(blob instanceof Blob)) throw new Error("Resposta inválida ao baixar o cartão");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Cartão de luto";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Cartão baixado com sucesso!");
    } catch (e: any) { toast.error(e.message); }
    setDownloading(false);
  };

  const uploadFoto = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const result = await api.cartoes.uploadFoto(file);
      const path = result?.path as string | undefined;
      if (!path) throw new Error("Falha ao receber caminho da foto");
      setFotoPath(path);
      const { data } = supabase.storage.from("cartoes").getPublicUrl(path);
      setFotoUrl(data.publicUrl);
      toast.success("Foto anexada ao cartão");
    } catch (e: any) {
      toast.error(e.message ?? "Erro ao enviar foto");
    }
    setUploading(false);
  };

  const fmt = (d: string) => formatPtBrDate(d);

  return {
    state: { tpl, id, titulo, nasc, fal, mensagem, publicado, slug, fotoUrl, loading, saving, downloading, uploading },
    actions: { setTpl, setTitulo, setNasc, setFal, setMensagem, setPublicado, salvar, baixarCartao, uploadFoto, fmt }
  };
}
