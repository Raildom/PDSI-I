# 📍 MAPA DE REQUISITOS - PDSI-I

## ⭐ FASE 1: DESENVOLVIMENTO DE INTERFACE GRÁFICA

### ✅ Requisito: Framework Frontend

| Item | Localização | Arquivo | Linhas |
|------|-----------|---------|--------|
| **React 18.3.1** | Dependência principal | `frontend/package.json` | 54 |
| **TypeScript 5.8.3** | Linguagem | `frontend/tsconfig.json` | - |
| **Vite 5.4.19** | Build tool | `frontend/vite.config.ts` | 1-20 |
| **Tailwind CSS 3.4.19** | Estilização | `frontend/tailwind.config.ts` | - |
| **shadcn/ui** | Componentes | `frontend/src/views/components/ui/` | 26 arquivos |
| **React Router 6.30.1** | Roteamento | `frontend/src/App.tsx` | - |
| **20 Páginas** | Interface | `frontend/src/views/pages/` | - |
| **26 Componentes** | Reutilizáveis | `frontend/src/views/components/` | - |

---

## 🔗 FASE 2: IMPLEMENTAÇÃO DE CONCEITOS TÉCNICOS

### ✅ REQUISITO 1: COMUNICAÇÃO SÍNCRONA E ASSÍNCRONA (FETCH API)

| Especificação | Arquivo | Linhas |
|---------------|---------|--------|
| **Cliente HTTP Fetch** | `frontend/src/models/api.ts` | 15-51 |
| **async/await** | `frontend/src/models/api.ts` | 10-13, 15-51 |
| **.then().catch()** | `frontend/src/controllers/useAuthController.tsx` | - |
| **Backend FastAPI async** | `backend/controllers/auth_controller.py` | 22-45 |
| **POST /api/auth/login** | `backend/controllers/auth_controller.py` | 22-45 |
| **GET /api/falecidos** | `frontend/src/models/api.ts` | 80-86 |
| **Upload de arquivo FormData** | `frontend/src/models/api.ts` | 91-96 |

**Como testar:**
- Abrir DevTools → Network tab
- Fazer login
- Ver requisição POST /api/auth/login

---

### ✅ REQUISITO 2: WEB STORAGE API

| Especificação | Arquivo | Linhas |
|---------------|---------|--------|
| **localStorage configurado** | `frontend/src/models/supabase/client.ts` | 22 |
| **persistSession: true** | `frontend/src/models/supabase/client.ts` | 9 |
| **autoRefreshToken: true** | `frontend/src/models/supabase/client.ts` | 10 |
| **Recuperar sessão** | `frontend/src/controllers/useAuthController.tsx` | - |
| **Token persistido** | localStorage | sb-XXXXX-auth-token |

**Como testar:**
- DevTools → Application → Local Storage
- Ver chave: `sb-XXXXX-auth-token`
- Fazer login e ver token armazenado

---

### ✅ REQUISITO 3: HTTP COOKIES

| Especificação | Arquivo | Linhas |
|---------------|---------|--------|
| **credentials: "include"** | `frontend/src/models/api.ts` | 36 |
| **Set-Cookie header** | `backend/controllers/auth_controller.py` | 47-55 |
| **httpOnly=True** | `backend/controllers/auth_controller.py` | 50 |
| **SameSite=Lax** | `backend/controllers/auth_controller.py` | 52 |
| **max_age=3600** | `backend/controllers/auth_controller.py` | 53 |
| **path=/api** | `backend/controllers/auth_controller.py` | 54 |
| **Endpoint /logout** | `backend/controllers/auth_controller.py` | 64-80 |
| **delete_cookie()** | `backend/controllers/auth_controller.py` | 73-78 |
| **CORS expose_headers** | `backend/main.py` | 34 |

**Como testar:**
- DevTools → Application → Cookies
- Fazer login
- Ver cookie `auth_token` com HttpOnly ✓

---

### ✅ REQUISITO 4: HTTP AUTHENTICATION

| Especificação | Arquivo | Linhas |
|---------------|---------|--------|
| **Supabase Auth** | `frontend/src/models/authModel.ts` | - |
| **signInWithPassword()** | `frontend/src/models/authModel.ts` | - |
| **signUp()** | `frontend/src/models/authModel.ts` | - |
| **JWT Token** | `frontend/src/models/api.ts` | 10-13 |
| **Bearer scheme** | `frontend/src/models/api.ts` | 25 |
| **Authorization header** | `frontend/src/models/api.ts` | 25 |
| **get_current_user()** | `backend/config/deps.py` | 48-63 |
| **Depends(get_current_user)** | `backend/controllers/perfil_controller.py` | - |
| **Token validation** | `backend/config/deps.py` | 56-62 |

**Como testar:**
- DevTools → Network → POST /api/auth/login
- Ver Response: `access_token`, `refresh_token`
- Ver Request Header: `Authorization: Bearer eyJ...`

---

### ✅ REQUISITO 5: MECANISMO DE SEGURANÇA

#### **CAMADA 1: Row Level Security (RLS)**
| Item | Arquivo | Linhas |
|------|---------|--------|
| **Políticas RLS** | `supabase/migrations/20260504110248_inicial_schema_rls_storage.sql` | - |
| **Perfil policy** | `supabase/migrations/.../` | - |
| **Falecidos policy** | `supabase/migrations/.../` | - |
| **Cartões policy** | `supabase/migrations/.../` | - |
| **6+ políticas** | `supabase/migrations/` | - |

#### **CAMADA 2: CORS**
| Item | Arquivo | Linhas |
|------|---------|--------|
| **CORSMiddleware** | `backend/main.py` | 28-34 |
| **allow_origins** | `backend/main.py` | 30 |
| **allow_credentials=True** | `backend/main.py` | 31 |
| **expose_headers** | `backend/main.py` | 34 |

#### **CAMADA 3: Role-Based Access Control (RBAC)**
| Item | Arquivo | Linhas |
|------|---------|--------|
| **ProtectedRoute** | `frontend/src/views/components/ProtectedRoute.tsx` | - |
| **requireAdmin** | `frontend/src/views/components/ProtectedRoute.tsx` | - |
| **requireSuper** | `frontend/src/views/components/ProtectedRoute.tsx` | - |
| **require_admin()** | `backend/config/deps.py` | 80-94 |
| **require_super_admin()** | `backend/config/deps.py` | 96-105 |
| **3 papéis** | `backend/views/auth_view.py` | admin, cliente, super_admin |

#### **CAMADA 4: XSS Protection (httpOnly)**
| Item | Arquivo | Linhas |
|------|---------|--------|
| **httponly=True** | `backend/controllers/auth_controller.py` | 50 |

#### **CAMADA 5: CSRF Protection (SameSite)**
| Item | Arquivo | Linhas |
|------|---------|--------|
| **samesite="Lax"** | `backend/controllers/auth_controller.py` | 52 |

#### **CAMADA 6: Input Sanitization**
| Item | Arquivo | Linhas |
|------|---------|--------|
| **safe_name sanitize** | `backend/controllers/cartoes_controller.py` | 86-87 |

#### **CAMADA 7: Input Validation**
| Item | Arquivo | Linhas |
|------|---------|--------|
| **Pydantic models** | `backend/views/auth_view.py` | - |
| **EmailStr** | `backend/views/auth_view.py` | - |

---

### ✅ REQUISITO 6: VALIDAÇÃO DE FORMULÁRIOS

| Especificação | Arquivo | Linhas |
|---------------|---------|--------|
| **HTML5 type="email"** | `frontend/src/views/pages/Login.tsx` | - |
| **HTML5 required** | `frontend/src/views/pages/Login.tsx` | - |
| **HTML5 minLength={8}** | `frontend/src/views/pages/Login.tsx` | - |
| **JavaScript validação** | `frontend/src/views/pages/Cadastro.tsx` | - |
| **Pydantic EmailStr** | `backend/views/auth_view.py` | - |
| **Pydantic Field()** | `backend/views/auth_view.py` | - |
| **min_length, max_length** | `backend/views/auth_view.py` | - |
| **422 error response** | `backend/controllers/auth_controller.py` | - |

**Como testar:**
- Abrir http://localhost:5173/login
- Tentar submeter vazio
- Ver validação HTML5
- DevTools Console: `curl` com dados inválidos
- Ver 422 error

---

## 🏗️ FASE 3: INTEGRAÇÃO COM BANCO DE DADOS E FINALIZAÇÃO

### ✅ Banco de Dados

| Item | Localização | Arquivo |
|------|-----------|---------|
| **PostgreSQL** | Supabase | - |
| **9 Migrations** | `supabase/migrations/` | - |
| **Schema inicial** | `supabase/migrations/20260504110248_...` | - |
| **RLS Storage** | `supabase/migrations/20260504110248_...` | - |
| **Multitenancy** | `supabase/migrations/20260505111312_...` | - |
| **ENUMS** | `supabase/migrations/20260504110248_...` | app_role, doc_status |
| **9 Tabelas** | Supabase Console | profiles, user_roles, planos, falecidos, contratacoes, documentos, cartoes_luto, funerarias, processo_etapas |

**Localização BD:**
- `https://app.supabase.com` → Projeto → SQL Editor

### ✅ Conexão ao Banco

| Lado | Arquivo | Linhas |
|------|---------|--------|
| **Frontend Supabase Client** | `frontend/src/models/supabase/client.ts` | - |
| **Backend Supabase Client** | `backend/config/deps.py` | - |
| **Variáveis .env** | `frontend/.env.local` | VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY |
| **Variáveis .env** | `backend/.env.local` | SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY |

### ✅ Framework Server-side

| Item | Arquivo |
|------|---------|
| **FastAPI** | `backend/main.py` |
| **10 Controllers** | `backend/controllers/` |
| **9 Models** | `backend/models/` |
| **Pydantic Views** | `backend/views/` |

### ✅ Testes do Sistema

| Item | Arquivo | Linhas |
|------|---------|--------|
| **Vitest configurado** | `frontend/vitest.config.ts` | - |
| **Teste exemplo** | `frontend/src/test/example.test.ts` | - |
| **npm run test** | `frontend/package.json` | 12 |
| **npm run test:watch** | `frontend/package.json` | 13 |
| **TestClient FastAPI** | `backend` | Disponível via fastapi.testclient |

**Como rodar testes:**
```bash
# Frontend
npm run test

# Backend
pytest backend/tests/ -v
```

---

## 📍 RESUMO VISUAL

```
FASE 1: Interface Gráfica
├── React + TypeScript (frontend/package.json)
├── Vite + Tailwind + shadcn/ui (frontend/*.config.ts)
├── 20 páginas (frontend/src/views/pages/)
└── 26 componentes (frontend/src/views/components/)

FASE 2: Requisitos Técnicos
├── 1. Fetch API (frontend/src/models/api.ts:15-51)
├── 2. localStorage (frontend/src/models/supabase/client.ts:22)
├── 3. Cookies (backend/controllers/auth_controller.py:47-55)
├── 4. JWT Auth (frontend/src/models/api.ts + backend/config/deps.py)
├── 5. 7 Camadas Segurança (RLS, CORS, RBAC, XSS, CSRF, Input)
└── 6. Validação (HTML5 + Pydantic)

FASE 3: Integração
├── Banco: PostgreSQL Supabase (https://app.supabase.com)
├── 9 Migrations (supabase/migrations/)
├── 10 Controllers FastAPI (backend/controllers/)
└── Testes: Vitest (frontend/vitest.config.ts) + TestClient
```

---

## 🚀 COMO USAR

1. **Mostrar Requisito 1?** → Abrir `frontend/src/models/api.ts` linhas 15-51
2. **Mostrar Cookies?** → Abrir `backend/controllers/auth_controller.py` linhas 47-55
3. **Mostrar RLS?** → Ir em Supabase Console → SQL Editor
4. **Mostrar Validação?** → Abrir `backend/views/auth_view.py`
5. **Rodar Testes?** → `npm run test` no frontend

---

**Cada linha leva direto ao código!** ✅
