import { Loader2, Mail, Phone, IdCard, MapPin } from "lucide-react";
import { Button } from "@/views/components/ui/button";
import { Input } from "@/views/components/ui/input";
import { Label } from "@/views/components/ui/label";
import { Textarea } from "@/views/components/ui/textarea";
import { usePerfilController } from "@/controllers/usePerfilController";

export default function AdminPerfil() {
  const { loading, saving, form, setForm, salvar } = usePerfilController();

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 space-y-6">
      <header>
        <h1 className="font-serif text-4xl md:text-5xl">Perfil do Administrador</h1>
        <p className="text-muted-foreground mt-2">Atualize seus dados de acesso e contato.</p>
      </header>

      <div className="rounded-3xl bg-card border border-border p-7 shadow-soft">
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando…</div>
        ) : (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome da funerária</Label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</Label>
                <div className="relative">
                  <Mail className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input className="pl-9" value={form.email} disabled />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Telefone</Label>
                <div className="relative">
                  <Phone className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input className="pl-9" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">CPF</Label>
                <div className="relative">
                  <IdCard className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input className="pl-9" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Endereço</Label>
                <div className="relative">
                  <MapPin className="size-4 text-muted-foreground absolute left-3 top-3" />
                  <Textarea className="pl-9" rows={3} value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={salvar} disabled={saving} className="rounded-xl">
                {saving && <Loader2 className="size-4 animate-spin" />} Salvar alterações
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
