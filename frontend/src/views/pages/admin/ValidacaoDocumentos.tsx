import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/views/components/ui/button";
import { useAuth } from "@/controllers/useAuthController";
import { toast } from "sonner";
import { api } from "@/models/api";

interface Doc {
  id: string; user_id: string; status: string; arquivo_path: string | null; updated_at: string;
  tipos_documento: { nome: string; descricao: string } | null;
  profiles: { nome: string; email: string } | null;
}

export default function ValidacaoDocumentos() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      const data = await api.admin.documentos();
      setDocs(data ?? []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const validar = async (d: Doc, novoStatus: "aprovado" | "rejeitado") => {
    setActing(d.id);
    try {
      await api.documentos.validar(d.id, { status: novoStatus });
      toast.success(novoStatus === "aprovado" ? "Documento aprovado" : "Documento rejeitado");
      fetchAll();
    } catch (e: any) { toast.error(e.message); }
    setActing(null);
  };

  const baixar = async (docId: string) => {
    try {
      const data = await api.documentos.download(docId);
      if (data?.url) window.open(data.url, "_blank");
    } catch (e: any) { toast.error(e.message); }
  };

  const total = docs.length;

  if (loading) return <div className="p-10 flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando…</div>;

  return (
    <div className="space-y-7">
      <header>
        <h1 className="font-serif text-4xl">Validação de Documentos</h1>
        <p className="text-muted-foreground mt-1">Revise os arquivos enviados pelos clientes.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 space-y-4">
          {docs.length === 0 && <p className="text-sm text-muted-foreground">Nenhum documento aguardando revisão.</p>}
          {docs.map((d) => (
            <article key={d.id} className="rounded-2xl bg-card border border-border p-5 shadow-soft">
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0">
                  <h3 className="font-medium">{d.tipos_documento?.nome}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{d.tipos_documento?.descricao}</p>
                  <p className="text-xs text-muted-foreground mt-2">Cliente: {d.profiles?.nome} · {d.profiles?.email}</p>
                </div>
                <span className="text-[10px] tracking-wider uppercase font-medium px-2.5 py-1 rounded-full bg-secondary">{d.status}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button size="sm" variant="outline" className="rounded-lg" onClick={() => baixar(d.id)}>Visualizar arquivo</Button>
                <Button size="sm" disabled={acting === d.id} className="rounded-lg bg-success text-success-foreground hover:bg-success/90" onClick={() => validar(d, "aprovado")}>
                  {acting === d.id ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Aprovar
                </Button>
                <Button size="sm" disabled={acting === d.id} variant="outline" className="rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => validar(d, "rejeitado")}>
                  <X className="size-4" /> Rejeitar
                </Button>
              </div>
            </article>
          ))}
        </section>

        <aside className="space-y-4">
          <div className="rounded-2xl bg-card border border-border p-5 shadow-soft">
            <h3 className="font-serif text-xl">Resumo</h3>
            <div className="space-y-3 mt-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total na fila</span><span className="font-medium">{total}</span></div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
