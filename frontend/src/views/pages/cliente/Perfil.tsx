import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { Mail, Phone, LogOut, Bell, Shield, Loader2 } from "lucide-react";
import { Button } from "@/views/components/ui/button";
import { Input } from "@/views/components/ui/input";
import { Label } from "@/views/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/views/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/controllers/useAuthController";
import { toast } from "sonner";
import { funerariaModel } from "@/models/funerariaModel";
import { usuarioModel } from "@/models/usuarioModel";
import type { Funeraria } from "@/models/types";

export default function Perfil() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", funeraria_id: "" });
  const [funerarias, setFunerarias] = useState<Funeraria[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const data = await usuarioModel.getByUserId(user.id);
        if (data) {
          setForm({
            nome: data.nome ?? "",
            email: data.email ?? "",
            telefone: data.telefone ?? "",
            funeraria_id: data.funeraria_id ?? "",
          });
        }
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [user]);

  useEffect(() => {
    funerariaModel.listAtivas().then(setFunerarias).catch(() => setFunerarias([]));
  }, []);

  const isTelefoneValid = (tel: string) => /^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$/.test(tel);

  const salvar = async () => {
    if (!user) return;
    if (!form.nome || form.nome.trim().length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres");
      return;
    }
    if (form.telefone && !isTelefoneValid(form.telefone)) {
      toast.error("Telefone inválido. Use o formato (99) 99999-9999");
      return;
    }
    setSaving(true);
    try {
      if (!form.funeraria_id) {
        toast.error("Selecione uma funerária");
        setSaving(false);
        return;
      }
      await usuarioModel.update(user.id, {
        nome: form.nome,
        telefone: form.telefone,
        funeraria_id: form.funeraria_id,
      });
      toast.success("Perfil atualizado");
    } catch (e: any) { toast.error(e.message); }
    setSaving(false);
  };

  const sair = async () => { await signOut(); nav("/"); };
  const inicial = (form.nome || "?").charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 space-y-6">
      <header><h1 className="font-serif text-4xl md:text-5xl">Meu Perfil</h1><p className="text-muted-foreground mt-2">Mantenha seus dados atualizados.</p></header>

      <div className="rounded-3xl bg-card border border-border p-7 shadow-soft">
        <div className="flex items-center gap-5">
          <div className="size-20 rounded-full bg-gradient-card-dark text-primary-foreground flex items-center justify-center font-serif text-3xl">{inicial}</div>
          <div><div className="font-serif text-2xl">{form.nome || "—"}</div><div className="text-sm text-muted-foreground">Responsável familiar</div></div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground mt-7"><Loader2 className="size-4 animate-spin" /> Carregando…</div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mt-7">
              <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome</Label><Input value={form.nome} minLength={2} maxLength={100} required onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Como no documento de identidade" /></div>
              <div className="space-y-1.5"><Label className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</Label><div className="relative"><Mail className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" /><Input className="pl-9" value={form.email} disabled /></div></div>
              <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs uppercase tracking-wider text-muted-foreground">Telefone</Label><div className="relative"><Phone className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" /><InputMask mask="(99) 99999-9999" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} >{(inputProps: any) => (<Input {...inputProps} className="pl-9" />)}</InputMask></div></div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Funerária</Label>
                <Select value={form.funeraria_id} onValueChange={(v) => setForm({ ...form, funeraria_id: v })}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione a funerária" />
                  </SelectTrigger>
                  <SelectContent>
                    {funerarias.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.razao_social}</SelectItem>
                    ))}
                    {funerarias.length === 0 && (
                      <SelectItem value="no-funerarias" disabled>Nenhuma funerária ativa</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <Button onClick={salvar} disabled={saving} className="rounded-xl">{saving && <Loader2 className="size-4 animate-spin" />} Salvar alterações</Button>
            </div>
          </>
        )}
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { i: Bell, t: "Notificações", d: "Atualizações por e-mail e SMS", action: () => toast("Em breve") },
          { i: Shield, t: "Segurança", d: "Senha e autenticação", action: () => toast("Em breve") },
          { i: LogOut, t: "Encerrar sessão", d: "Sair do sistema", action: sair },
        ].map((b) => (
          <button key={b.t} onClick={b.action} className="text-left rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-elegant transition-base">
            <b.i className="size-5 text-foreground" /><div className="font-medium mt-3">{b.t}</div><div className="text-xs text-muted-foreground mt-1">{b.d}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
