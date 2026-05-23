import { useEffect, useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/models/api";

export default function SuperAdminDashboard() {
  const [total, setTotal] = useState(0);
  const [ativos, setAtivos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await api.superAdmin.funerarias.listar();
        setTotal(list.length);
        setAtivos(list.filter((f: any) => f.ativo).length);
      } catch (e: any) {
        const msg = e?.message ?? "Falha ao carregar funerárias";
        toast.error(msg);
        // ajuda no debug quando for tela branca/erro silencioso
        console.error("[SuperAdminDashboard]", e);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-serif text-4xl">Painel Global</h1>
        <p className="text-muted-foreground mt-2">Gestão das funerárias cadastradas na plataforma.</p>
      </header>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando…</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { t: "Funerárias cadastradas", n: total },
            { t: "Funerárias ativas", n: ativos },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl bg-card border border-border p-6 shadow-soft">
              <div className="flex items-start justify-between">
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center">
                  <Building2 className="size-5" />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-foreground">{c.n}</span>
              </div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mt-5">{c.t}</div>
              <div className="font-serif text-3xl mt-1">{c.n}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
