import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/views/components/ui/button";
import { useAuth } from "@/controllers/useAuthController";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/models/api";
import { planoModel } from "@/models/planoModel";
import { usuarioModel } from "@/models/usuarioModel";
import { formatPtBrDate } from "@/views/lib/utils";

interface Plano {
  id: string; titulo: string; descricao: string; valor_mensal: number; beneficios: any; destaque: boolean;
}
interface Contratacao {
  id: string; plano_id: string; status: string; valor_mensal: number;
  dependentes: number; data_inicio: string; carencia_ate: string | null;
  planos?: Plano;
}

export default function Plano() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [contrato, setContrato] = useState<Contratacao | null>(null);
  const [loading, setLoading] = useState(true);
  const [contratando, setContratando] = useState<string | null>(null);
  const [showTroca, setShowTroca] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);
    setPlanos([]);
    setContrato(null);
    try {
      const profile = await usuarioModel.getByUserId(user.id);
      const funerariaId = profile?.funeraria_id ?? null;
      const [p, c] = await Promise.all([
        funerariaId ? planoModel.listAtivos(funerariaId) : Promise.resolve([]),
        api.contratacoes.get(),
      ]);
      setPlanos(p ?? []);
      if (c && c.status !== "cancelado") {
        const contratoPlano = await planoModel.getById(c.plano_id);
        const mesmoDaFuneraria = contratoPlano?.funeraria_id === funerariaId;
        setContrato(mesmoDaFuneraria ? c : null);
      } else {
        setContrato(null);
      }
    } catch (e: any) {
      toast.error(e?.message || "Erro ao carregar planos");
      setPlanos([]);
      setContrato(null);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [user]);

  const contratar = async (plano: Plano) => {
    if (!user) return;
    setContratando(plano.id);
    try {
      const carencia = new Date(); carencia.setDate(carencia.getDate() + 90);
      await api.contratacoes.contratar({
        plano_id: plano.id, valor_mensal: plano.valor_mensal,
        carencia_ate: carencia.toISOString().slice(0, 10),
      });
      toast.success("Plano contratado!");
      await fetchAll();
    } catch (e: any) { toast.error(e.message); }
    setContratando(null);
  };

  const cancelar = async () => {
    if (!user || !contrato) return;
    setCancelando(true);
    try {
      await api.contratacoes.cancelar();
      toast.success("Plano cancelado");
      await fetchAll();
      nav("/cliente");
    } catch (e: any) { toast.error(e.message); }
    setCancelando(false);
  };

  const trocar = async (plano: Plano) => {
    if (!user || !contrato) return;
    setContratando(plano.id);
    try {
      const carencia = new Date(); carencia.setDate(carencia.getDate() + 90);
      await api.contratacoes.trocar({
        plano_id: plano.id,
        valor_mensal: plano.valor_mensal,
        carencia_ate: carencia.toISOString().slice(0, 10),
      });
      toast.success("Plano trocado!");
      setShowTroca(false);
      await fetchAll();
    } catch (e: any) { toast.error(e.message); }
    setContratando(null);
  };

  if (loading) return <div className="p-10 flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando…</div>;

  if (!contrato) {
    return (
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-6">
        <header>
          <h1 className="font-serif text-4xl md:text-5xl">Escolha seu Plano</h1>
          <p className="text-muted-foreground mt-2">Selecione a oferta que melhor atende a sua família.</p>
        </header>
        <div className="grid md:grid-cols-3 gap-5">
          {planos.map((p) => (
            <article key={p.id} className={`rounded-3xl bg-card border p-7 shadow-soft flex flex-col ${p.destaque ? "border-primary shadow-elegant" : "border-border"}`}>
              {p.destaque && <span className="text-[10px] uppercase tracking-widest bg-secondary px-2 py-0.5 rounded-full self-start mb-2">Destaque</span>}
              <h3 className="font-serif text-2xl" title={p.titulo}>{p.titulo}</h3>
              <p className="text-sm text-muted-foreground mt-2 flex-1" title={p.descricao}>{p.descricao}</p>
              <div className="font-serif text-3xl mt-5">R$ <input type="number" min={0} step={0.01} value={p.valor_mensal} readOnly className="w-24 bg-transparent border-none outline-none text-inherit" /><span className="text-xs text-muted-foreground font-sans"> /mês</span></div>
              <Button onClick={() => contratar(p)} disabled={contratando === p.id} className="rounded-xl mt-5">
                {contratando === p.id && <Loader2 className="size-4 animate-spin" />} Contratar
              </Button>
            </article>
          ))}
        </div>
      </div>
    );
  }

  const plano = planos.find((p) => p.id === contrato.plano_id) || contrato.planos;
  if (!plano) return <div className="p-10">Plano não encontrado.</div>;
  const rawBeneficios = (plano as any).beneficios;
  const beneficiosTexto = typeof rawBeneficios === "string"
    ? rawBeneficios
    : rawBeneficios?.texto ?? "";
  const valorPlano = (plano as any).valor_mensal ?? contrato.valor_mensal;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl">{(plano as any).titulo}</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Contrato Nº {contrato.id.slice(0, 8).toUpperCase()} · <span className="text-success font-medium capitalize">{contrato.status}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl" onClick={() => setShowTroca((v) => !v)}>
            Trocar plano
          </Button>
          <Button variant="destructive" className="rounded-xl" onClick={cancelar} disabled={cancelando}>
            {cancelando && <Loader2 className="size-4 animate-spin" />} Sair do plano
          </Button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { t: "Status", v: contrato.status === "ativo" ? "Plena Cobertura" : "Em Carência", icon: ShieldCheck },
          { t: "Carência", v: contrato.carencia_ate ? `Até ${formatPtBrDate(contrato.carencia_ate)}` : "Concluída" },
          { t: "Dependentes", v: `${String(contrato.dependentes).padStart(2, "0")} Inclusos` },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl bg-card border border-border p-5 shadow-soft">
            <div className="flex items-center gap-3">
              {s.icon && <div className="size-9 rounded-lg bg-secondary flex items-center justify-center"><s.icon className="size-4" /></div>}
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.t}</div>
                <div className="font-serif text-xl mt-0.5">{s.v}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <section className="rounded-3xl bg-card border border-border p-6 md:p-7 shadow-soft">
            <h2 className="font-serif text-2xl mb-5">Benefícios do Plano</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-line">
              {beneficiosTexto || "Benefícios não informados."}
            </p>
          </section>
        </div>
        <aside className="space-y-5">
          <div className="rounded-3xl bg-gradient-card-dark text-primary-foreground p-7 shadow-elegant">
            <h3 className="font-serif text-2xl mb-5">Resumo Financeiro</h3>
            <div className="mt-2">
              <div className="text-xs uppercase tracking-wider text-primary-foreground/60">Custo Mensal</div>
              <div className="font-serif text-3xl mt-1">R$ {Number(valorPlano).toFixed(2).replace(".", ",")}</div>
            </div>
          </div>
        </aside>
      </div>

      {showTroca && (
        <section className="rounded-3xl bg-card border border-border p-6 md:p-7 shadow-soft">
          <h2 className="font-serif text-2xl mb-5">Trocar de Plano</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {planos.filter((p) => p.id !== contrato.plano_id).map((p) => (
              <article key={p.id} className={`rounded-3xl bg-card border p-6 shadow-soft flex flex-col ${p.destaque ? "border-primary shadow-elegant" : "border-border"}`}>
                {p.destaque && <span className="text-[10px] uppercase tracking-widest bg-secondary px-2 py-0.5 rounded-full self-start mb-2">Destaque</span>}
                <h3 className="font-serif text-xl">{p.titulo}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-1">{p.descricao}</p>
                <div className="font-serif text-2xl mt-4">R$ {Number(p.valor_mensal).toFixed(2).replace(".", ",")}<span className="text-xs text-muted-foreground font-sans"> /mês</span></div>
                <Button onClick={() => trocar(p)} disabled={contratando === p.id} className="rounded-xl mt-4">
                  {contratando === p.id && <Loader2 className="size-4 animate-spin" />} Trocar para este
                </Button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
