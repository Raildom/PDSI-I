import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, ClipboardList, User, Heart, LogOut } from "lucide-react";
import { Logo } from "@/views/components/saint/Logo";
import { cn } from "@/views/lib/utils";
import { useAuth } from "@/controllers/useAuthController";

const nav = [
  { to: "/cliente", label: "Início", icon: Home, end: true },
  { to: "/cliente/plano", label: "Plano", icon: ClipboardList },
  { to: "/cliente/documentos", label: "Documentos", icon: FileText },
  { to: "/cliente/cartao", label: "Cartão", icon: Heart },
  { to: "/cliente/perfil", label: "Perfil", icon: User },
];

export default function ClienteLayout() {
  const loc = useLocation();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const initial = (user?.email || "S").charAt(0).toUpperCase();

  const sair = async () => {
    await signOut();
    navigate("/");
  };
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-sidebar fixed top-0 left-0 h-screen">
        <div className="px-6 py-6 border-b border-sidebar-border">
          <Logo />
          <p className="text-xs text-muted-foreground mt-3 tracking-widest uppercase">Área do Cliente</p>
        </div>
        <div className="px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-lg">
              {initial}
            </div>
            <div>
              <div className="font-medium text-sm">Cliente</div>
              <div className="text-xs text-muted-foreground">Saint Luzia</div>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-base",
                    isActive ? "bg-primary text-primary-foreground shadow-soft" : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )
                }
              >
                <Icon className="size-4" />
                {n.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border space-y-3">
          <button
            onClick={sair}
            className="w-full inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm shadow-soft hover:bg-secondary"
          >
            <LogOut className="size-4" /> Sair
          </button>
          <div className="text-xs text-muted-foreground">© 2026 Saint Luzia</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 lg:px-10">
          <div className="lg:hidden"><Logo /></div>
          <div className="hidden lg:block font-serif text-xl">Área do Cliente</div>
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-secondary border border-border flex items-center justify-center font-medium">
              {initial}
            </div>
          </div>
        </header>
        <main className="flex-1 pb-24 md:pb-12">
          <Outlet />
        </main>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur border-t border-border">
        <div className="grid grid-cols-5">
          {nav.map((n) => {
            const active = n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium transition-base",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("size-5", active && "stroke-[2.4]")} />
                {n.label}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
