import { useEffect, useState } from "react";
import { Edit3, Loader2, Plus, Save } from "lucide-react";
import { Button } from "@/views/components/ui/button";
import { Input } from "@/views/components/ui/input";
import { Label } from "@/views/components/ui/label";
import { Textarea } from "@/views/components/ui/textarea";
import { Switch } from "@/views/components/ui/switch";
import { cn } from "@/views/lib/utils";
import { toast } from "sonner";
import { api } from "@/models/api";

interface Plano { id: string; titulo: string; descricao: string; valor_mensal: number; destaque: boolean; ativo: boolean; beneficios: any; }

export default function EditorPlanos() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [selId, setSelId] = useState<string | null>(null);
  const [edit, setEdit] = useState<Partial<Plano>>({});
  const [beneficiosText, setBeneficiosText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const toBeneficiosText = (beneficios: any) => {
    if (!beneficios) return "";
    if (typeof beneficios === "string") return beneficios;
    if (typeof beneficios.texto === "string") return beneficios.texto;

    const partes: string[] = [];
    if (Array.isArray(beneficios.urna) && beneficios.urna.length) {
      partes.push(`Urna e ornamentacao: ${beneficios.urna.join(", ")}.`);
    }
    if (Array.isArray(beneficios.taxas) && beneficios.taxas.length) {
      partes.push(`Taxas inclusas: ${beneficios.taxas.join(", ")}.`);
    }
    if (typeof beneficios.logistica === "string" && beneficios.logistica.trim()) {
      partes.push(`Logistica: ${beneficios.logistica.trim()}.`);
    }
    if (typeof beneficios.cerimonial === "string" && beneficios.cerimonial.trim()) {
      partes.push(`Cerimonial: ${beneficios.cerimonial.trim()}.`);
    }

    return partes.join("\n\n");
  };

  const fetchAll = async () => {
    try {
      const data = await api.planos.listarTodos();
      setPlanos(data ?? []);
      if (!selId && data?.[0]) { setSelId(data[0].id); setEdit(data[0]); }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const select = (p: Plano) => {
    setSelId(p.id);
    setEdit(p);
    setBeneficiosText(toBeneficiosText(p.beneficios));
  };
  const novo = () => {
    setSelId(null);
    setEdit({ titulo: "", descricao: "", valor_mensal: 0, destaque: false, ativo: true, beneficios: {} });
    setBeneficiosText("");
  };

  const salvar = async () => {
    setSaving(true);
    try {
      if (!edit.titulo || edit.titulo.trim().length < 2) {
        toast.error("Título deve ter pelo menos 2 caracteres");
        setSaving(false);
        return;
      }
      if (Number(edit.valor_mensal ?? 0) < 0) {
        toast.error("O valor mensal não pode ser negativo");
        setSaving(false);
        return;
      }
      const payload = {
        titulo: edit.titulo!, descricao: edit.descricao!, valor_mensal: Number(edit.valor_mensal ?? 0),
        destaque: !!edit.destaque, ativo: edit.ativo ?? true, beneficios: beneficiosText.trim() || null,
      };
      if (selId) { await api.planos.atualizar(selId, payload); }
      else { await api.planos.criar(payload); }
      toast.success("Plano salvo"); fetchAll();
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  if (loading) return <div className="p-10 flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando…</div>;

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap justify-between items-end gap-4">
        <div><h1 className="font-serif text-4xl">Editor de Planos</h1><p className="text-muted-foreground mt-1">Configure as ofertas e benefícios dos planos funerários.</p></div>
        <Button onClick={novo} className="rounded-xl"><Plus className="size-4" /> Novo Plano</Button>
      </header>

      <div className="grid lg:grid-cols-2 gap-5">
        <section>
          <h2 className="font-serif text-xl mb-4">Planos</h2>
          <div className="space-y-3">
            {planos.map((p) => (
              <button key={p.id} onClick={() => select(p)} className={cn("w-full text-left rounded-2xl border p-5 transition-base bg-card", selId === p.id ? "border-primary shadow-elegant" : "border-border hover:border-foreground/30 shadow-soft")}>
                <div className="flex justify-between items-start">
                  <div>{p.destaque && <span className="text-[10px] uppercase tracking-widest bg-secondary px-2 py-0.5 rounded-full">Destaque</span>}<h3 className="font-serif text-2xl mt-2">{p.titulo}</h3><p className="text-sm text-muted-foreground mt-1">{p.descricao}</p></div>
                  <Edit3 className="size-4 text-muted-foreground" />
                </div>
                <div className="border-t border-border mt-4 pt-3 flex items-center justify-between">
                  <div className="font-serif text-lg">R$ {Number(p.valor_mensal).toFixed(2).replace(".", ",")} <span className="text-xs text-muted-foreground font-sans">/mês</span></div>
                  {!p.ativo && <span className="text-xs text-muted-foreground">Inativo</span>}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-card border border-border p-7 shadow-soft space-y-5 self-start">
          <div className="flex items-center gap-2"><Edit3 className="size-5" /><h2 className="font-serif text-2xl">{selId ? "Editar Plano" : "Novo Plano"}</h2></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-muted-foreground">Título</Label><Input maxLength={100} value={edit.titulo ?? ""} onChange={(e) => setEdit({ ...edit, titulo: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-muted-foreground">Custo Mensal (R$)</Label><Input type="number" step="0.01" min="0" value={edit.valor_mensal ?? 0} onChange={(e) => setEdit({ ...edit, valor_mensal: Number(e.target.value) })} /></div>
          </div>
          <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-muted-foreground">Descrição</Label><Textarea rows={3} maxLength={300} value={edit.descricao ?? ""} onChange={(e) => setEdit({ ...edit, descricao: e.target.value })} /></div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Benefícios</Label>
            <Textarea rows={6} maxLength={1000} value={beneficiosText} onChange={(e) => setBeneficiosText(e.target.value)} />
            <p className="text-xs text-muted-foreground">Descreva os benefícios em texto livre.</p>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2"><Switch checked={!!edit.destaque} onCheckedChange={(v) => setEdit({ ...edit, destaque: v })} /> <span className="text-sm">Destaque</span></label>
            <label className="flex items-center gap-2"><Switch checked={edit.ativo ?? true} onCheckedChange={(v) => setEdit({ ...edit, ativo: v })} /> <span className="text-sm">Ativo</span></label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" className="rounded-xl" onClick={() => { const p = planos.find((x) => x.id === selId); if (p) setEdit(p); }}>Descartar</Button>
            <Button onClick={salvar} disabled={saving} className="rounded-xl">{saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Salvar Plano</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
