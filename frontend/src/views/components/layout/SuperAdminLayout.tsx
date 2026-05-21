import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Building2, LogOut, Plus, Shield } from "lucide-react";
import { Logo } from "@/views/components/saint/Logo";
import { cn } from "@/views/lib/utils";
import { Button } from "@/views/components/ui/button";
import { useAuth } from "@/controllers/useAuthController";

const nav = [
  { to: "/super-admin", label: "Painel Geral", icon: LayoutGrid, end: true },
  { to: "/super-admin/funerarias", label: "Funerárias", icon: Building2 },
  { to: "/super-admin/funerarias?new=1", label: "Nova Funerária", icon: Plus },
];

export default function SuperAdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const sair = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-72 flex-col border-r border-border bg-sidebar fixed top-0 left-0 h-screen">
        <div className="px-6 py-6 border-b border-sidebar-border">
          <Logo />
          <p className="text-xs text-muted-foreground mt-3 tracking-widest uppercase">Super Administrador</p>
        </div>
        <div className="px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-lg">S</div>
            <div>
              <div className="font-medium text-sm">Super Administrador</div>
              <div className="text-xs text-muted-foreground">Gestão Global</div>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {nav.map((n) => {
            const Icon = n.icon;
            const isNewLink = n.to.includes("?new=1");
            const isFunerarias = n.to === "/super-admin/funerarias";
            const onFunerarias = location.pathname === "/super-admin/funerarias";
            const hasNew = location.search.includes("new=1");
            const isActive = isNewLink
              ? onFunerarias && hasNew
              : isFunerarias
                ? onFunerarias && !hasNew
                : location.pathname === n.to || (!n.end && location.pathname.startsWith(n.to));
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                replace={false}
                onClick={(e) => {
                  if (n.to !== "/super-admin/funerarias") return;
                  e.preventDefault();
                  navigate("/super-admin/funerarias", {
                    state: { showFunerariasList: Date.now() },
                  });
                }}
                className={() =>
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
          <div className="text-xs text-muted-foreground">
            <Shield className="size-3 inline mr-1" /> Acesso global
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 lg:px-10">
          <div className="lg:hidden"><Logo /></div>
          <div className="hidden lg:block font-serif text-xl">Painel Super Administrador</div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">Super Administrador</div>
              <div className="text-xs text-muted-foreground">Operação Multi-Funerárias</div>
            </div>
            <div className="size-9 rounded-full bg-secondary border border-border flex items-center justify-center font-medium">S</div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
