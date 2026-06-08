# 🕊️ Saint Luzia — Plataforma de Gestão Funerária

[![Status](https://img.shields.io/badge/status-finalizado-success)]()
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/deploy-Vercel-000000)](https://vercel.com)
[![License](https://img.shields.io/badge/License-Academic-purple)]()

Sistema completo de gestão funerária desenvolvido para a disciplina **Projeto e Desenvolvimento de Sistemas de Informação (PDSI)** da **UFPI**.

A plataforma conecta famílias enlutadas a empresas funerárias parceiras, reduzindo burocracia, oferecendo acompanhamento transparente dos trâmites do processo funerário e disponibilizando ferramentas digitais como cartões de luto personalizados.

---

## 📋 Funcionalidades

| Módulo | Funcionalidades |
|--------|----------------|
| **Autenticação** | Cadastro e login com três níveis de acesso (cliente, admin, super_admin) |
| **Cliente** | Dashboard com checklist do processo, visualização e contratação de planos, upload de documentos, cadastro de falecido, criação de cartão de luto digital |
| **Admin (Funerária)** | Dashboard com estatísticas, gestão de planos, validação de documentos, lista de clientes, edição de perfil da funerária |
| **Super Admin** | Gestão completa de funerárias (criar, editar, excluir), criação de contas admin para cada funerária |
| **Cartão de Luto** | Geração de cartões em PNG com 3 templates (clássico, religioso, moderno); upload de foto; página pública compartilhável via slug |
| **Documentos** | Upload, validação (aprovar/rejeitar) com observações; armazenamento seguro com links temporários |
| **Multi-tenant** | Isolamento completo de dados entre funerárias via Row Level Security (RLS) do Supabase |

---

## 🏛️ Arquitetura

O projeto segue o padrão **MVC (Model-View-Controller)** em ambos os lados, garantindo modularidade e manutenibilidade.

```
PDSI-I/
├── frontend/                           # Aplicação React (View + Controller)
│   ├── src/
│   │   ├── models/                     # Camada de dados (API client, tipos, models)
│   │   │   ├── types.ts               # Interfaces TypeScript
│   │   │   ├── api.ts                 # Cliente HTTP centralizado (FastAPI)
│   │   │   ├── supabase/              # Cliente Supabase (auth, storage)
│   │   │   └── *Model.ts             # Models de acesso direto ao Supabase
│   │   ├── views/                      # Componentes React
│   │   │   ├── pages/                 # Páginas (auth, admin, cliente, superadmin)
│   │   │   ├── components/            # Componentes reutilizáveis
│   │   │   └── lib/                   # Utilitários
│   │   ├── controllers/               # Hooks de lógica de negócio
│   │   └── App.tsx                    # Roteamento principal
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
│
├── backend/                            # API FastAPI (Model + Controller)
│   ├── main.py                        # Entrada da aplicação
│   ├── models/                        # Regras de negócio + queries
│   ├── views/                         # Schemas Pydantic (validação/serialização)
│   ├── controllers/                   # Rotas de API
│   ├── config/                        # Configuração (Supabase, JWT, CORS)
│   └── requirements.txt
│
├── api/
│   └── index.py                       # Entrypoint serverless para Vercel
│
├── supabase/
│   └── migrations/                    # Migrations SQL (9 arquivos, em ordem)
│
└── README.md
```

### Fluxo de Dados

```
Navegador (React)
    ↕  HTTP + JWT Bearer
FastAPI (Vercel Serverless)
    ↕  Service Role Key
Supabase (PostgreSQL + Auth + Storage)
```

O frontend se comunica com o backend FastAPI via HTTP, enviando o token JWT do Supabase Auth automaticamente em cada requisição. O backend usa a **service role key** do Supabase para acessar o banco com privilégios elevados (bypass RLS), enquanto as políticas RLS do PostgreSQL garantem o isolamento entre funerárias.

---

## ⚛️ Frontend (React + Vite)

**Stack:**
- **Framework:** React 18 com TypeScript 5.8
- **Build:** Vite 5
- **Estilização:** Tailwind CSS 3.4 + shadcn/ui (componentes Radix UI)
- **Formulários:** React Hook Form + Zod
- **Requisições:** Fetch API com cliente HTTP centralizado (`api.ts`)
- **Estado:** React Hooks + Context API (Auth)
- **Cache/Query:** TanStack React Query 5
- **Gráficos:** Recharts
- **Roteamento:** React Router DOM 6
- **Testes:** Vitest + Testing Library
- **Máscaras:** react-input-mask
- **Datas:** date-fns

### Estrutura MVC (Frontend)

- **`models/`** — Tipos TypeScript, cliente HTTP, cliente Supabase, models para acesso direto ao banco
- **`views/`** — Páginas e componentes de UI (shadcn/ui + componentes customizados)
- **`controllers/`** — Hooks customizados que encapsulam a lógica de negócio

### Rotas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/` | Público | Landing page |
| `/login` | Público | Login do cliente |
| `/cadastro` | Público | Cadastro do cliente |
| `/admin/login` | Público | Login administrativo |
| `/cartao/:slug` | Público | Página pública do cartão de luto |
| `/cliente/*` | Cliente | Dashboard, planos, documentos, cartão, falecido, perfil |
| `/admin/*` | Admin/Super | Dashboard, clientes, planos, documentos, perfil, config |
| `/super-admin/*` | Super Admin | Dashboard, funerárias |

---

## 🐍 Backend (FastAPI)

**Stack:**
- **Framework:** FastAPI 0.115
- **Servidor:** Uvicorn + Vercel Serverless Python
- **Autenticação:** JWT via Supabase Auth (com depósito `require_admin`/`require_super_admin`)
- **Validação:** Pydantic v2
- **Banco:** Supabase Client Python (service_role)
- **Imagens:** Pillow (geração de cartões de luto em PNG)
- **Upload:** python-multipart
- **Requisições HTTP:** httpx

### Endpoints da API

| Prefixo | Tags | Descrição |
|---------|------|-----------|
| `GET /api/health` | — | Health check |
| `POST /api/auth/*` | Autenticação | Register, login, logout |
| `GET/PUT /api/perfil` | Perfil | Obter/atualizar perfil do usuário |
| `GET /api/funerarias/ativas` | Funerárias | Lista funerárias ativas (público) |
| `GET/POST/PUT /api/planos/*` | Planos | Listar, criar, atualizar planos |
| `GET/POST /api/contratacoes/*` | Contratações | Contratar, cancelar, trocar plano |
| `GET/POST/PUT /api/falecidos/*` | Falecidos | CRUD de falecidos |
| `GET/POST/PUT /api/documentos/*` | Documentos | Upload, validação, download |
| `GET/POST/PUT /api/cartoes/*` | Cartão de Luto | Criar, editar, download PNG, upload foto |
| `GET /api/cartoes/publico/:slug` | Cartão de Luto | Página pública do cartão |
| `GET /api/admin/*` | Administração | Dashboard stats, clientes, docs pendentes |
| `GET /api/processos/*` | Processos | Checklist de etapas |
| `GET/POST/PUT/DELETE /api/super-admin/funerarias/*` | Super Admin | Gestão de funerárias |

---

## 🐘 Banco de Dados (Supabase PostgreSQL)

**Esquema completo** (9 migrations em ordem numérica):

### Tabelas

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Perfis de usuário (nome, email, telefone, CPF, funeraria_id) |
| `user_roles` | Papéis de acesso (cliente, admin, super_admin) |
| `funerarias` | Empresas funerárias |
| `planos` | Planos funerários (título, descrição, valor, benefícios) |
| `contratacoes` | Contratos (usuário × plano, status, carência) |
| `falecidos` | Dados dos falecidos (nome, datas, CPF, parentesco) |
| `tipos_documento` | Tipos de documento necessários |
| `documentos` | Documentos enviados (arquivo, status, validação) |
| `processo_etapas` | Checklist do processo funerário |
| `cartoes_luto` | Cartões de luto digitais (slug, template, foto) |
| `funeraria_admin_credentials` | Credenciais de admin por funerária |

### Segurança

- **Row Level Security (RLS)** ativo em todas as tabelas
- Isolamento multi-tenant: admins só acessam dados de sua própria funerária
- Clientes acessam apenas seus próprios dados
- Funções `SECURITY DEFINER` (`has_role`, `get_user_funeraria`) com execução restrita
- Buckets de storage: `documentos` (privado, links temporários) e `cartoes` (público)

---

## 🚀 Deploy

O projeto está configurado para deploy na **Vercel**:

- **Frontend:** Build estático com Vite, servido como SPA com rewrites
- **API:** Serverless Functions (Python) via `api/index.py`
- **Banco:** Supabase (PostgreSQL gerenciado)

### Variáveis de Ambiente

**Frontend** — criar `frontend/.env.local`:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-anon
```

**Backend** — criar `backend/.env.local`:
```env
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

---

## 🛠️ Desenvolvimento Local

### Pré-requisitos

- Node.js 18+
- Python 3.9+
- Conta Supabase com projeto criado

### 1. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Obtenha as credenciais em **Project Settings → API**
3. Execute as migrations do diretório `supabase/migrations/` em ordem no SQL Editor

### 2. Backend

```bash
cd backend
# Crie o arquivo backend/.env.local com:
# SUPABASE_URL=https://seu-projeto.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

API disponível em `http://127.0.0.1:8000`  
Documentação Swagger em `http://127.0.0.1:8000/docs`

### 3. Frontend

```bash
cd frontend
# Crie o arquivo frontend/.env.local com:
# VITE_SUPABASE_URL=https://seu-projeto.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica-anon
npm install
npm run dev
```

Frontend disponível em `http://127.0.0.1:5173`

---

## 👥 Perfis de Acesso

| Papel | Acesso | URL de Login |
|-------|--------|--------------|
| **Cliente** | Dashboard, planos, documentos, cartão de luto, falecido | `/login` |
| **Admin** | Dashboard da funerária, gestão de planos, validação de documentos, clientes | `/admin/login` |
| **Super Admin** | Gestão de todas as funerárias, criação de contas admin | `/admin/login` |

### Testando

Para criar um admin, execute no SQL Editor do Supabase:
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'seu-email@example.com' LIMIT 1);
```

Para criar um super_admin:
```sql
UPDATE public.user_roles
SET role = 'super_admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'seu-email@example.com' LIMIT 1);
```

---

## 📦 Dependências Principais

### Frontend
`react`, `react-router-dom`, `@supabase/supabase-js`, `@tanstack/react-query`, `tailwindcss`, `zod`, `react-hook-form`, `@hookform/resolvers`, `lucide-react`, `recharts`, `date-fns`, `sonner`, `react-input-mask`, `cmdk`, `vaul`, `input-otp`

### Backend
`fastapi`, `uvicorn`, `supabase`, `pydantic`, `python-multipart`, `pillow`, `httpx`, `python-jose`, `python-dotenv`, `email-validator`

---

## 📄 Licença

Projeto Acadêmico — Não comercial.

**© 2026 Saint Luzia · UFPI — Disciplina PDSI I**

Desenvolvido por [Raildom da Rocha Sobrinho](https://github.com/Raildom), [João Marcos Sousa Rufino Leal](https://github.com/JM3L0) e [Luma Maiara Holanda](https://github.com/lumamaiara) — Sistemas de Informação, UFPI
