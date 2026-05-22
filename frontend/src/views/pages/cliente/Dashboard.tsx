import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, FileText, Loader2, UserPlus, Workflow } from "lucide-react";
import { Button } from "@/views/components/ui/button";
import { useDashboardController } from "@/controllers/useDashboardController";

export default function DashboardView() {
  const { state, actions } = useDashboardController();

  if (state.loading) return <div className="p-10 flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando…</div>;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl md:text-5xl">Bem-vindo, {state.nome || "—"}</h1>
        <p className="text-muted-foreground">Estamos aqui para oferecer todo o suporte necessário neste momento.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 rounded-3xl bg-card border border-border p-6 md:p-8 shadow-soft">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2.5">
              <Workflow className="size-5 text-foreground" />
              <h2 className="font-serif text-2xl">Checklist do Processo</h2>
            </div>
            <span className="text-xs font-medium bg-secondary text-foreground rounded-full px-3 py-1.5">
              {state.progresso}% Concluído
            </span>
          </div>

          {state.etapas.length === 0 ? (
            <p className="text-sm text-muted-foreground mt-6">
              Nenhuma etapa disponível.
            </p>
          ) : (
            <div className="mt-6 divide-y divide-border">
              {state.etapas.map((p) => (
                <div key={p.id} className="py-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/20 transition-colors rounded-xl px-2 -mx-2" onClick={() => actions.toggleEtapa(p)}>
                  {p.concluido ? <CheckCircle2 className="size-6 text-success shrink-0" /> : <Circle className="size-6 text-muted-foreground shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground">{p.titulo}</div>
                    <div className="text-sm text-muted-foreground truncate">{p.subtitulo}</div>
                  </div>
                  {p.acao && (
                    <Button size="sm" variant={p.concluido ? "secondary" : "default"} className="rounded-lg shrink-0" onClick={(e) => { e.stopPropagation(); actions.toggleEtapa(p); }}>
                      {p.concluido ? "Desmarcar" : "Marcar Pronto"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <Link to="/cliente/falecido" className="block rounded-3xl bg-gradient-card-dark text-primary-foreground p-7 shadow-elegant relative overflow-hidden group transition-base hover:shadow-deep">
            <div className="absolute -right-10 -bottom-10 size-48 rounded-full bg-white/5 blur-2xl" />
            <UserPlus className="size-7 mb-4" />
            <h3 className="font-serif text-2xl">Dados do Falecido</h3>
            <p className="text-primary-foreground/70 text-sm mt-2">
              Cadastre as informações necessárias para os trâmites legais.
            </p>
            <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium">
              Iniciar cadastro <ArrowRight className="size-4 transition-base group-hover:translate-x-1" />
            </span>
          </Link>

          <Link to="/cliente/plano" className="block rounded-3xl bg-card border border-border p-7 shadow-soft transition-base hover:shadow-elegant group">
            <div className="flex items-start justify-between">
              <FileText className="size-6 text-foreground" />
              {state.contratoId && <span className="text-xs text-muted-foreground">#{state.contratoId.slice(0, 8).toUpperCase()}</span>}
            </div>
            <h3 className="font-serif text-2xl mt-4">{state.planoTitulo ?? "Escolher Plano"}</h3>
            <p className="text-sm text-muted-foreground mt-2">
              {state.planoTitulo ? "Consulte as coberturas e detalhes do contrato ativo." : "Selecione um plano para ativar a cobertura."}
            </p>
            <span className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium text-foreground">
              Acessar <ArrowRight className="size-4 transition-base group-hover:translate-x-1" />
            </span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
