import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/views/components/ui/sonner";
import { Toaster } from "@/views/components/ui/toaster";
import { TooltipProvider } from "@/views/components/ui/tooltip";
import Index from "./views/pages/Index.tsx";
import NotFound from "./views/pages/NotFound.tsx";
import CartaoPublico from "./views/pages/CartaoPublico.tsx";
import Login from "./views/pages/auth/Login.tsx";
import AdminLogin from "./views/pages/auth/AdminLogin.tsx";
import Cadastro from "./views/pages/auth/Cadastro.tsx";
import ClienteLayout from "./views/components/layout/ClienteLayout.tsx";
import Dashboard from "./views/pages/cliente/Dashboard.tsx";
import Plano from "./views/pages/cliente/Plano.tsx";
import Documentos from "./views/pages/cliente/Documentos.tsx";
import CartaoLuto from "./views/pages/cliente/CartaoLuto.tsx";
import Falecido from "./views/pages/cliente/Falecido.tsx";
import Perfil from "./views/pages/cliente/Perfil.tsx";
import Configuracoes from "./views/pages/admin/Configuracoes.tsx";
import AdminPerfil from "./views/pages/admin/Perfil.tsx";
import AdminLayout from "./views/components/layout/AdminLayout.tsx";
import SuperAdminLayout from "./views/components/layout/SuperAdminLayout.tsx";
import AdminDashboard from "./views/pages/admin/AdminDashboard.tsx";
import Clientes from "./views/pages/admin/Clientes.tsx";
import EditorPlanos from "./views/pages/admin/EditorPlanos.tsx";
import ValidacaoDocumentos from "./views/pages/admin/ValidacaoDocumentos.tsx";
import SuperAdminDashboard from "./views/pages/superadmin/Dashboard.tsx";
import SuperAdminFunerarias from "./views/pages/superadmin/Funerarias.tsx";
import { AuthProvider } from "./controllers/useAuthController";
import { ProtectedRoute } from "./views/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cartao/:slug" element={<CartaoPublico />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/cliente" element={<ClienteLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="plano" element={<Plano />} />
                <Route path="documentos" element={<Documentos />} />
                <Route path="cartao" element={<CartaoLuto />} />
                <Route path="falecido" element={<Falecido />} />
                <Route path="perfil" element={<Perfil />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute requireAdmin />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="planos" element={<EditorPlanos />} />
                <Route path="documentos" element={<ValidacaoDocumentos />} />
                <Route path="perfil" element={<AdminPerfil />} />
                <Route path="config" element={<Configuracoes />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute requireSuper />}>
              <Route path="/super-admin" element={<SuperAdminLayout />}>
                <Route index element={<SuperAdminDashboard />} />
                <Route path="funerarias" element={<SuperAdminFunerarias />} />
              </Route>
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
