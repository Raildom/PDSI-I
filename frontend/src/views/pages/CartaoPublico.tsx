import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { api } from "@/models/api";
import { Logo } from "@/views/components/saint/Logo";
import { formatPtBrDate } from "@/views/lib/utils";

type CartaoPublicoData = {
  titulo: string;
  mensagem: string | null;
  slug: string;
  falecidos?: {
    nome?: string | null;
    data_nascimento?: string | null;
    data_falecimento?: string | null;
  } | null;
};

const fmt = (v?: string | null) => formatPtBrDate(v);

export default function CartaoPublico() {
  const { slug } = useParams();
  const [data, setData] = useState<CartaoPublicoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const res = await api.cartoes.publico(slug);
        setData(res as CartaoPublicoData);
      } catch (e: any) {
        setError(e?.message || "Cartão não encontrado");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        <div className="inline-flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" />
          Carregando cartão…
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <div className="max-w-lg text-center space-y-4">
          <Logo className="mx-auto" />
          <h1 className="font-serif text-3xl">Cartão indisponível</h1>
          <p className="text-muted-foreground">{error ?? "Não foi possível carregar este cartão."}</p>
          <Link to="/" className="text-sm underline text-primary">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-6">
      <article className="w-full max-w-2xl rounded-3xl border border-border bg-card shadow-elegant p-8 md:p-12 text-center">
        <div className="flex justify-center mb-7">
          <Logo />
        </div>

        <h1 className="font-serif text-4xl md:text-5xl">{data.titulo || data.falecidos?.nome || "Homenagem"}</h1>

        {(data.falecidos?.data_nascimento || data.falecidos?.data_falecimento) && (
          <p className="text-sm text-muted-foreground mt-3 uppercase tracking-wider">
            {fmt(data.falecidos?.data_nascimento)}
            {data.falecidos?.data_nascimento && data.falecidos?.data_falecimento ? " — " : ""}
            {fmt(data.falecidos?.data_falecimento)}
          </p>
        )}

        {data.mensagem && (
          <p className="italic mt-8 text-base md:text-lg leading-relaxed text-foreground/80 max-w-xl mx-auto">
            {data.mensagem}
          </p>
        )}

        <p className="text-xs tracking-widest uppercase text-muted-foreground mt-10">Saint Luzia · Homenagens</p>
      </article>
    </div>
  );
}
