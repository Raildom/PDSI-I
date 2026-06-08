import { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck, HeartHandshake, IdCard, Mail, Lock, Phone, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Logo } from "@/views/components/saint/Logo";
import { Button } from "@/views/components/ui/button";
import { Input } from "@/views/components/ui/input";
import { Label } from "@/views/components/ui/label";
import { Checkbox } from "@/views/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/views/components/ui/select";
import { supabase } from "@/models/supabase/client";
import { api } from "@/models/api";
import type { Funeraria } from "@/models/types";
import { toast } from "sonner";

export default function Cadastro() {
  const nav = useNavigate();
  const [form, setForm] = useState({ nome: "", cpf: "", telefone: "", email: "", senha: "", funeraria_id: "" });
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [funerarias, setFunerarias] = useState<Funeraria[]>([]);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  // Validação extra para CPF e telefone
  const isCpfValid = (cpf: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
  const isTelefoneValid = (tel: string) => /^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$/.test(tel);

  useEffect(() => {
    api.funerarias.listarAtivas()
      .then((data) => setFunerarias(data as Funeraria[]))
      .catch(() => setFunerarias([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.senha.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres");
      return;
    }
    if (!form.nome || form.nome.length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres");
      return;
    }
    if (form.cpf && !isCpfValid(form.cpf)) {
      toast.error("CPF inválido. Use o formato 000.000.000-00");
      return;
    }
    if (form.telefone && !isTelefoneValid(form.telefone)) {
      toast.error("Telefone inválido. Use o formato (99) 99999-9999");
      return;
    }
    if (!form.funeraria_id) {
      toast.error("Selecione uma funerária");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: { nome: form.nome, telefone: form.telefone, cpf: form.cpf, funeraria_id: form.funeraria_id },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Cadastro criado! Verifique seu e-mail para confirmar.");
    nav("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo />
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
            <ArrowLeft className="size-4" /> Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl leading-tight">Cuidado e Amparo<br/>em cada passo.</h1>
            <p className="text-muted-foreground mt-4 max-w-md">
              Inicie o cadastro para gerenciar os serviços e documentações com a tranquilidade
              e o suporte que sua família merece.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { i: ShieldCheck, t: "Ambiente Seguro", d: "Seus dados e documentos são protegidos por criptografia de ponta." },
              { i: HeartHandshake, t: "Suporte Dedicado", d: "Nossa equipe está pronta para auxiliar em todos os processos burocráticos." },
            ].map((b) => (
              <div key={b.t} className="p-5 rounded-2xl border border-border bg-card flex gap-4">
                <div className="size-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                  <b.i className="size-5 text-foreground" />
                </div>
                <div>
                  <div className="font-medium">{b.t}</div>
                  <p className="text-sm text-muted-foreground">{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-elegant relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-secondary/60 to-transparent pointer-events-none" />
          <div className="relative space-y-6">
            <div>
              <h2 className="font-serif text-2xl">Cadastro do Responsável</h2>
              <p className="text-sm text-muted-foreground mt-1">Preencha os dados abaixo para criar sua conta de acesso.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Nome</Label>
                <div className="relative">
                  <User className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input required minLength={2} maxLength={100} className="pl-9 h-11" placeholder="Como no documento de identidade" value={form.nome} onChange={set("nome")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">CPF</Label>
                  <div className="relative">
                    <IdCard className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <InputMask
                      mask="999.999.999-99"
                      value={form.cpf}
                      onChange={set("cpf")}
                    >
                      {(inputProps: any) => (
                        <Input {...inputProps} className="pl-9 h-11" placeholder="000.000.000-00" />
                      )}
                    </InputMask>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Telefone</Label>
                  <div className="relative">
                    <Phone className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <InputMask
                      mask="(99) 99999-9999"
                      value={form.telefone}
                      onChange={set("telefone")}
                    >
                      {(inputProps: any) => (
                        <Input {...inputProps} className="pl-9 h-11" placeholder="(00) 00000-0000" />
                      )}
                    </InputMask>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</Label>
                <div className="relative">
                  <Mail className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input type="email" required minLength={5} maxLength={100} className="pl-9 h-11" placeholder="exemplo@email.com" value={form.email} onChange={set("email")} />
                </div>
              </div>

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Senha</Label>
                <div className="relative">
                  <Lock className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input type={showSenha ? "text" : "password"} required minLength={8} maxLength={128} className="pl-9 pr-9 h-11" placeholder="Mínimo 8 caracteres" value={form.senha} onChange={set("senha")} />
                  <button
                    type="button"
                    aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowSenha((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Checkbox id="terms" className="mt-0.5" required />
                <Label htmlFor="terms" className="text-xs text-muted-foreground font-normal leading-relaxed">
                  Ao finalizar, concordo com os <span className="underline text-foreground">Termos de Uso</span> e a <span className="underline text-foreground">Política de Privacidade</span> da Saint Luzia.
                </Label>
              </div>
            </div>

            <Button type="submit" size="lg" disabled={loading} className="w-full rounded-xl">
              {loading ? <Loader2 className="size-4 animate-spin" /> : <>Finalizar cadastro <ArrowRight className="size-4 ml-1" /></>}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já possui uma conta? <Link to="/login" className="font-medium text-foreground hover:underline">Acessar sistema</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
