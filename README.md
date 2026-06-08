# 🕊️ Plataforma Saint Luzia

[![Build Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]()
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-Academic-purple)](https://github.com)

Bem-vindo ao repositório do projeto **Saint Luzia**, um sistema moderno desenvolvido para a disciplina de **Projeto e Desenvolvimento de Sistemas de Informação (PDSI)**.

## 📋 Descrição

A plataforma atua como uma ponte digital empática e eficiente entre empresas funerárias parceiras e famílias em luto. O sistema reduz burocracia, oferece acompanhamento transparente de todos os trâmites do processo funerário e facilita a geração de cartões de luto digitais personalizados.

### ✨ Principais Funcionalidades

- **Autenticação e Gerenciamento de Usuários** — Sistema seguro com Supabase Auth e validação JWT
- **Plataforma de Contratos** — Clientes podem visualizar e gerenciar planos funerários
- **Cartões de Luto Digitais** — Geração em tempo real com Pillow (Python)
- **Painel Administrativo** — Admins gerenciam planos, clientes e documentos
- **Super Administrador** — Gestão completa da plataforma e empresas funerárias
- **Validação de Documentos** — Fluxo de upload e aprovação de documentos
- **Armazenamento Seguro** — PostgreSQL com Row Level Security (RLS)

---

## 🏛️ Arquitetura e Tecnologias

O projeto foi desenvolvido sob a arquitetura **MVC (Model-View-Controller)**, garantindo modularidade e manutenibilidade tanto no Frontend quanto no Backend. Ambos estão organizados em suas próprias pastas: `frontend/` e `backend/`.

### 📁 Estrutura do Projeto

```
PDSI-I/
├── frontend/                          # Aplicação React (MVC)
│   ├── src/
│   │   ├── models/                    # Camada de dados
│   │   │   ├── types.ts              # Interfaces TypeScript
│   │   │   ├── api.ts                # Cliente HTTP centralizado
│   │   │   ├── supabase/             # Cliente Supabase
│   │   │   └── *Model.ts             # Models de acesso a dados
│   │   ├── views/                     # Componentes React (MVC)
│   │   │   ├── pages/                # Páginas (auth, admin, cliente, superadmin)
│   │   │   ├── components/           # Componentes reutilizáveis
│   │   │   │   └── ui/               # Componentes shadcn/ui
│   │   │   └── lib/                  # Utilitários (formatação, validação)
│   │   ├── controllers/              # Hooks de lógica de negócio (useXxxController)
│   │   ├── hooks/                    # Hooks genéricos (auth, mobile, toast)
│   │   └── App.tsx                   # Aplicação principal
│   ├── package.json
│   ├── vite.config.ts               # Configuração Vite
│   ├── tsconfig.json                # Configuração TypeScript
│   ├── eslint.config.js             # Regras de linting
│   └── .env.local                   # Variáveis de ambiente (local)
│
├── backend/                           # API FastAPI (MVC)
│   ├── main.py                       # Entrada da aplicação
│   ├── models/                       # Regras de negócio + queries
│   ├── views/                        # Schemas Pydantic (serialização)
│   ├── controllers/                  # Rotas de API
│   ├── config/                       # Configuração e dependências
│   ├── requirements.txt              # Dependências Python
│   └── .env.local                    # Variáveis de ambiente (local)
│
├── supabase/                          # Configuração do Supabase
│   └── migrations/                   # Migrations SQL em ordem
│
└── README.md                          # Este arquivo
```

### ⚛️ Frontend (React) — `frontend/`

**Tecnologias:**
- **Framework:** React 18 com TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS + componentes [shadcn/ui](https://ui.shadcn.com)
- **Validação:** Zod + react-hook-form
- **Requisições:** Fetch API com cliente HTTP centralizado
- **Estado:** React Hooks + Context API

**Estrutura MVC (`frontend/src/`):**
- **`models/`** — Camada de dados (tipos, cliente HTTP, cliente Supabase, models)
- **`views/`** — Componentes visuais (páginas + componentes reutilizáveis)
- **`controllers/`** — Hooks customizados que gerenciam estados e regras de negócio

### 🐍 Backend (FastAPI) — `backend/`

**Tecnologias:**
- **Framework:** FastAPI
- **Autenticação:** JWT via Supabase Auth
- **Geração de Imagens:** Pillow para cartões de luto em PNG
- **ORM/Query Builder:** Supabase Client Python
- **Validação:** Pydantic

**Estrutura MVC (`backend/`):**
- **`models/`** — Regras de negócio + queries ao banco de dados
- **`views/`** — Schemas Pydantic para validação e serialização
- **`controllers/`** — Rotas de API (FastAPI endpoints)
- **`config/`** — Configuração central (Supabase, JWT, CORS, etc.)

### 🐘 Banco de Dados (Supabase)

- **Motor:** PostgreSQL
- **Segurança:** Row Level Security (RLS) garante isolamento de dados
- **Storage:** Buckets para PDFs (privado) e fotos de cartões (público)
- **Realtime:** Subscrições WebSocket (opcional para futuras features)

**Tabelas principais:**
- `auth.users` — Usuários (gerenciado por Supabase Auth)
- `user_roles` — Papéis de acesso (cliente, admin, super_admin)
- `funerarias` — Empresas funerárias
- `planos_funerarios` — Planos oferecidos
- `contratacoes` — Contratos de clientes com planos
- `falecidos` — Dados de falecidos
- `documentos` — Documentos enviados e validações
- `cartoes_luto` — Cartões digitais

---

## 🚀 Requisitos do Sistema

### Backend
- **Python 3.9+**
- **pip** (gerenciador de pacotes Python)
- **Conta Supabase** (com projeto criado)

### Frontend
- **Node.js 18+**
- **npm** ou **yarn**
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

---

## 🛠️ Como Rodar o Projeto

### Pré-requisitos: Configuração do Supabase

1. **Criar projeto Supabase** (se não houver):
   - Acesse [supabase.com](https://supabase.com)
   - Crie um novo projeto

2. **Obter credenciais** (necessárias para `.env.local`):
   - Vá em **Project Settings → API**
   - Copie: `Project URL` e `Anon Key` (para o frontend)
   - Copie: `Service Role Key` (para o backend, **não compartilhe!**)

3. **Aplicar schema do banco de dados**:
   - Abra o **SQL Editor** do Supabase
   - Copie e cole o conteúdo de `supabase/migrations/` **em ordem numérica**
   - Execute cada migration

### 1️⃣ Setup Inicial (Ambos os lados)

**Opção A: Usando Make (Linux/Mac)**
```bash
make setup
```

**Opção B: Manual**

#### Frontend
```bash
cd frontend
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase
npm install
```

#### Backend
```bash
cd backend
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase
pip install -r requirements.txt
```

### 2️⃣ Rodando o Backend (API)

Abra um terminal e execute:

```bash
cd backend
python3 -m uvicorn main:app --port 8000 --reload
```

**Resultado esperado:**
- ✅ API rodando em `http://127.0.0.1:8000`
- ✅ Documentação Swagger em `http://127.0.0.1:8000/docs`
- ✅ Mantenha este terminal aberto durante o desenvolvimento

### 3️⃣ Rodando o Frontend (Interface Web)

Abra um **segundo terminal** e execute:

```bash
cd frontend
npm run dev
```

**Resultado esperado:**
- ✅ Frontend rodando em `http://127.0.0.1:5173` (ou próxima porta disponível)
- ✅ Acesse no navegador: `http://127.0.0.1:5173`

### 📊 Verificação de Setup

Se tudo estiver configurado corretamente, você verá:

- ✅ Frontend carregando sem erros (verificar console do navegador)
- ✅ Tela de login funcionando
- ✅ API respondendo em `/docs`
- ✅ Supabase conectado (sem erros de autenticação)

Se houver erro **”Configuração do Supabase ausente”**, verifique se:
- [ ] `.env.local` está criado no `frontend/`
- [ ] `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` estão preenchidos
- [ ] Você executou `npm run dev` **depois** de editar `.env.local`

---

## 👥 Acessos e Perfis de Teste

A plataforma conta com **três níveis de acesso (Roles)**:

| Role | Acesso | URL |
|------|--------|-----|
| **Cliente** | Visualizar planos, gerenciar cartão de luto, upload de documentos | `/` |
| **Admin** | Gerenciar clientes, planos, validar documentos | `/admin/login` |
| **Super Admin** | Gerenciar funerárias, admins e sistema completo | `/admin/login` → redireciona `/super-admin` |

### 🔓 Criar Conta de Teste

1. **Acesse:** `http://127.0.0.1:5173`
2. **Clique em:** "Não tem conta? Cadastre-se"
3. **Preencha:** Email e senha
4. **Conta será automaticamente vinculada como `Cliente`**

### 👤 Promover para Admin

Após criar sua conta:

1. **Abra SQL Editor do Supabase** (Project → SQL Editor)
2. **Execute o comando** (substitua o email):
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'seu-email@example.com' LIMIT 1);
```
3. **Acesse:** `http://127.0.0.1:5173/admin/login`
4. **Faça login** com a mesma conta
5. **Será redirecionado para:** `/admin/dashboard`

### 👑 Promover para Super Admin

1. **Execute no SQL Editor:**
```sql
UPDATE public.user_roles
SET role = 'super_admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'seu-email@example.com' LIMIT 1);
```
2. **Acesse:** `http://127.0.0.1:5173/admin/login`
3. **Sistema redireciona automaticamente para:** `/super-admin`

### 🧪 Testando Fluxos

**Cliente:**
- [ ] Login no site
- [ ] Visualizar planos disponíveis
- [ ] Editar cartão de luto
- [ ] Upload de documentos
- [ ] Visualizar contratações

**Admin:**
- [ ] Login em `/admin/login`
- [ ] Visualizar dashboard (estatísticas)
- [ ] Editar planos da funerária
- [ ] Validar documentos de clientes
- [ ] Visualizar lista de clientes

**Super Admin:**
- [ ] Login em `/admin/login` (com role super_admin)
- [ ] Acessar `/super-admin`
- [ ] Criar/editar funerárias
- [ ] Ver estatísticas do sistema

---

## 🐛 Troubleshooting

### "Configuração do Supabase ausente"
**Solução:**
```bash
cd frontend
# Verifique se .env.local existe
ls -la .env.local

# Se não existir, copie do exemplo:
cp .env.example .env.local

# Edite e preencha com suas credenciais:
# VITE_SUPABASE_URL=https://seu-projeto.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica

# Reinicie o servidor:
npm run dev
```

### "Sessão expirada" ou "Token inválido"
**Solução:**
1. Abra DevTools (F12)
2. Vá em **Application → Local Storage**
3. **Limpe todo o storage** do site
4. **Recarregue a página** (Ctrl+R)
5. **Faça login novamente**

### API retornando erro 401
**Solução:**
1. Verifique se o backend está rodando: `http://127.0.0.1:8000/docs`
2. Verifique se `.env.local` do backend tem credenciais Supabase corretas
3. Certifique-se que o token JWT é válido (não expirou)
4. Reinicie o backend: `python3 -m uvicorn backend.main:app --port 8000 --reload`

### "Port 5173 is already in use"
**Solução:**
```bash
# Opção 1: Deixar Vite escolher outra porta
npm run dev
# Ele escolherá 5174, 5175, etc automaticamente

# Opção 2: Usar outra porta explicitamente
npm run dev -- --port 3000
```

### Build falhando com erros de tipos
**Solução:**
```bash
# Limpe node_modules e reinstale
rm -rf frontend/node_modules
rm frontend/package-lock.json
npm install

# Execute o build novamente
npm run build
```

---

## 📚 Scripts Disponíveis

### Frontend
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run lint         # Verifica código (ESLint)
npm run preview      # Preview do build local
```

### Backend
```bash
python3 -m uvicorn main:app --reload   # Inicia servidor com auto-reload
python3 -m uvicorn main:app --port 8000 # Especifica porta
```

---

## 📦 Dependências Principais

### Frontend
- react@18 - UI library
- react-router-dom - Roteamento
- typescript - Type safety
- tailwindcss - Styling
- shadcn/ui - Componentes reutilizáveis
- @supabase/supabase-js - Cliente Supabase
- vite - Build tool
- eslint - Linting

### Backend
- fastapi - API framework
- uvicorn - ASGI server
- pydantic - Data validation
- supabase - Database client
- python-dotenv - Environment variables
- pillow - Image generation

---

## ✅ Recente Refatoração (v0.2.0)

### 🧹 Limpeza de Código
- ✅ Removidos 30 componentes UI não utilizados
- ✅ Corrigidas importações não utilizadas (2 ícones removidos)
- ✅ Removidos 3 endpoints API não utilizados
- ✅ Consolidada função `slugify` (duplicação eliminada)
- ✅ Build size reduzido em ~10%

### 📊 Resultados
- **Linhas removidas:** 800+
- **Build time:** 6.22s ✓
- **Linting:** ✓ Sem novos erros
- **Test Coverage:** Em progresso

---

## 🤝 Guia de Contribuição

### Workflow Git

```bash
# 1. Certifique-se de estar na branch main
git checkout main

# 2. Atualize a branch local
git pull origin main

# 3. Crie uma branch para sua feature
git checkout -b feature/sua-funcionalidade

# 4. Implemente sua mudança
# ... edite os arquivos ...

# 5. Commit suas mudanças
git add .
git commit -m "feat: descrição clara da mudança"

# 6. Push para o repositório remoto
git push origin feature/sua-funcionalidade

# 7. Crie um Pull Request no GitHub
```

### Convenção de Commits

- `feat:` — Nova funcionalidade
- `fix:` — Correção de bug
- `refactor:` — Refatoração
- `docs:` — Documentação
- `test:` — Testes
- `chore:` — Dependências, config

---

## 🔒 Segurança

**Nunca commite:**
- `.env.local` (variáveis sensíveis)
- Chaves privadas (service_role)
- Tokens JWT
- Credenciais de terceiros

**Sempre use `.env.example` como template**

---

## 📄 Licença

Projeto Acadêmico - Não comercial.

© 2026 Saint Luzia. Todos os direitos reservados.

**Desenvolvido para a disciplina PDSI**
