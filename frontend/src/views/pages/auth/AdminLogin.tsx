import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, HelpCircle, ShieldCheck, Info, ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "@/views/components/saint/Logo";
import { Button } from "@/views/components/ui/button";
import { Input } from "@/views/components/ui/input";
import { Label } from "@/views/components/ui/label";
import { Checkbox } from "@/views/components/ui/checkbox";
import heroImg from "@/views/assets/hero-light.jpg";
import { supabase } from "@/models/supabase/client";
import { useAuth } from "@/controllers/useAuthController";
import { toast } from "sonner";

export default function AdminLogin() {
  const nav = useNavigate();
  const { session, role } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);

  useEffect(() => {
    if (!session) return;
    if (role === "super_admin") nav("/super-admin", { replace: true });
    if (role === "admin") nav("/admin", { replace: true });
  }, [session, role, nav]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanSenha = senha.trim();
    if (!cleanEmail || !cleanSenha) {
      toast.error("Preencha e-mail e senha");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanSenha });
    if (error) {
      setLoading(false);
      toast.error(error.message === "Invalid login credentials" ? "E-mail ou senha incorretos" : error.message);
      return;
    }
    // verifica papel admin
    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", data.user!.id);
    setLoading(false);
    if (!roles?.some((r) => r.role === "admin" || r.role === "super_admin")) {
      await supabase.auth.signOut();
      toast.error("Esta conta não tem acesso administrativo.");
      return;
    }
    toast.success("Acesso autorizado");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-10">
      <div className="absolute top-6 left-6">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5">
          <ArrowLeft className="size-4" /> Início
        </Link>
      </div>
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-elegant border border-border bg-card">
        <div className="relative bg-primary text-primary-foreground p-10 hidden md:flex flex-col justify-between min-h-[600px]">
          <img src={heroImg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover opacity-40" loading="lazy" width={1280} height={1280} />
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-transparent" />
          <div className="relative"><Logo variant="light" /></div>
          <div className="relative space-y-6">
            <h2 className="font-serif text-4xl leading-tight">Portal da Funerária</h2>
            <p className="text-primary-foreground/70 max-w-xs">
              Gestão humanizada e profissional para momentos que exigem máxima dedicação e respeito.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/15">
              <div>
                <div className="font-serif text-3xl">99.9%</div>
                <div className="text-[10px] tracking-widest uppercase text-primary-foreground/60 mt-1">Disponibilidade</div>
              </div>
              <div>
                <div className="font-serif text-3xl">24/7</div>
                <div className="text-[10px] tracking-widest uppercase text-primary-foreground/60 mt-1">Suporte ativo</div>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 md:p-12 flex flex-col justify-center gap-6"
        >
          <div>
            <h1 className="font-serif text-3xl md:text-4xl">Acesso<br/>Administrativo</h1>
            <p className="text-muted-foreground text-sm mt-3">Acesso restrito para colaboradores e diretores da unidade.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-mail profissional</Label>
              <div className="relative">
                <Mail className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input type="email" required minLength={5} maxLength={100} className="pl-9 h-11" placeholder="nome@empresa.com.br"
                  value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Senha</Label>
                <Link to="#" className="text-xs font-medium text-foreground hover:underline">Esqueci a senha</Link>
              </div>
              <div className="relative">
                <Lock className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input type={showSenha ? "text" : "password"} required minLength={8} maxLength={128} className="pl-9 pr-9 h-11" placeholder="••••••••"
                  value={senha} onChange={(e) => setSenha(e.target.value)} />
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
            <div className="flex items-center gap-2">
              <Checkbox id="remember-admin" />
              <Label htmlFor="remember-admin" className="text-sm text-muted-foreground font-normal">Lembrar deste dispositivo</Label>
            </div>
          </div>

          <Button type="submit" size="lg" disabled={loading} className="w-full rounded-xl tracking-wider uppercase text-xs">
            {loading && <Loader2 className="size-4 animate-spin" />} Entrar no portal
          </Button>

          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              Problemas com acesso? <button type="button" className="font-medium text-foreground">Fale com a TI</button>
            </p>
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <HelpCircle className="size-4" /><ShieldCheck className="size-4" /><Info className="size-4" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
