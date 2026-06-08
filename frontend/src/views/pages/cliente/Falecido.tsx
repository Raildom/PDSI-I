import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { Camera, IdCard, Loader2, Save } from "lucide-react";
import { Button } from "@/views/components/ui/button";
import { Input } from "@/views/components/ui/input";
import { Label } from "@/views/components/ui/label";
import { Textarea } from "@/views/components/ui/textarea";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/controllers/useAuthController";
import { toast } from "sonner";
import { api } from "@/models/api";

export default function Falecido() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", data_nascimento: "", data_falecimento: "", cpf: "", parentesco: "", observacoes: "" });

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const list = await api.falecidos.listar();
        if (list?.[0]) {
          const data = list[0];
          setId(data.id);
          setForm({
            nome: data.nome ?? "", data_nascimento: data.data_nascimento ?? "",
            data_falecimento: data.data_falecimento ?? "", cpf: data.cpf ?? "",
            parentesco: data.parentesco ?? "", observacoes: data.observacoes ?? "",
          });
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [user]);

  const isCpfValid = (cpf: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.nome || form.nome.trim().length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres");
      return;
    }
    if (form.cpf && !isCpfValid(form.cpf)) {
      toast.error("CPF inválido. Use o formato 000.000.000-00");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nome: form.nome,
        data_nascimento: form.data_nascimento || null,
        data_falecimento: form.data_falecimento || null,
        cpf: form.cpf || null,
        parentesco: form.parentesco || null,
        observacoes: form.observacoes || null,
      };
      if (id) { await api.falecidos.atualizar(id, payload); }
      else { await api.falecidos.criar(payload); }
      toast.success("Registro salvo");
      nav("/cliente");
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-muted-foreground flex items-center gap-2"><Loader2 className="size-4 animate-spin" /> Carregando…</div>;

  return (
    <form onSubmit={salvar} className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-6">
      <nav className="text-sm text-muted-foreground">
        <Link to="/cliente" className="hover:text-foreground">Processos</Link> › <span className="text-foreground">{id ? "Editar registro" : "Novo registro"}</span>
      </nav>
      <header>
        <h1 className="font-serif text-4xl md:text-5xl">Dados do Falecido</h1>
        <p className="text-muted-foreground mt-2 max-w-xl">Preencha as informações essenciais para a formalização do processo e criação do cartão de luto.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2 rounded-3xl bg-card border border-border p-7 shadow-soft space-y-5">
          <h2 className="font-serif text-2xl flex items-center gap-2"><IdCard className="size-5" /> Identificação</h2>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome</Label>
            <Input required minLength={2} maxLength={100} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome do falecido" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-muted-foreground">Data de nascimento</Label><Input type="date" value={form.data_nascimento} onChange={(e) => setForm({ ...form, data_nascimento: e.target.value })} /></div>
            <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-muted-foreground">Data de falecimento</Label><Input type="date" value={form.data_falecimento} onChange={(e) => setForm({ ...form, data_falecimento: e.target.value })} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-muted-foreground">CPF</Label><InputMask mask="999.999.999-99" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })}>{(inputProps: any) => (<Input {...inputProps} placeholder="000.000.000-00" />)}</InputMask></div>
            <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-muted-foreground">Parentesco</Label><Input maxLength={50} value={form.parentesco} onChange={(e) => setForm({ ...form, parentesco: e.target.value })} placeholder="Pai, mãe, cônjuge…" /></div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between"><Label className="text-xs uppercase tracking-wider text-muted-foreground">Observações</Label><span className="text-xs text-muted-foreground">Opcional</span></div>
            <Textarea rows={4} maxLength={500} value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} placeholder="Informações clínicas ou observações relevantes" />
          </div>
        </section>

        <aside className="rounded-3xl bg-card border border-border p-7 shadow-soft">
          <h2 className="font-serif text-2xl flex items-center gap-2"><Camera className="size-5" /> Foto de Luto</h2>
          <p className="text-sm text-muted-foreground mt-2">A foto pode ser adicionada na etapa de criação do cartão de homenagem.</p>
          {/* <Link to="/cliente/cartao" className="block mt-4 text-sm font-medium text-foreground hover:underline">Ir para Cartão de Luto →</Link> */}
        </aside>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" className="rounded-xl" onClick={() => nav("/cliente")}>Cancelar</Button>
        <Button type="submit" disabled={saving} className="rounded-xl">
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Salvar Registro
        </Button>
      </div>
    </form>
  );
}
