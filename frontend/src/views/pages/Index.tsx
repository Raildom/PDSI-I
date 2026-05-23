import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShieldCheck, FileCheck, Sparkles } from "lucide-react";
import { Logo } from "@/views/components/saint/Logo";
import { Button } from "@/views/components/ui/button";
import heroImg from "@/views/assets/hero-light.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top */}
      <header className="absolute top-0 inset-x-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <Logo variant="light" />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
              <Link to="/admin/login">Sou funerária</Link>
            </Button>
            <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full">
              <Link to="/login">Acessar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-end overflow-hidden bg-primary">
        <img
          src={heroImg}
          alt="Luz suave atravessando arcos de uma capela serena"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          width={1280}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/20" />
        <div className="relative max-w-6xl mx-auto px-6 pb-20 pt-32 grid md:grid-cols-12 gap-10 w-full">
          <div className="md:col-span-8 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-xs tracking-wider uppercase">
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-primary-foreground leading-[1.05] text-balance">
              Cuidado e amparo<br/>em cada passo.
            </h1>
            <p className="text-primary-foreground/75 text-lg max-w-xl">
              A plataforma Saint Luzia centraliza informações, documentos e
              homenagens — para que famílias enlutadas atravessem cada etapa
              com clareza e dignidade.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-7">
                <Link to="/cadastro">Iniciar cadastro <ArrowRight className="size-4 ml-1" /></Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-primary-foreground hover:bg-white/10 rounded-full px-7">
                <Link to="/login">Já sou cliente</Link>
              </Button>
            </div>
          </div>
          <div className="md:col-span-4 grid grid-cols-2 gap-3 self-end">
            <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-5 text-primary-foreground">
              <div className="font-serif text-3xl">99.9%</div>
              <div className="text-xs uppercase tracking-widest text-primary-foreground/60 mt-1">Disponibilidade</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-5 text-primary-foreground">
              <div className="font-serif text-3xl">24/7</div>
              <div className="text-xs uppercase tracking-widest text-primary-foreground/60 mt-1">Suporte ativo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="max-w-2xl">
          <span className="text-xs tracking-widest uppercase text-muted-foreground">O que oferecemos</span>
          <h2 className="font-serif text-4xl md:text-5xl mt-3">Tudo que sua família precisa, em um só lugar.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 mt-12">
          {[
            { icon: ShieldCheck, t: "Plano transparente", d: "Visualize coberturas, dependentes e benefícios contratados a qualquer momento." },
            { icon: FileCheck, t: "Documentos guiados", d: "Acompanhe o status de cada documento necessário com clareza e suporte humano." },
            { icon: Heart, t: "Cartão de luto digital", d: "Crie homenagens dignas para compartilhar com familiares e amigos." },
          ].map((f) => (
            <article key={f.t} className="p-7 rounded-2xl bg-card border border-border shadow-soft transition-base hover:shadow-elegant">
              <div className="size-11 rounded-xl bg-secondary flex items-center justify-center mb-5">
                <f.icon className="size-5 text-foreground" />
              </div>
              <h3 className="font-serif text-2xl">{f.t}</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{f.d}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-3xl bg-gradient-card-dark p-10 md:p-16 text-primary-foreground relative overflow-hidden">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary-foreground/5 blur-3xl" />
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-serif text-4xl md:text-5xl">Comece agora, com calma.</h2>
              <p className="text-primary-foreground/70 mt-4">Crie sua conta de responsável em poucos minutos. Estamos com você.</p>
            </div>
            <div className="flex gap-3">
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-7">
                <Link to="/cadastro">Iniciar cadastro</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo />
          <p className="text-xs text-muted-foreground">© 2026 Saint Luzia · Gestão Funerária Humanizada · UFPI</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
