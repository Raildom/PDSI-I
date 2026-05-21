import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, Users, FileEdit, ShieldCheck, Settings, LogOut, User } from "lucide-react";
import { Logo } from "@/views/components/saint/Logo";
import { cn } from "@/views/lib/utils";
import { useAuth } from "@/controllers/useAuthController";
import { useFunerariaContext } from "@/controllers/useAdminController";

const nav = [
  { to: "/admin", label: "Painel Central", icon: LayoutGrid, end: true },
  { to: "/admin/clientes", label: "Listagem de Clientes", icon: Users },
  { to: "/admin/planos", label: "Editor de Planos", icon: FileEdit },
  { to: "/admin/documentos", label: "Validação de Documentos", icon: ShieldCheck },
  { to: "/admin/perfil", label: "Perfil", icon: User },
  { to: "/admin/config", label: "Configurações", icon: Settings },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const { funeraria } = useFunerariaContext();
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
          <p className="text-xs text-muted-foreground mt-3 tracking-widest uppercase">Admin Console</p>
        </div>
        <div className="px-4 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="size-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-serif text-lg">
              {(funeraria?.razao_social || "A").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-sm">{funeraria?.razao_social || "Funerária"}</div>
              <div className="text-xs text-muted-foreground">Gestor Funerário</div>
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
          <div className="hidden lg:block font-serif text-xl">Painel Administrativo</div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{funeraria?.razao_social || "Funerária"}</div>
              <div className="text-xs text-muted-foreground">Gestor Funerário</div>
            </div>
            <div className="size-9 rounded-full bg-secondary border border-border flex items-center justify-center font-medium">
              {(funeraria?.razao_social || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
