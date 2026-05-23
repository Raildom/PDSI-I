import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/controllers/useAuthController";
import { cartaoLutoModel } from "@/models/cartaoLutoModel";
import { falecidoModel } from "@/models/falecidoModel";

export function useCartaoLutoController() {
  const { user } = useAuth();
  const [tpl, setTpl] = useState("classico");
  const [id, setId] = useState<string | null>(null);
  const [titulo, setTitulo] = useState("");
  const [nasc, setNasc] = useState("");
  const [fal, setFal] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [publicado, setPublicado] = useState(false);
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [c, f] = await Promise.all([
        cartaoLutoModel.getDoUsuario(user.id),
        falecidoModel.getDoUsuario(user.id),
      ]);
      if (c) {
        setId(c.id); setTitulo(c.titulo); setMensagem(c.mensagem ?? "");
        setSlug(c.slug); setPublicado(c.publicado); setTpl(c.template_usado ?? "classico");
      } else if (f) {
        setTitulo(f.nome);
        if (f.data_nascimento) setNasc(f.data_nascimento);
        if (f.data_falecimento) setFal(f.data_falecimento);
      }
      setLoading(false);
    })();
  }, [user]);

  const salvar = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const finalSlug = await cartaoLutoModel.upsert(
        user.id,
        { titulo, mensagem, slug, publicado, template_usado: tpl },
        id,
      );
      setSlug(finalSlug);
      toast.success("Cartão salvo");
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  return {
    tpl, setTpl, titulo, setTitulo, nasc, setNasc, fal, setFal,
    mensagem, setMensagem, publicado, setPublicado, slug, loading, saving, salvar,
  };
}
