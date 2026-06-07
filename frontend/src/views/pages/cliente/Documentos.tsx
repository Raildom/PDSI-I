import { useRef } from "react";
import { CheckCircle2, FileText, Home, IdCard, Loader2, Upload, MessageCircle } from "lucide-react";
import { Button } from "@/views/components/ui/button";
import { cn } from "@/views/lib/utils";
import { useDocumentosController } from "@/controllers/useDocumentosController";

type DocStatus = "aprovado" | "pendente" | "analise" | "rejeitado";

const badge: Record<DocStatus, { label: string; cls: string }> = {
  aprovado: { label: "Aprovado", cls: "bg-success/15 text-success" },
  pendente: { label: "Pendente", cls: "bg-destructive/10 text-destructive" },
  analise: { label: "Em análise", cls: "bg-secondary text-foreground" },
  rejeitado: { label: "Rejeitado", cls: "bg-destructive/15 text-destructive" },
};

const icons: Record<string, any> = { rg: IdCard, obito: FileText, cpf: IdCard, residencia: Home, certidao_nasc: FileText, rg_resp: IdCard };

interface Tipo { id: string; nome: string; descricao: string; ordem: number; }
interface Doc { id: string; tipo_id: string; status: DocStatus; updated_at: string; arquivo_path: string | null; }

export default function Documentos() {
  const { tipos, docs, loading, uploadingId, upload, fileRefs, total, aprovados, progresso } = useDocumentosController();
  const localRefs = useRef(fileRefs.current);

  if (loading) return <div className="p-10 flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando…</div>;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-8">
      <header className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Documentação</p>
          <h1 className="font-serif text-4xl md:text-5xl mt-2">Checklist de Documentos</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Para prosseguir com os trâmites legais, envie os documentos originais digitalizados abaixo.
          </p>
        </div>
        <div className="rounded-2xl bg-secondary/60 border border-border px-5 py-4 flex items-center gap-4">
          <div className="relative size-14">
            <svg viewBox="0 0 36 36" className="size-14 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--border))" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                strokeDasharray={`${progresso} 100`} pathLength={100} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">{progresso}%</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Concluídos</div>
            <div className="font-serif text-xl">{aprovados}/{total}</div>
          </div>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {tipos.map((t) => {
          const doc = docs.find((d) => d.tipo_id === t.id);
          const status: DocStatus = doc?.status ?? "pendente";
          const Icon = icons[t.id] ?? FileText;
          const b = badge[status];
          return (
            <article key={t.id} className="rounded-2xl bg-card border border-border p-5 shadow-soft flex gap-4">
              <div className={cn("size-12 rounded-xl flex items-center justify-center shrink-0",
                status === "aprovado" ? "bg-success/15 text-success" : "bg-secondary text-foreground")}>
                {status === "aprovado" ? <CheckCircle2 className="size-5" /> : <Icon className="size-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">{t.nome}</h3>
                  <span className={cn("text-[10px] tracking-wider uppercase font-medium px-2 py-1 rounded-full", b.cls)}>{b.label}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.descricao}</p>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    ref={(el) => (localRefs.current[t.id] = el)}
                    type="file" className="hidden" accept="image/*,application/pdf"
                    onChange={(e) => e.target.files?.[0] && upload(t.id, e.target.files[0])}
                  />
                  <Button size="sm" variant={status === "aprovado" ? "outline" : "default"} className="rounded-lg"
                    disabled={uploadingId === t.id} onClick={() => localRefs.current[t.id]?.click()}>
                    {uploadingId === t.id ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
                    {doc ? "Reenviar" : "Enviar"}
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-3xl bg-secondary/40 border border-border p-6 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="size-5 text-foreground" />
          <div>
            <div className="font-medium">Precisa de ajuda?</div>
            <div className="text-sm text-muted-foreground">Nossa equipe responde em até 30 minutos.</div>
          </div>
        </div>
        <Button variant="outline" className="rounded-xl">Falar com Suporte</Button>
      </div>
    </div>
  );
}
