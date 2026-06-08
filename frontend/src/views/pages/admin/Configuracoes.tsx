import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/controllers/useAuthController";

export default function Configuracoes() {
  const { signOut } = useAuth();
  const nav = useNavigate();
  const sair = async () => {
    await signOut();
    nav("/");
  };

  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Configurações</p>
        <h1 className="font-serif text-4xl mt-2">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie preferências e acesso ao sistema.</p>
      </header>

      <section className="grid sm:grid-cols-3 gap-3 max-w-3xl">
        {[
          { i: Bell, t: "Notificações", d: "Atualizações por e-mail e SMS", action: () => toast("Em breve") },
          { i: Shield, t: "Segurança", d: "Senha e autenticação", action: () => toast("Em breve") },
          { i: LogOut, t: "Encerrar sessão", d: "Sair do sistema", action: sair },
        ].map((b) => (
          <button key={b.t} onClick={b.action} className="text-left rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-elegant transition-base">
            <b.i className="size-5 text-foreground" />
            <div className="font-medium mt-3">{b.t}</div>
            <div className="text-xs text-muted-foreground mt-1">{b.d}</div>
          </button>
        ))}
      </section>
    </div>
  );
}
