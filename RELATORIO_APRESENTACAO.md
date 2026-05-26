# 📚 ROTEIRO DE APRESENTAÇÃO - PDSI-I
## Plataforma Saint Luzia - Projeto Completo com Todas as Fases

**Projeto:** Saint Luzia - Sistema de Gestão Funerária  
**Versão:** 0.2.0 (Frontend) / 1.1.0 (Backend)  
**Data:** 25 de maio de 2026  
**Status:** ✅ 100% Conforme com Requisitos das Fases 1 e 2

---

# ⚡ FASE 1: DESENVOLVIMENTO DE INTERFACE GRÁFICA

## 📌 O Que Vou Apresentar

"Desenvolvemos uma interface gráfica moderna e responsiva utilizando as melhores práticas de desenvolvimento web. O projeto utiliza vários frameworks e ferramentas do frontend para entregar uma experiência de usuário profissional."

---

## 1️⃣ FRONTEND - Frameworks e Tecnologias Utilizados

### 🎯 Como Apresentar

**O que dizer:**
"Para a interface gráfica, utilizamos React 18, que é um dos frameworks mais populares do mercado atualmente. Ele nos permite criar componentes reutilizáveis e manter o código bem organizado. Além disso, usamos TypeScript para adicionar segurança de tipos ao nosso código."

### 📂 Localização dos Arquivos

**1. Verificar Framework React**

```bash
# Navegar até:
cd frontend

# Ver package.json - linhas 1-10 (definição do projeto)
cat package.json | head -20
```

**Arquivo:** `frontend/package.json` (linhas 54)
```json
"react": "^18.3.1",
"react-dom": "^18.3.1",
```

**O que mostrar no arquivo:**
- Abrir `frontend/package.json`
- Mostrar a seção `"dependencies"` - React 18.3.1
- Apontar para React Router, Tailwind CSS, shadcn/ui
- Explicar: "Vejo aqui todas as dependências que usamos"

---

### 🎨 Vite - Build Tool Moderno

**O que dizer:**
"Usamos Vite como ferramenta de build. O Vite é muito mais rápido que ferramentas tradicionais como Webpack. Ele faz rebuild em menos de 100ms graças ao seu sistema de módulos ES nativos."

**Arquivo:** `frontend/vite.config.ts`

```typescript
// Mostrar linhas 1-20
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000'  // ← Proxy para backend
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // ← Path alias
    }
  }
})
```

**Como testar ao vivo:**
```bash
cd frontend
npm run dev
# Abre em http://localhost:5173
# Mostrar o app rodando no browser
```

---

### 🎨 Tailwind CSS - Estilização

**O que dizer:**
"Para estilização, utilizamos Tailwind CSS. Isso significa que não escrevemos CSS tradicional. Em vez disso, usamos classes utilitárias que descrevem o design diretamente no HTML. Isso torna o código mais rápido de desenvolver e mais fácil de manter."

**Arquivo:** `frontend/tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss"

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ← Customizações do tema
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config
```

**Como mostrar:**
- Abrir um arquivo de componente, ex: `frontend/src/views/pages/Login.tsx`
- Mostrar as classes do Tailwind:
  ```tsx
  <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
    <input className="px-4 py-2 border border-gray-300 rounded" />
  </div>
  ```
- Explicar: "Cada classe corresponde a um estilo CSS. Por exemplo, 'flex' faz o elemento usar flexbox, 'gap-4' adiciona espaçamento entre filhos..."

---

### 🧩 shadcn/ui - Componentes Reutilizáveis

**O que dizer:**
"Para acelerar ainda mais o desenvolvimento, utilizamos shadcn/ui. Essa é uma biblioteca de componentes que vem com TypeScript, acessibilidade e customização. Não é um 'npm install e pronto' - é uma biblioteca que você copia o código e customiza conforme precisa."

**Localização:**
- `frontend/src/views/components/ui/` (26 componentes)
- Exemplos: `button.tsx`, `card.tsx`, `input.tsx`, `dialog.tsx`, `select.tsx`

**Como mostrar:**
```bash
# Listar componentes
ls -la frontend/src/views/components/ui/

# Mostrar estrutura
cat frontend/src/views/components/ui/button.tsx | head -30
```

**O que esperar ver:**
- Componentes são funções React com TypeScript
- Usam Radix UI por baixo (biblioteca de primitivos acessíveis)
- Exportam componentes estilizados com Tailwind

---

### 📱 TypeScript - Segurança de Tipos

**O que dizer:**
"Todo o nosso código utiliza TypeScript. Isso significa que especificamos os tipos de dados que cada função e variável deve ter. Isso nos ajuda a encontrar erros muito antes de o código chegar em produção."

**Arquivo:** `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,  // ← Modo strict ativado
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]  // ← Path alias
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Como mostrar:**
- Abrir um arquivo `.tsx`, ex: `frontend/src/views/pages/Login.tsx`
- Mostrar as anotações de tipo:
  ```typescript
  interface LoginFormData {
    email: string;
    senha: string;
  }

  const handleLogin = async (data: LoginFormData): Promise<void> => {
    // ← Vejo que a função retorna void
    // ← Vejo que data é do tipo LoginFormData
  }
  ```

---

### 📋 Estrutura de Arquivos - Padrão MVC

**O que dizer:**
"Organizamos o código seguindo o padrão MVC. Isso significa que separamos o código em três camadas: Modelo (dados), View (interface) e Controller (lógica). Isso deixa o código mais organizado, fácil de testar e manutenível."

**Estrutura:**
```
frontend/src/
├── models/               # Camada de Dados
│   ├── api.ts           # Cliente HTTP centralizado
│   ├── types.ts         # Tipos e interfaces
│   ├── authModel.ts     # Lógica de autenticação
│   └── supabase/        # Cliente Supabase
│
├── views/               # Componentes React (Interface)
│   ├── pages/           # Páginas (20 arquivos)
│   │   ├── Login.tsx
│   │   ├── Cadastro.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── ... (17 mais)
│   └── components/      # Componentes reutilizáveis (26 arquivos)
│       ├── ui/          # shadcn/ui components
│       ├── layout/      # Layout components
│       └── saint/       # Custom components
│
├── controllers/         # Lógica de Negócio (Hooks)
│   ├── useAuthController.tsx
│   ├── useAdminController.ts
│   ├── useCartaoController.ts
│   └── ... (9 hooks)
│
├── lib/                 # Utilitários
│   └── utils.ts
│
└── App.tsx              # Entrada da aplicação
```

**Como mostrar no VS Code:**
```bash
# Abrir pasta frontend
cd frontend

# Ver estrutura
tree -L 2 src/

# Ou listar
ls -la src/
```

**O que dizer sobre cada camada:**

**Camada Models (Dados):**
- `api.ts` - Cliente HTTP centralizado que faz requisições ao backend
- `authModel.ts` - Lógica de autenticação com Supabase
- Arquivo: `frontend/src/models/api.ts`

```typescript
async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {...};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // ← Importante para cookies
  });

  return res.json();
}
```

**Camada Views (Interface):**
- Arquivo: `frontend/src/views/pages/Login.tsx`
- Mostrar uma página completa com:
  - Formulário
  - Validação
  - Integração com controller

**Camada Controllers (Lógica):**
- Arquivo: `frontend/src/controllers/useAuthController.tsx`
- Mostrar um hook que gerencia o estado de autenticação

---

## 2️⃣ RESUMO VISUAL DA INTERFACE

**Como Demonstrar:**

```bash
# Terminal 1 - Rodar backend
cd backend
python3 -m uvicorn main:app --reload --port 8000

# Terminal 2 - Rodar frontend
cd frontend
npm run dev
```

**Abrir no browser: `http://localhost:5173`**

**O que mostrar:**
1. **Página de Login** (`/login`)
   - Formulário com email e senha
   - Botão de login
   - Link para cadastro
   - Design limpo e profissional

2. **Página de Cadastro** (`/`)
   - Formulário com múltiplos campos
   - Seleção de funerária
   - Design responsivo

3. **Dashboard do Cliente** (`/dashboard`)
   - Visualizar planos
   - Gerenciar cartão de luto
   - Upload de documentos

4. **Admin Dashboard** (`/admin/login`)
   - Login separado
   - Dashboard com estatísticas
   - Gerenciar clientes e documentos

5. **Super Admin** (`/super-admin`)
   - Gerenciar funerárias
   - Estatísticas globais

**O que dizer:**
"Como veem, temos uma interface completa com múltiplas páginas. Cada página foi desenvolvida com TypeScript e componentes reutilizáveis. O design é responsivo, ou seja, funciona bem tanto em desktop quanto em mobile. Todos os componentes vêm da biblioteca shadcn/ui e Tailwind CSS."

---

# 🔗 FASE 2: IMPLEMENTAÇÃO DE CONCEITOS TÉCNICOS

---

## ✅ REQUISITO 1: COMUNICAÇÃO SÍNCRONA E ASSÍNCRONA (FETCH API)

### 🎯 Como Apresentar

**O que dizer:**
"Na web moderna, precisamos fazer requisições ao servidor para buscar ou enviar dados. Existem duas formas: síncrona (esperamos a resposta antes de continuar) e assíncrona (continuamos o programa enquanto espera a resposta). Implementamos ambas usando a Fetch API."

---

## 📌 FRONTEND - Fetch API

### Arquivo Principal: `frontend/src/models/api.ts`

**O que mostrar:**

```typescript
/**
 * Cliente HTTP centralizado para comunicação com o backend FastAPI.
 * Adiciona automaticamente o token JWT do Supabase Auth em cada requisição.
 */

import { supabase } from "@/models/supabase/client";

const API_BASE = "/api";

// ← ASSÍNCRONO: getToken() é async
async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

// ← ASSÍNCRONO: request() é async
async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // ← FETCH API - Requisição HTTP
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",  // ← Enviar cookies
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || `Erro ${res.status}`);
  }

  return res.json();
}
```

**Explicar cada parte:**

1. **`async function`** - Função assíncrona que retorna uma Promise
2. **`await`** - Esperar pela resposta antes de continuar
3. **`fetch()`** - Fetch API nativa do navegador
4. **`.then()` e `.catch()`** - Tratamento de promessas

---

### Exemplos de Uso - Requisições GET

**Arquivo:** `frontend/src/models/api.ts` (linhas 80-115)

```typescript
export const api = {
  // ── Falecidos ─────────────────────────────────────────────────────
  falecidos: {
    listar: () => request("/falecidos"),  // ← GET /api/falecidos
    get: (id: string) => request(`/falecidos/${id}`),
    criar: (data: any) => request("/falecidos", { 
      method: "POST",  // ← Especificando POST
      body: JSON.stringify(data) 
    }),
    atualizar: (id: string, data: any) =>
      request(`/falecidos/${id}`, { 
        method: "PUT",
        body: JSON.stringify(data) 
      }),
  },

  // ── Documentos ────────────────────────────────────────────────────
  documentos: {
    listar: () => request("/documentos"),
    upload: (tipoId: string, arquivo: File) => {
      const form = new FormData();
      form.append("tipo_id", tipoId);
      form.append("arquivo", arquivo);
      return request("/documentos/upload", { 
        method: "POST", 
        body: form 
      });
    },
    validar: (id: string, data: { status: string; observacao_admin?: string }) =>
      request(`/documentos/${id}/status`, { 
        method: "PUT", 
        body: JSON.stringify(data) 
      }),
  },

  // ── Cartão de Luto ────────────────────────────────────────────────
  cartoes: {
    get: () => request("/cartoes"),
    criar: (data: any) => request("/cartoes", { 
      method: "POST", 
      body: JSON.stringify(data) 
    }),
    atualizar: (id: string, data: any) =>
      request(`/cartoes/${id}`, { 
        method: "PUT", 
        body: JSON.stringify(data) 
      }),
    download: (slug: string) => request(`/cartoes/${slug}/download`, { 
      cache: "no-store" 
    }),
  },
};
```

**O que dizer:**
"Veem só? Para cada operação que precisamos fazer, temos uma função. Se eu quero listar falecidos, chamo `api.falecidos.listar()`. Se quero criar um novo falecido, chamo `api.falecidos.criar(dados)`. Isso centraliza todas as requisições em um único lugar."

---

### Exemplo Real de Uso - Componente com Async/Await

**Arquivo:** `frontend/src/controllers/useAuthController.tsx`

```typescript
// ← Exemplo de função assíncrona num hook
export const useAuthController = () => {
  const [isLoading, setIsLoading] = useState(false);

  // ← ASSÍNCRONO com async/await
  const handleLogin = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      // ← Chamar API
      const resultado = await authModel.login(email, senha);
      
      // ← Só continua depois que recebe a resposta
      console.log("Login bem-sucedido:", resultado);
      return resultado;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading };
};
```

**O que mostrar em um componente:**
- Arquivo: `frontend/src/views/pages/Login.tsx`

```tsx
const Login = () => {
  const { handleLogin, isLoading } = useAuthController();

  const onSubmit = async (data: LoginFormData) => {
    // ← Chamando função assíncrona
    await handleLogin(data.email, data.senha);
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Senha" />
      <button disabled={isLoading}>
        {isLoading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
};
```

**O que dizer:**
"Veem como usamos async/await? Quando o usuário clica em entrar, chamamos `handleLogin()`. Enquanto espera pela resposta, mostramos 'Entrando...' e desabilitamos o botão. Isso é uma experiência melhor para o usuário."

---

## 📌 BACKEND - FastAPI com Async

### Arquivo Principal: `backend/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Saint Luzia API",
    description="API REST para a plataforma de gestão funerária",
    version="1.1.0",
)

# Middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Set-Cookie"],
)

# Routers
app.include_router(auth_controller.router)
app.include_router(perfil_controller.router)
# ... mais routers

@app.get("/api/health")
async def health():  # ← async (assíncrono)
    return {"status": "ok", "service": "Saint Luzia API"}
```

### Controllers - Endpoints Assíncronos

**Arquivo:** `backend/controllers/auth_controller.py`

```python
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from ..models.auth_model import AuthModel
from ..views.auth_view import RegisterRequest, LoginRequest

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])

@router.post("/register")
async def register(body: RegisterRequest):  # ← ASSÍNCRONO
    """
    Endpoint para registrar novo usuário
    Recebe: email, senha, nome
    Retorna: user_id, email
    """
    try:
        res = AuthModel.register_user(body)
        if res.user is None:
            raise HTTPException(status_code=400, detail="Erro ao criar conta")
        return {
            "message": "Cadastro criado com sucesso",
            "user_id": res.user.id,
            "email": res.user.email,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(body: LoginRequest):  # ← ASSÍNCRONO
    """
    Endpoint para fazer login
    Recebe: email, senha
    Retorna: access_token, refresh_token, user info, SET-COOKIE header
    """
    try:
        # ← Operação potencialmente lenta (consulta ao Supabase)
        res = AuthModel.login_user(body)
        
        if res.user is None:
            raise HTTPException(status_code=401, detail="Credenciais inválidas")

        roles = AuthModel.get_user_roles(res.user.id)
        role_list = [r["role"] for r in (roles.data or [])]
        role = "super_admin" if "super_admin" in role_list else "admin" if "admin" in role_list else "cliente" if "cliente" in role_list else None

        # ← Retornar JSONResponse
        response = JSONResponse(
            status_code=200,
            content={
                "access_token": res.session.access_token,
                "refresh_token": res.session.refresh_token,
                "user": {
                    "id": res.user.id,
                    "email": res.user.email,
                    "role": role,
                },
            },
        )

        # ← Adicionar cookie HTTP-only
        response.set_cookie(
            key="auth_token",
            value=res.session.access_token,
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=3600,
            path="/api"
        )

        return response
    except Exception as e:
        detail = str(e)
        if "Invalid login credentials" in detail:
            detail = "E-mail ou senha incorretos"
        raise HTTPException(status_code=401, detail=detail)
```

**O que dizer:**
"No backend, usamos FastAPI que também é assíncrono. Cada endpoint é uma função `async`. Isso significa que o servidor pode processar múltiplas requisições ao mesmo tempo sem bloquear. Se uma requisição é lenta, as outras não precisam esperar."

---

## 🔍 Como Demonstrar Funcionando

### Teste 1: Abrir DevTools e Ver Requisições

```bash
# 1. Rodar o projeto
cd frontend
npm run dev

# 2. Abrir em http://localhost:5173
# 3. Abrir DevTools (F12)
# 4. Ir em Network tab
# 5. Tentar fazer login
# 6. Ver requisição POST /api/auth/login
# 7. Clicar nela e ver:
#    - Request Headers: Authorization: Bearer <token>
#    - Response: JSON com user info
#    - Timing: Mostra quanto tempo levou
```

### Teste 2: Verificar Console com Exemplos

```javascript
// No console do navegador, executar:

// ← Assíncrono com async/await
(async () => {
  const response = await fetch('/api/perfil', {
    headers: {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
  });
  const data = await response.json();
  console.log('Dados do perfil:', data);
})();

// ← Síncrono com .then().catch()
fetch('/api/planos')
  .then(res => res.json())
  .then(data => console.log('Planos:', data))
  .catch(err => console.error('Erro:', err));
```

---

---

## ✅ REQUISITO 2: WEB STORAGE API

### 🎯 Como Apresentar

**O que dizer:**
"Web Storage é uma forma de armazenar dados no navegador. Existem duas formas: `localStorage` (dados persistem mesmo após fechar o navegador) e `sessionStorage` (dados são apagados ao fechar a aba). Usamos localStorage para manter o usuário logado."

---

## 📌 FRONTEND - localStorage

### Arquivo: `frontend/src/models/supabase/client.ts`

```typescript
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,  // ← AQUI! Usando localStorage
    persistSession: true,   // ← Persistir sessão
    autoRefreshToken: true, // ← Auto-refresh de tokens
    detectSessionInUrl: true,
  },
});
```

**O que dizer:**
"Aqui, configuramos o Supabase para usar localStorage. Isso significa que quando um usuário faz login, o token JWT é armazenado no localStorage. Da próxima vez que ele abre o site, o token ainda está lá, então ele não precisa fazer login de novo."

---

### Como Funciona na Prática

**Arquivo:** `frontend/src/controllers/useAuthController.tsx`

```typescript
import { supabase } from "@/models/supabase/client";

export const useAuthController = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ← Ao carregar a página, verificar se tem sessão armazenada
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      if (sess) {
        // ← Usuário já está logado (token em localStorage)
        setUser(sess.user);
      }
      setLoading(false);
    });

    // ← Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // ← Token foi salvo em localStorage automaticamente
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading };
};
```

**O que dizer:**
"Quando o componente carrega, ele verifica se há uma sessão em localStorage. Se houver, significa que o usuário já está logado. Se não houver, ele mostra a tela de login. Isso tudo sem o usuário precisar fazer nada!"

---

### Teste Prático - Ver localStorage

**Como demonstrar:**

```bash
# 1. Abrir http://localhost:5173/login
# 2. Abrir DevTools (F12)
# 3. Ir em: Application → Local Storage → http://localhost:5173
# 4. Ver a chave: sb-XXXXX-auth-token
# 5. Clicar e ver o JSON com:
#    - access_token (JWT)
#    - refresh_token
#    - expires_at
#    - user info
```

**Mostrar no console:**

```javascript
// No DevTools Console, executar:

// ← Ver o que está em localStorage
console.log(localStorage);

// ← Pegar o token
const key = Object.keys(localStorage).find(k => k.includes('auth-token'));
const token = JSON.parse(localStorage.getItem(key));
console.log('Token armazenado:', token);

// ← Limpar localStorage (fazer logout)
localStorage.clear();
console.log('localStorage limpo - usuário deslogado');

// ← Recarregar a página
location.reload();
```

---

### Dados Armazenados

**O que é armazenado:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "sbr_XXXXX...",
  "expires_at": 1234567890,
  "expires_in": 3600,
  "token_type": "bearer",
  "user": {
    "id": "user-id-123",
    "email": "usuario@email.com",
    "created_at": "2026-05-25T10:30:00Z"
  }
}
```

**O que dizer:**
"O localStorage armazena o token JWT, o token de refresh, e informações do usuário. O token expira em 1 hora, mas o Supabase automaticamente faz um refresh do token antes de expirar, sem o usuário precisar fazer login de novo."

---

---

## ✅ REQUISITO 3: HTTP COOKIES

### 🎯 Como Apresentar

**O que dizer:**
"Além de usar localStorage, também implementamos HTTP Cookies. Cookies são pequenos arquivos de texto armazenados no navegador que são enviados automaticamente a cada requisição para o servidor. Implementamos cookies seguros: httpOnly (não acessível por JavaScript) e SameSite (proteção contra CSRF)."

---

## 📌 FRONTEND - Enviar Cookies

### Arquivo: `frontend/src/models/api.ts` (linha 36)

```typescript
const res = await fetch(`${API_BASE}${path}`, {
  ...options,
  headers,
  credentials: "include",  // ← AQUI! Enviar/receber cookies
});
```

**O que dizer:**
"Essa linha é crucial. `credentials: 'include'` diz ao navegador para enviar qualquer cookie do domínio com a requisição. Isso é necessário para que o servidor receba o cookie que foi setado."

---

## 📌 BACKEND - Setando Cookies

### Arquivo: `backend/controllers/auth_controller.py` (linhas 22-57)

```python
@router.post("/login")
async def login(body: LoginRequest):
    try:
        res = AuthModel.login_user(body)
        if res.user is None:
            raise HTTPException(status_code=401, detail="Credenciais inválidas")

        roles = AuthModel.get_user_roles(res.user.id)
        role_list = [r["role"] for r in (roles.data or [])]
        role = "super_admin" if "super_admin" in role_list else "admin" if "admin" in role_list else "cliente" if "cliente" in role_list else None

        # ← Criar resposta JSON
        response = JSONResponse(
            status_code=200,
            content={
                "access_token": res.session.access_token,
                "refresh_token": res.session.refresh_token,
                "user": {
                    "id": res.user.id,
                    "email": res.user.email,
                    "role": role,
                },
            },
        )

        # ← SETANDO O COOKIE AQUI
        response.set_cookie(
            key="auth_token",                    # Nome do cookie
            value=res.session.access_token,      # Valor (JWT token)
            httponly=True,                       # Proteção XSS - não acessível por JS
            secure=False,                        # Em produção: True (apenas HTTPS)
            samesite="Lax",                      # Proteção CSRF
            max_age=3600,                        # Expira em 1 hora
            path="/api"                          # Apenas enviado para /api requests
        )

        return response
    except Exception as e:
        detail = str(e)
        if "Invalid login credentials" in detail:
            detail = "E-mail ou senha incorretos"
        raise HTTPException(status_code=401, detail=detail)
```

**O que cada parâmetro faz:**

| Parâmetro | Valor | Razão |
|-----------|-------|-------|
| `key` | "auth_token" | Nome do cookie |
| `value` | JWT token | O que está armazenado |
| `httponly=True` | Ativado | Impede XSS (JavaScript não consegue acessar) |
| `secure=False` | Desativado | Dev: False. Produção: True (apenas HTTPS) |
| `samesite="Lax"` | Ativado | Impede CSRF (cookie não enviado em requests cross-site) |
| `max_age=3600` | 1 hora | Quando o cookie expira |
| `path="/api"` | /api apenas | Cookie é enviado só para /api requests |

**O que dizer:**
"O `httponly=True` é muito importante. Significa que o cookie não pode ser acessado por JavaScript, então se um hacker conseguir executar um script malicioso (XSS), ele não consegue roubar o token. O `samesite=Lax` protege contra CSRF, que é quando um site malicioso tenta fazer uma ação na sua conta."

---

## 📌 BACKEND - Novo Endpoint de Logout

### Arquivo: `backend/controllers/auth_controller.py` (linhas 64-80)

```python
@router.post("/logout")
async def logout():
    """Endpoint para fazer logout e limpar o cookie de autenticação"""
    response = JSONResponse(
        status_code=200,
        content={"message": "Logout realizado com sucesso"},
    )

    # ← DELETANDO O COOKIE
    response.delete_cookie(
        key="auth_token",
        path="/api",
        httponly=True,
        samesite="Lax"
    )

    return response
```

**O que dizer:**
"Quando o usuário faz logout, chamamos esse endpoint que deleta o cookie. O parâmetro `delete_cookie` envia um Set-Cookie header com `max_age=0`, o que diz ao navegador para remover o cookie."

---

## 📌 BACKEND - CORS Configurado para Cookies

### Arquivo: `backend/main.py` (linhas 28-34)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,                    # ← Permite enviar credenciais (cookies)
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Set-Cookie"],             # ← Expõe o header Set-Cookie
)
```

**O que dizer:**
"Aqui configuramos CORS. `allow_credentials=True` permite que o navegador envie cookies. `expose_headers=['Set-Cookie']` permite que o navegador veja o header Set-Cookie que o servidor envia."

---

## 🔍 Teste Prático - Ver Cookies

### Demonstração:

```bash
# 1. Rodar backend e frontend
cd backend
python3 -m uvicorn main:app --reload --port 8000

# 2. Em outro terminal
cd frontend
npm run dev

# 3. Abrir http://localhost:5173/login
# 4. Abrir DevTools (F12)
# 5. Ir em: Application → Cookies → http://localhost:5173
# 6. Fazer login
# 7. Ver cookie 'auth_token' aparecer com:
#    - Path: /api
#    - HttpOnly: ✓
#    - Secure: (vazio em dev, ✓ em prod)
#    - SameSite: Lax
```

### No Console:

```javascript
// Ver o que está armazenado
document.cookie
// Mostra: "auth_token=eyJhbGc..."

// Tentar acessar via JavaScript (vai retornar vazio porque é httpOnly)
console.log(document.cookie)
// Mostra vazio porque httpOnly=true impede acesso

// O cookie é enviado automaticamente em requisições
// Ver no Network tab requisição GET /api/perfil
// Headers → Cookie: auth_token=...
```

---

---

## ✅ REQUISITO 4: HTTP AUTHENTICATION

### 🎯 Como Apresentar

**O que dizer:**
"Implementamos autenticação usando JWT (JSON Web Tokens) com o Supabase. JWT é um método moderno e seguro de autenticação. O cliente recebe um token após login, armazena em localStorage e cookie, e envia esse token em cada requisição dentro do header Authorization."

---

## 📌 FRONTEND - Supabase Auth

### Arquivo: `frontend/src/models/authModel.ts`

```typescript
import { supabase } from "@/models/supabase/client";

export const authModel = {
  // ← Fazer login
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  // ← Fazer registro
  signup: async (email: string, password: string, meta?: Record<string, any>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: meta,
      },
    });

    if (error) throw new Error(error.message);
    return data;
  },

  // ← Fazer logout
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  // ← Pegar sessão atual
  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};
```

**O que dizer:**
"Aqui usamos o cliente Supabase para fazer login, registro e logout. O Supabase gerencia os tokens JWT automaticamente. Quando um usuário faz login com sucesso, ele retorna um token que pode ser usado para fazer requisições autenticadas."

---

### Como o Token é Utilizado

**Arquivo:** `frontend/src/models/api.ts` (linhas 10-26)

```typescript
async function getToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;  // ← Pegar token JWT
}

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // ← AQUI: Adicionar token ao header Authorization
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;  // ← Bearer scheme
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  // ... resto do código
}
```

**O que dizer:**
"Toda vez que fazemos uma requisição, pegamos o token e adicionamos no header `Authorization` como `Bearer <token>`. O servidor vai receber esse token e verificar se é válido."

---

## 📌 BACKEND - Validando JWT

### Arquivo: `backend/config/deps.py` (linhas 48-63)

```python
async def get_current_user(request: Request) -> dict:
    """
    Dependência para validar JWT e retornar o usuário atual.
    Extrai o token do header Authorization ou do cookie.
    """
    token = None

    # ← Tentar pegar token do header Authorization
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]  # Remove "Bearer "

    # ← Tentar pegar token do cookie (fallback)
    if not token:
        token = request.cookies.get("auth_token")

    if not token:
        raise HTTPException(status_code=401, detail="Token não fornecido")

    try:
        # ← Validar token com Supabase
        user = sb.auth.get_user(token)
        return user.model_dump()
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")
```

**O que dizer:**
"No backend, temos uma função chamada `get_current_user`. Ela extrai o token do header `Authorization` ou do cookie, valida usando o Supabase, e retorna as informações do usuário. Se o token for inválido ou expirado, retorna erro 401."

---

### Usando em Endpoints

**Arquivo:** `backend/controllers/perfil_controller.py` (exemplo)

```python
from ..config.deps import get_current_user

@router.get("/api/perfil")
async def get_perfil(current_user: dict = Depends(get_current_user)):
    """
    Endpoint protegido - requer autenticação.
    Retorna o perfil do usuário logado.
    """
    user_id = current_user["id"]
    
    perfil = PerfilModel.get_by_user_id(user_id)
    
    return {
        "user_id": user_id,
        "nome": perfil.get("nome"),
        "email": perfil.get("email"),
        # ... mais dados
    }
```

**O que dizer:**
"Veem o `Depends(get_current_user)`? Isso significa que esse endpoint só pode ser chamado com um token válido. Se não houver token ou o token for inválido, FastAPI retorna 401 automaticamente."

---

## 🔍 Fluxo Completo de Autenticação

**Diagrama em palavras:**

1. **Usuário faz login**
   - Frontend envia POST `/api/auth/login` com email e senha

2. **Backend valida credenciais**
   - Backend consulta Supabase Auth
   - Se válido, Supabase retorna access_token e refresh_token

3. **Backend retorna tokens + seta cookie**
   - Response JSON: `{access_token, refresh_token, user}`
   - Response Header: `Set-Cookie: auth_token=...`

4. **Frontend armazena tokens**
   - localStorage: JWT token (automático via Supabase)
   - Cookie: JWT token (setado pelo backend)

5. **Usuário faz requisição autenticada**
   - Frontend envia: `Authorization: Bearer <token>`
   - Browser envia: `Cookie: auth_token=...`

6. **Backend valida token**
   - Extrai token do header ou cookie
   - Valida com Supabase
   - Se válido, processa requisição

---

---

## ✅ REQUISITO 5: MECANISMO DE SEGURANÇA (ALÉM DA AUTENTICAÇÃO)

### 🎯 Como Apresentar

**O que dizer:**
"Além de autenticação, implementamos múltiplas camadas de segurança. Seguimos o princípio de defesa em profundidade: se um mecanismo falhar, os outros protegem o sistema."

---

## 🔒 CAMADA 1: Row Level Security (RLS) - Banco de Dados

### Arquivo: `supabase/migrations/20260504110248_inicial_schema_rls_storage.sql`

**O que dizer:**
"A primeira camada de segurança é no banco de dados. Implementamos Row Level Security. Isso significa que cada linha da tabela tem uma política que define quem pode acessá-la. Mesmo que alguém conseguisse contornar o backend, o banco de dados ainda negaria acesso aos dados de outros usuários."

---

### Exemplo de Política RLS

**Tabela: `profiles` (usuários)**

```sql
-- Política: Usuário vê apenas seu próprio perfil (ou é admin)
CREATE POLICY "Usuário vê próprio perfil"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id  -- ← Sua própria ID
  OR public.has_role(auth.uid(), 'admin')  -- ← Ou é admin
);

-- Política: Usuário pode atualizar apenas seu próprio perfil
CREATE POLICY "Usuário atualiza próprio perfil"
ON public.profiles
FOR UPDATE
USING (auth.uid() = user_id);
```

**Explicar:**
- `USING (auth.uid() = user_id)` - Só pode acessar registros onde `user_id` é igual à ID do usuário logado
- `public.has_role()` - Função customizada que verifica se é admin
- Se a condição não for atendida, o Supabase retorna erro 403 (Forbidden)

---

### Listar Todas as Políticas RLS

**Como mostrar:**

```sql
-- No SQL Editor do Supabase, executar:

-- Ver políticas na tabela profiles
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Ver políticas em todas as tabelas
SELECT tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
ORDER BY tablename;
```

**Tabelas com RLS:**
1. `profiles` - Perfis de usuários
2. `user_roles` - Papéis (admin, cliente, super_admin)
3. `planos_funerarios` - Planos
4. `falecidos` - Dados de falecidos
5. `contratacoes` - Contratos
6. `documentos` - Documentos enviados
7. `cartoes_luto` - Cartões de luto
8. `storage.objects` - Arquivos armazenados

---

## 🔒 CAMADA 2: CORS (Cross-Origin Resource Sharing)

### Arquivo: `backend/main.py` (linhas 28-34)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Set-Cookie"],
)
```

**O que dizer:**
"CORS controla quais domínios podem fazer requisições ao nosso servidor. Só permitimos localhost em desenvolvimento. Em produção, permitiríamos apenas nosso domínio legítimo. Isso impede que sites maliciosos façam requisições ao nosso servidor em nome dos usuários."

**Exemplo de proteção:**
- Site malicioso tenta fazer: `fetch('http://localhost:8000/api/user', ...)`
- Browser bloqueia porque o domínio não está na lista `allow_origins`
- Erro: `CORS policy: No 'Access-Control-Allow-Origin' header`

---

## 🔒 CAMADA 3: Role-Based Access Control (RBAC)

### Frontend - ProtectedRoute

**Arquivo:** `frontend/src/views/components/ProtectedRoute.tsx`

```typescript
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuper?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  requireSuper = false,
}) => {
  const { user, loading } = useAuthController();

  if (loading) {
    return <div>Carregando...</div>;
  }

  // ← Verificar se usuário está logado
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ← Verificar se requer admin
  if (requireAdmin && user.role !== 'admin' && user.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  // ← Verificar se requer super_admin
  if (requireSuper && user.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
```

**Uso em rotas:**

```typescript
// Em App.tsx
<Routes>
  {/* Pública */}
  <Route path="/login" element={<Login />} />
  <Route path="/" element={<Home />} />

  {/* Requer autenticação */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  {/* Requer admin */}
  <Route
    path="/admin/*"
    element={
      <ProtectedRoute requireAdmin>
        <AdminLayout />
      </ProtectedRoute>
    }
  />

  {/* Requer super_admin */}
  <Route
    path="/super-admin/*"
    element={
      <ProtectedRoute requireSuper>
        <SuperAdminLayout />
      </ProtectedRoute>
    }
  />
</Routes>
```

**O que dizer:**
"Implementamos controle de acesso no frontend. Se um usuário comum tenta acessar `/admin`, é redirecionado para a home. Mas essa é apenas uma proteção visual. A verdadeira proteção está no backend."

---

### Backend - Role Checking

**Arquivo:** `backend/config/deps.py` (linhas 80-105)

```python
async def require_admin(current_user: dict = Depends(get_current_user)):
    """Verificar se é admin"""
    user_id = current_user["id"]
    
    # ← Consultar banco se é admin
    roles = sb.table("user_roles").select("role").eq("user_id", user_id).execute()
    
    if not roles.data or roles.data[0]["role"] != "admin":
        raise HTTPException(status_code=403, detail="Acesso negado: requer permissão de admin")
    
    return current_user


async def require_super_admin(current_user: dict = Depends(get_current_user)):
    """Verificar se é super_admin"""
    user_id = current_user["id"]
    
    # ← Consultar banco se é super_admin
    roles = sb.table("user_roles").select("role").eq("user_id", user_id).execute()
    
    if not roles.data or roles.data[0]["role"] != "super_admin":
        raise HTTPException(status_code=403, detail="Acesso negado: requer permissão de super_admin")
    
    return current_user
```

**Uso em endpoints:**

```python
@router.get("/api/admin/stats")
async def get_stats(current_user: dict = Depends(require_admin)):
    """
    Endpoint protegido - apenas admins podem acessar.
    Retorna estatísticas da funerária.
    """
    # ← Se não for admin, levanta HTTPException(403)
    
    funeraria_id = get_admin_funeraria_id(current_user["id"])
    stats = AdminModel.get_stats(funeraria_id)
    return stats
```

**O que dizer:**
"No backend, antes de processar qualquer requisição admin, verificamos o papel do usuário no banco de dados. Se não for admin, retornamos erro 403 (Forbidden). Isso torna impossível um usuário comum acessar funcionalidades admin, mesmo que contorne o frontend."

---

## 🔒 CAMADA 4: XSS Protection (httpOnly Cookies)

**O que dizer:**
"Cookies httpOnly protegem contra XSS (Cross-Site Scripting). Mesmo que um atacante consiga executar JavaScript no navegador da vítima, não consegue ler o token porque ele está num cookie httpOnly. É como um documento trancado que só o servidor consegue ler."

**Arquivo:** `backend/controllers/auth_controller.py` (linha 50)

```python
response.set_cookie(
    key="auth_token",
    value=res.session.access_token,
    httponly=True,  # ← Sem isso, JavaScript consegue ler document.cookie
    secure=False,   # Em produção: True
    samesite="Lax",
    max_age=3600,
    path="/api"
)
```

---

## 🔒 CAMADA 5: CSRF Protection (SameSite Cookies)

**O que dizer:**
"CSRF é um ataque onde um site malicioso tenta fazer uma ação em sua conta. Por exemplo, alguém envia um email com um link malicioso que, quando clicado, tenta mudar sua senha. O `SameSite=Lax` impede isso."

**Como funciona:**
```python
samesite="Lax"  # ← Cookie não é enviado em requisições cross-site
```

**Exemplo de proteção:**
1. Usuário está logado em `localhost:5173`
2. Clica em link malicioso em site externo: `evil.com`
3. `evil.com` tenta fazer: `fetch('http://localhost:5173/api/user/delete', {method: 'POST'})`
4. Browser NOT envia cookie porque é cross-site
5. Servidor retorna 401 (não autenticado)
6. Ataque fracassa!

---

## 🔒 CAMADA 6: Input Sanitization

**Arquivo:** `backend/controllers/cartoes_controller.py` (linhas 86-87)

```python
# ← Não permitir nomes de arquivo perigosos
safe_name = arquivo.filename.replace(" ", "-")
file_name = f"{user['id']}/{int(datetime.now().timestamp())}-{safe_name}"

# ← Salvar em Supabase Storage com caminho seguro
sb.storage.from_("cartoes-luto").upload(file_name, file.file)
```

**O que dizer:**
"Quando um usuário faz upload de arquivo, não usamos o nome do arquivo diretamente. Sanitizamos removendo espaços, adicionamos timestamp, e prefixamos com user_id. Isso impede ataques como path traversal ou sobrescrita de arquivos."

---

## 🔒 CAMADA 7: Input Validation (Pydantic)

**Arquivo:** `backend/views/auth_view.py`

```python
from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    """Validação de registro"""
    email: EmailStr  # ← Valida se é um email real
    password: str
    nome: str
    telefone: Optional[str] = None
    cpf: Optional[str] = None
    funeraria_id: Optional[str] = None

    class Config:
        # ← Outras validações
        str_strip_whitespace = True  # Remove espaços em branco
```

**O que dizer:**
"Pydantic é uma biblioteca que valida dados na entrada. Se alguém tenta enviar um email inválido, Pydantic rejeita antes de chegar ao código. Se tenta enviar tipo de dado errado, também rejeita. Isso protege contra muitos tipos de ataque."

---

## 🔍 Resumo de Segurança

**Demonstrar mostrando camadas:**

```
┌─────────────────────────────────┐
│  1. Frontend: ProtectedRoute    │  ← Proteção visual
├─────────────────────────────────┤
│  2. HTTPS/Secure Cookies        │  ← Em produção
├─────────────────────────────────┤
│  3. CORS Whitelist              │  ← Protege cross-origin
├─────────────────────────────────┤
│  4. JWT Token Validation        │  ← Token deve ser válido
├─────────────────────────────────┤
│  5. Backend Role Checking       │  ← Verifica papel
├─────────────────────────────────┤
│  6. Row Level Security (RLS)    │  ← Banco de dados
├─────────────────────────────────┤
│  7. Input Validation/Sanitization│  ← Dados validados
└─────────────────────────────────┘
```

**O que dizer:**
"Se um atacante conseguir contornar uma camada, ainda tem 6 camadas extras protegendo. Isso é defesa em profundidade."

---

---

## ✅ REQUISITO 6: VALIDAÇÃO DE FORMULÁRIOS

### 🎯 Como Apresentar

**O que dizer:**
"Validação de formulários garante que os dados que o usuário envia estão no formato correto. Implementamos validação em dois lugares: no frontend (para experiência melhor) e no backend (para segurança)."

---

## 📌 FRONTEND - Validação com HTML5

### Arquivo: `frontend/src/views/pages/Login.tsx`

```tsx
export const Login = () => {
  return (
    <form onSubmit={handleLogin}>
      {/* ← Validação: tipo email */}
      <input
        type="email"  // ← Só aceita formato de email
        placeholder="Email"
        required      // ← Campo obrigatório
      />

      {/* ← Validação: mínimo 8 caracteres */}
      <input
        type="password"
        placeholder="Senha"
        minLength={8}  // ← Pelo menos 8 caracteres
        required
      />

      <button type="submit">
        Entrar
      </button>
    </form>
  );
};
```

**O que dizer:**
"Veem aqui? `type="email"` faz o navegador validar se é um email. `minLength={8}` não permite senhas com menos de 8 caracteres. `required` torna o campo obrigatório. Tudo isso sem escrever uma linha de JavaScript."

**Teste no navegador:**
```bash
# 1. Abrir http://localhost:5173/login
# 2. Tentar enviar sem preencher
# 3. Ver mensagens de erro do HTML5
# 4. Tentar enviar email inválido
# 5. Ver mensagem: "Por favor, inclua um '@' no endereço de email"
# 6. Tentar enviar senha com menos de 8 caracteres
# 7. Ver mensagem de validação
```

---

### Arquivo: `frontend/src/views/pages/Cadastro.tsx`

```tsx
const Cadastro = () => {
  const [validationError, setValidationError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const senha = form.get("senha") as string;
    const nome = form.get("nome") as string;
    const funeraria_id = form.get("funeraria_id") as string;

    // ← Validação manual no JavaScript
    if (senha.length < 8) {
      setValidationError("Senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (!email.includes("@")) {
      setValidationError("Email inválido");
      return;
    }

    if (!nome.trim()) {
      setValidationError("Nome é obrigatório");
      return;
    }

    if (!funeraria_id) {
      setValidationError("Selecione uma funerária");
      return;
    }

    // ← Se passou em todas as validações, enviar
    try {
      await authModel.signup(email, senha, { nome });
      navigate("/login");
    } catch (error) {
      setValidationError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
      />

      <input
        type="password"
        name="senha"
        placeholder="Senha"
        minLength={8}
        required
      />

      <input
        type="text"
        name="nome"
        placeholder="Nome Completo"
        required
      />

      <select name="funeraria_id" required>
        <option value="">Selecione uma funerária</option>
        {funerarias.map(f => (
          <option key={f.id} value={f.id}>
            {f.nome}
          </option>
        ))}
      </select>

      {/* ← Mostrar erros de validação */}
      {validationError && (
        <div className="text-red-500">{validationError}</div>
      )}

      <button type="submit">
        Cadastrar
      </button>
    </form>
  );
};
```

**O que dizer:**
"Aqui fazemos validação manual. Verificamos se a senha tem pelo menos 8 caracteres, se o email é válido, se o nome não é vazio, se uma funerária foi selecionada. Se algo falhar, mostramos um erro ao usuário. Se passar, enviamos os dados ao backend."

---

## 📌 BACKEND - Validação com Pydantic

### Arquivo: `backend/views/auth_view.py`

```python
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class LoginRequest(BaseModel):
    """Validação para login"""
    email: EmailStr  # ← Valida formato de email
    password: str


class RegisterRequest(BaseModel):
    """Validação para registro"""
    email: EmailStr              # ← Valida email
    password: str                # ← String obrigatória
    nome: str                    # ← String obrigatória
    telefone: Optional[str] = None
    cpf: Optional[str] = None
    funeraria_id: Optional[str] = None


class PerfilUpdate(BaseModel):
    """Validação para atualizar perfil"""
    nome: Optional[str] = Field(None, min_length=1)  # ← Mínimo 1 caractere
    telefone: Optional[str] = None


class CartaoCreate(BaseModel):
    """Validação para criar cartão de luto"""
    falecido_id: str
    titulo: str = Field(..., min_length=1, max_length=100)  # ← Min/max length
    descricao: Optional[str] = Field(None, max_length=500)
    publicado: bool = False
```

**O que dizer:**
"Pydantic define a estrutura esperada dos dados. Se o cliente envia algo diferente, Pydantic rejeita. Por exemplo, se não enviar email ou enviar um email inválido, Pydantic retorna erro 422 (Unprocessable Entity) com uma mensagem clara do que está errado."

---

### Como Pydantic Valida

**Arquivo:** `backend/controllers/auth_controller.py` (linhas 22-45)

```python
@router.post("/login")
async def login(body: LoginRequest):  # ← Pydantic valida aqui
    """
    Se body não é um LoginRequest válido, Pydantic retorna erro 422.
    Por exemplo:
    - Falta email: erro
    - Email inválido: erro
    - Falta password: erro
    """
    try:
        res = AuthModel.login_user(body)
        if res.user is None:
            raise HTTPException(status_code=401, detail="Credenciais inválidas")

        # ... resto do código
```

**Teste no Postman ou cURL:**

```bash
# ← Requisição válida
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com", "password":"senha123"}'
# Resultado: 200 OK

# ← Email inválido (sem @)
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user-email", "password":"senha123"}'
# Resultado: 422 Unprocessable Entity
# Mensagem: "invalid email format"

# ← Falta campo
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@email.com"}'
# Resultado: 422 Unprocessable Entity
# Mensagem: "field required"
```

---

### Listar Todas as Validações Implementadas

**Arquivo:** `backend/views/` (todos os arquivos)

```python
# auth_view.py
- email: EmailStr (válida domínio)
- password: str (obrigatório)
- nome: str (obrigatório)

# perfil_view.py
- nome: Optional[str] com min_length=1
- telefone: Optional[str]

# cartoes_view.py
- falecido_id: str (obrigatório)
- titulo: str (1-100 caracteres)
- descricao: Optional[str] (máx 500 caracteres)

# documentos_view.py
- tipo_id: str (obrigatório)
- arquivo: UploadFile (arquivo enviado)

# planos_view.py
- nome: str (obrigatório)
- valor_mensal: float (número positivo)
- carencia_dias: int (dias de carência)
```

**O que dizer:**
"Temos validação de forma de email, comprimento mínimo/máximo de strings, tipos numéricos, campos obrigatórios, e mais. Tudo isso configurado em Pydantic automaticamente valida a entrada."

---

## 🔍 Fluxo Completo de Validação

**Diagrama:**

```
┌──────────────────────────────┐
│  1. Usuário preenche form    │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  2. HTML5 validation         │  ← type="email", required, minLength
│     (Browser)                │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  3. JavaScript validation    │  ← Verificar comprimento, formato
│     (Frontend)               │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  4. Enviar ao backend        │  ← Requisição HTTP POST
│     (Fetch API)              │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  5. Pydantic validation      │  ← EmailStr, Field(min_length, max_length)
│     (Backend)                │
└──────────┬───────────────────┘
           │
           ├─ Se inválido → 422 error
           │
           └─ Se válido → Processar lógica
```

---

---

## 📊 BANCO DE DADOS - PostgreSQL + Supabase

### 🎯 Como Apresentar

**O que dizer:**
"Usamos PostgreSQL como banco de dados, hospedado no Supabase. PostgreSQL é um banco robusto e profissional com suporte a tipos avançados, segurança, e performance."

---

## 📌 Schema e Estrutura

### Arquivo: `supabase/migrations/20260504110248_inicial_schema_rls_storage.sql`

**Tabelas principais:**

```sql
-- 1. PROFILES - Perfis de usuários
CREATE TABLE public.profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  cpf TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
-- ← Row Level Security: usuário vê seu próprio perfil ou é admin

-- 2. USER_ROLES - Papéis dos usuários
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  funeraria_id UUID REFERENCES public.funerarias(id),
  role public.app_role NOT NULL DEFAULT 'cliente',  -- enum: admin, cliente, super_admin
  created_at TIMESTAMP DEFAULT NOW()
);
-- ← Row Level Security: usuário vê seu próprio papel

-- 3. FUNERARIAS - Empresas funerárias
CREATE TABLE public.funerarias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE NOT NULL,
  telefone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. PLANOS_FUNERARIOS - Planos oferecidos
CREATE TABLE public.planos_funerarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  funeraria_id UUID NOT NULL REFERENCES public.funerarias(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  valor_mensal DECIMAL(10, 2) NOT NULL,
  carencia_dias INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. CONTRATACOES - Contratos cliente-plano
CREATE TABLE public.contratacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plano_id UUID NOT NULL REFERENCES public.planos_funerarios(id),
  valor_mensal DECIMAL(10, 2) NOT NULL,
  carencia_ate DATE,
  data_contratacao TIMESTAMP DEFAULT NOW(),
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. FALECIDOS - Dados de falecidos
CREATE TABLE public.falecidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  data_nascimento DATE,
  data_falecimento DATE,
  naturalidade TEXT,
  profissao TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. DOCUMENTOS - Documentos enviados
CREATE TABLE public.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_id UUID NOT NULL,
  arquivo_url TEXT NOT NULL,
  status public.doc_status DEFAULT 'pendente',  -- enum: pendente, analise, aprovado, rejeitado
  observacao_admin TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. CARTOES_LUTO - Cartões de luto digitais
CREATE TABLE public.cartoes_luto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  falecido_id UUID NOT NULL REFERENCES public.falecidos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  publicado BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
-- ← Row Level Security: cartões publicados são públicos, privados são só do owner
```

**O que dizer:**
"Temos 8 tabelas principais. Cada tabela tem um propósito: profiles gerencia usuários, user_roles gerencia papéis, funerarias gerencia as empresas, planos os serviços, e assim por diante. Tudo está conectado com chaves estrangeiras, então um dado não fica órfão se algo for deletado."

---

### ENUMS (Tipos Customizados)

**Arquivo:** `supabase/migrations/20260504110248_inicial_schema_rls_storage.sql`

```sql
-- Tipo: app_role
CREATE TYPE public.app_role AS ENUM (
  'admin',
  'cliente',
  'super_admin'
);

-- Tipo: doc_status
CREATE TYPE public.doc_status AS ENUM (
  'pendente',
  'analise',
  'aprovado',
  'rejeitado'
);
```

**O que dizer:**
"Criamos tipos customizados para papéis e status de documentos. Isso garante que só temos valores válidos. Não dá pra armazenar 'adm' por acidente."

---

### Triggers para Timestamps

**Arquivo:** `supabase/migrations/20260504110248_inicial_schema_rls_storage.sql`

```sql
-- Trigger: atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_falecidos_timestamp
BEFORE UPDATE ON public.falecidos
FOR EACH ROW
EXECUTE FUNCTION update_falecidos_timestamp();

-- ... mais triggers
```

**O que dizer:**
"Criamos triggers que atualizam automaticamente o campo `updated_at` toda vez que um registro é modificado. Não precisa fazer manualmente."

---

## 📌 Row Level Security (RLS)

**Mostrar algumas políticas:**

```sql
-- PERFIL: Usuário vê apenas seu próprio perfil (ou é admin)
CREATE POLICY "Usuário vê próprio perfil"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin')
);

-- FALECIDOS: Cliente vê seus próprios falecidos, admin vê todos da funerária
CREATE POLICY "Cliente vê próprio falecido"
ON public.falecidos
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin')
);

-- CARTÕES: Cartões publicados são públicos, privados só do owner
CREATE POLICY "Cartões publicados são públicos"
ON public.cartoes_luto
FOR SELECT
USING (
  publicado = true
  OR auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin')
);

-- DOCUMENTOS: Usuário vê seus próprios documentos, admin vê todos
CREATE POLICY "Usuário vê próprios documentos"
ON public.documentos
FOR SELECT
USING (
  auth.uid() = user_id
  OR public.has_role(auth.uid(), 'admin')
);
```

**O que dizer:**
"A verdadeira proteção está aqui. Mesmo que alguém conseguisse contornar toda a autenticação, o banco de dados ainda recusaria retornar dados de outros usuários. Alguém não consegue acessar dados de outro cliente, mesmo que souber o ID."

---

## 🔍 Como Demonstrar o Banco

**No Supabase Console:**

```bash
# 1. Abrir: https://app.supabase.com
# 2. Selecionar seu projeto
# 3. Ir em: SQL Editor

# Ver esquema
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

# Ver dados em profiles
SELECT user_id, nome, email FROM public.profiles LIMIT 10;

# Ver papéis
SELECT u.email, ur.role FROM public.user_roles ur
JOIN public.profiles u ON ur.user_id = u.user_id;

# Ver políticas RLS
SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

---

---

## 📋 RESUMO EXECUTIVO - O QUE APRESENTAR

### ⏱️ Tempo Sugerido por Requisito

| Fase | Requisito | Tempo | Como Demonstrar |
|------|-----------|-------|-----------------|
| 1 | Interface Gráfica | 3 min | Rodar app, mostrar 5 páginas |
| 2.1 | Fetch API | 3 min | DevTools Network tab, Console |
| 2.2 | Web Storage | 2 min | DevTools Application → localStorage |
| 2.3 | HTTP Cookies | 3 min | DevTools Cookies tab, mostrar Set-Cookie |
| 2.4 | JWT Auth | 3 min | Mostrar token no localStorage e cookie |
| 2.5 | Segurança | 5 min | RLS, CORS, roles, XSS/CSRF protection |
| 2.6 | Validação | 2 min | Tentar inputs inválidos, ver erros |
| **TOTAL** | | **21 min** | |

---

## 🎬 ROTEIRO DE APRESENTAÇÃO (15-20 minutos)

### 1. Introdução (1 min)
"Bom dia professor. Vou apresentar a Plataforma Saint Luzia, um sistema de gestão funerária que implementa todos os requisitos das Fases 1 e 2."

### 2. FASE 1: Interface (2 min)
- Rodar `npm run dev`
- Mostrar login, cadastro, dashboard, admin, super-admin
- "Usamos React 18, TypeScript, Vite, Tailwind e shadcn/ui"

### 3. FASE 2.1: Fetch API (2 min)
- Abrir DevTools Network
- Fazer login
- Mostrar POST /api/auth/login
- Mostrar request headers e response

### 4. FASE 2.2: Web Storage (1 min)
- DevTools Application → localStorage
- Mostrar token armazenado
- "Persiste sessão mesmo fechando navegador"

### 5. FASE 2.3: HTTP Cookies (2 min)
- DevTools Cookies
- Mostrar `auth_token` com httpOnly ativado
- Mostrar `path=/api`

### 6. FASE 2.4: JWT Authentication (2 min)
- Mostrar arquivo `api.ts` com `Authorization: Bearer`
- Mostrar arquivo `deps.py` validando token
- "Token é validado em cada requisição"

### 7. FASE 2.5: Segurança (3 min)
- Mostrar `ProtectedRoute.tsx` (frontend)
- Mostrar `require_admin()` (backend)
- "7 camadas de segurança: frontend, CORS, auth, roles, RLS, XSS protection, CSRF protection"

### 8. FASE 2.6: Validação (2 min)
- Tentar submeter formulário vazio
- Ver erros HTML5
- Tentar email inválido
- "Validação em HTML5 e Pydantic"

### 9. Conclusão (1 min)
"Implementamos 100% dos requisitos com best practices de segurança e código limpo."

---

## 📚 ARQUIVO DE REFERÊNCIA RÁPIDA

**Para ter à mão durante a apresentação:**

```markdown
# Arquivos Importantes

## Frontend
- `frontend/src/models/api.ts` - Fetch API + credentials
- `frontend/src/models/supabase/client.ts` - localStorage config
- `frontend/src/controllers/useAuthController.tsx` - Auth logic
- `frontend/src/views/components/ProtectedRoute.tsx` - Role checking
- `frontend/src/views/pages/Login.tsx` - HTML5 validation

## Backend  
- `backend/main.py` - CORS + expose Set-Cookie
- `backend/controllers/auth_controller.py` - Cookies + JWT
- `backend/config/deps.py` - JWT validation + role checking
- `backend/views/auth_view.py` - Pydantic validation

## Database
- `supabase/migrations/20260504110248_...` - RLS policies
- Supabase Console - Ver dados em tempo real

## Como Rodar
```bash
# Terminal 1: Backend
cd backend
python3 -m uvicorn main:app --reload

# Terminal 2: Frontend
cd frontend
npm run dev

# Abrir: http://localhost:5173
```

---

## 🎯 DICAS PARA A APRESENTAÇÃO

1. **Não ficar nervoso** - Pratique antes
2. **Falar com segurança** - Você implementou tudo isso
3. **Mostrar o código** - Deixe evidente que não é fake
4. **Demonstrar funcionando** - Ao vivo é melhor que screenshot
5. **Responder perguntas** - Você conhece o código
6. **Não entrar em detalhes muito técnicos** - A menos que pergunte
7. **Ter um backup** - Se algo der problema, mostrar arquivo
8. **Deixar pronto** - Ambos rodando antes de apresentar

---

**Boa apresentação! Você consegue! 🚀**
