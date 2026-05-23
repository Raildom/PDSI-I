import { useEffect, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/views/components/ui/input";
import { api } from "@/models/api";

interface Row { user_id: string; nome: string; email: string; falecido: string | null; status_contrato: string | null; }

export default function Clientes() {
  const [rows, setRows] = useState<Row[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.admin.clientes();
        setRows(data ?? []);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, []);

  const filtered = rows.filter((r) =>
    [r.nome, r.email, r.falecido].some((v) => v?.toLowerCase().includes(busca.toLowerCase()))
  );

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Listagem de Clientes</p>
        <h1 className="font-serif text-4xl mt-2">Responsáveis</h1>
        <p className="text-muted-foreground mt-1">Gerencie os processos e documentos dos clientes ativos.</p>
      </header>

      <div className="relative max-w-md">
        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <Input className="pl-9 h-11" placeholder="Buscar por nome, e-mail ou falecido..." value={busca} onChange={(e) => setBusca(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando…</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <article key={c.user_id} className="rounded-2xl bg-card border border-border p-6 shadow-soft hover:shadow-elegant transition-base">
              <div className="flex justify-between items-start gap-3">
                <span className="text-[10px] tracking-wider uppercase font-medium px-2.5 py-1 rounded-full bg-secondary text-foreground border border-border">{c.status_contrato ?? "Sem plano"}</span>
                <span className="text-xs text-muted-foreground">#{c.user_id.slice(0, 8)}</span>
              </div>
              <h3 className="font-serif text-2xl mt-4">{c.nome}</h3>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{c.email}</p>
              <div className="border-t border-border mt-5 pt-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Falecido(a)</p>
                <p className="font-medium mt-1">{c.falecido ?? "—"}</p>
              </div>
            </article>
          ))}
          {filtered.length === 0 && <p className="text-sm text-muted-foreground col-span-full">Nenhum cliente encontrado.</p>}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { t: "Total", n: String(rows.length) },
          { t: "Com plano", n: String(rows.filter((r) => r.status_contrato).length) },
          { t: "Sem plano", n: String(rows.filter((r) => !r.status_contrato).length) },
          { t: "Com falecido", n: String(rows.filter((r) => r.falecido).length) },
        ].map((s) => (
          <div key={s.t} className="rounded-2xl bg-card border border-border p-5 shadow-soft">
            <div className="text-[10px] tracking-widest uppercase text-muted-foreground">{s.t}</div>
            <div className="font-serif text-3xl mt-1">{s.n}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
