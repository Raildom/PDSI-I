import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardCheck, FileEdit, Loader2, Users } from "lucide-react";
import { Button } from "@/views/components/ui/button";
import { api } from "@/models/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pendentes: 0, planos: 0, clientes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.admin.stats();
        setStats(data);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-4xl">Painel Central</h1>
        <p className="text-muted-foreground mt-2">Visão geral da operação Saint Luzia.</p>
      </header>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando métricas…</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { i: ClipboardCheck, t: "Validação de Documentos", n: `${stats.pendentes} pendentes`, c: "bg-destructive/10 text-destructive", to: "/admin/documentos", cta: "Validar Agora", d: "Aguardando Revisão" },
            { i: FileEdit, t: "Gestão de Ofertas", n: `${stats.planos} ativos`, c: "bg-secondary text-foreground", to: "/admin/planos", cta: "Gerenciar Planos", d: "Editor de Planos" },
            { i: Users, t: "Base de Contatos", n: `${stats.clientes} cadastrados`, c: "bg-success/15 text-success", to: "/admin/clientes", cta: "Ver Clientes", d: "Listagem de Clientes" },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl bg-card border border-border p-6 shadow-soft">
              <div className="flex items-start justify-between">
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center"><c.i className="size-5" /></div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${c.c}`}>{c.n}</span>
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-5">{c.t}</div>
              <div className="font-serif text-2xl mt-1">{c.d}</div>
              <Button asChild className="w-full mt-4 rounded-xl text-center"><Link to={c.to}>{c.cta}</Link></Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
