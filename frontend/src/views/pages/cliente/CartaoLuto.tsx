import { Camera, Download, Loader2, Save, Share2, Sparkles, Brush, Church } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/views/components/ui/button";
import { Input } from "@/views/components/ui/input";
import { Label } from "@/views/components/ui/label";
import { Textarea } from "@/views/components/ui/textarea";
import { Switch } from "@/views/components/ui/switch";
import { cn } from "@/views/lib/utils";
import { useCartaoController } from "@/controllers/useCartaoController";

const templates = [
  { id: "classico", label: "Clássico", icon: Sparkles },
  { id: "moderno", label: "Moderno", icon: Brush },
  { id: "religioso", label: "Religioso", icon: Church },
];

export default function CartaoLutoView() {
  const { state, actions } = useCartaoController();
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (state.loading) return <div className="p-10 flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando…</div>;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 space-y-8">
      <header>
        <h1 className="font-serif text-4xl md:text-5xl">Gerador de Cartão</h1>
        <p className="text-muted-foreground mt-2">Crie uma homenagem digna e personalizada.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="rounded-3xl bg-card border border-border p-7 shadow-soft space-y-5">
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Selecione o template</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {templates.map((t) => (
                <button type="button" key={t.id} onClick={() => actions.setTpl(t.id)}
                  className={cn("p-4 rounded-2xl border text-sm font-medium flex flex-col items-center gap-2 transition-base",
                    state.tpl === t.id ? "border-primary bg-secondary/60" : "border-border hover:bg-secondary/40")}>
                  <t.icon className="size-5" />{t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5"><Label>Nome</Label><Input value={state.titulo} onChange={(e) => actions.setTitulo(e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Nascimento</Label><Input type="date" value={state.nasc} onChange={(e) => actions.setNasc(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Falecimento</Label><Input type="date" value={state.fal} onChange={(e) => actions.setFal(e.target.value)} /></div>
          </div>
          <div className="space-y-1.5"><Label>Mensagem</Label><Textarea rows={4} value={state.mensagem} onChange={(e) => actions.setMensagem(e.target.value)} /></div>

          <div className="flex items-center justify-between rounded-2xl border border-border p-4">
            <div><div className="font-medium text-sm">Publicar cartão</div><div className="text-xs text-muted-foreground">Permite acesso público via link.</div></div>
            <Switch checked={state.publicado} onCheckedChange={actions.setPublicado} />
          </div>

          {state.slug && state.publicado && (
            <div className="rounded-2xl bg-secondary/60 border border-border p-4 text-xs flex items-center gap-2 break-all">
              <Share2 className="size-4 shrink-0" />
              <span>{window.location.origin}/cartao/{state.slug}</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button size="lg" onClick={actions.salvar} disabled={state.saving} className="flex-1 rounded-xl">
              {state.saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Salvar cartão
            </Button>
            <Button size="lg" variant="outline" onClick={actions.baixarCartao} disabled={state.downloading || state.saving} className="rounded-xl">
              {state.downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />} Baixar
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-center text-xs uppercase tracking-widest text-muted-foreground">Visualização em tempo real</div>
          <div className={cn("rounded-3xl p-8 md:p-10 text-center shadow-elegant transition-base",
            state.tpl === "classico" && "bg-secondary/60 border border-border",
            state.tpl === "moderno" && "bg-gradient-card-dark text-primary-foreground",
            state.tpl === "religioso" && "bg-gradient-soft border border-border",
          )}>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    actions.uploadFoto(file);
                    e.currentTarget.value = "";
                  }
                }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={state.uploading}
              className="mx-auto size-44 rounded-full bg-gradient-to-br from-muted to-secondary border-4 border-card shadow-soft flex items-center justify-center mb-6 overflow-hidden"
            >
              {state.fotoUrl ? (
                <img src={state.fotoUrl} alt="Foto do falecido" className="h-full w-full object-cover" />
              ) : (
                <Camera className="size-10 opacity-30" />
              )}
            </button>
            <h3 className={cn("font-serif text-3xl", state.tpl === "moderno" && "text-primary-foreground")}>{state.titulo || "—"}</h3>
            <p className={cn("text-xs mt-2 tracking-widest uppercase", state.tpl === "moderno" ? "text-primary-foreground/60" : "text-muted-foreground")}>
              {actions.fmt(state.nasc)} {state.nasc && state.fal && "—"} {actions.fmt(state.fal)}
            </p>
            <p className={cn("italic mt-6 text-sm leading-relaxed max-w-sm mx-auto", state.tpl === "moderno" ? "text-primary-foreground/85" : "text-foreground/80")}>
              {state.mensagem}
            </p>
            <div className={cn("mt-8 text-[10px] tracking-widest uppercase", state.tpl === "moderno" ? "text-primary-foreground/50" : "text-muted-foreground")}>
              Saint Luzia · Homenagens
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
