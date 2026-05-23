# 🕊️ Plataforma Saint Luzia

Bem-vindo ao repositório do projeto **Saint Luzia**, um sistema moderno desenvolvido para a disciplina de **Projeto e Desenvolvimento de Sistemas de Informação (PDSI)**.

A plataforma atua como uma ponte digital empática e eficiente entre empresas funerárias parceiras e famílias em luto, reduzindo a burocracia e oferecendo um acompanhamento transparente de todos os trâmites do processo funerário.

---

## 🏛️ Arquitetura e Tecnologias

O projeto foi desenvolvido sob a arquitetura **MVC (Model-View-Controller)**, garantindo modularidade e manutenibilidade tanto no Frontend quanto no Backend. Ambos estão organizados em suas próprias pastas: `frontend/` e `backend/`.

```
PDSI_Segredo/
├── frontend/                 # Aplicação React (MVC)
│   ├── src/
│   │   ├── models/           # Tipos de domínio + acesso a dados (Supabase, API)
│   │   ├── views/            # Componentes React (pages + components)
│   │   ├── controllers/      # Hooks de lógica de negócio
│   │   ├── hooks/            # Hooks genéricos (auth, mobile, toast)
│   │   └── lib/              # Utilitários compartilhados
│   └── ...config files
│
├── backend/                  # API FastAPI (MVC)
│   ├── models/               # Regras de negócio + queries
│   ├── views/                # Schemas Pydantic (serialização)
│   ├── controllers/          # Rotas de API
│   └── config/               # Configuração e dependências
│
└── supabase/                 # Configuração do Supabase
```

### ⚛️ Frontend (React) — `frontend/`
- **Framework:** React com TypeScript e Vite.
- **Estilização:** Tailwind CSS e componentes [shadcn/ui].
- **Estrutura MVC (`frontend/src/`):**
  - `models/`: Camada de dados — tipos de domínio (`types.ts`), cliente HTTP (`api.ts`), cliente Supabase (`supabase/`) e models de acesso a dados (`usuarioModel.ts`, `planoModel.ts`, etc.).
  - `views/`: Componentes visuais — páginas (`pages/`) e componentes reutilizáveis (`components/`).
  - `controllers/`: Hooks customizados (ex: `useDashboardController`) que gerenciam estados e regras de negócio.

### 🐍 Backend (FastAPI) — `backend/`
- **Framework:** Python com FastAPI.
- **Autenticação:** Validação de JWT via Supabase Auth com middlewares dedicados (`deps.py`).
- **Geração de Imagens:** Biblioteca `Pillow` para composição em tempo real dos cartões de luto digitais (em PNG).
- **Estrutura MVC (`backend/`):**
  - `views/`: Schemas Pydantic para validação e serialização de dados (JSON).
  - `controllers/`: Rotas de API que roteiam a requisição.
  - `models/`: Lógica de regras de negócio pesada e queries de banco de dados.

### 🐘 Banco de Dados (Supabase)
- **Banco Relacional:** PostgreSQL com tabelas de usuários, planos, contratações, falecidos e documentos.
- **Segurança (RLS):** Row Level Security garantindo que um cliente jamais veja o contrato ou documento de outro.
- **Storage:** Buckets para salvar PDFs (Privado) e fotos dos cartões de luto (Público).

---

## 🛠️ Como Rodar o Projeto

Siga os passos abaixo para configurar e rodar todo o ecossistema na sua máquina local:

### 1. Configuração do Banco de Dados (Supabase)
1. **Use apenas 1 projeto Supabase para o grupo** (ex.: o do Raildom) e apontem **backend e frontend** para ele.
2. Aplique o schema:
   - preferencialmente rodando as migrations em `supabase/migrations/` no SQL Editor, **na ordem**; ou
   - (legado) rodando `backend/database_setup.sql`.
3. Na aba de configurações da API do Supabase, pegue a `URL`, a chave `anon` (publishable) e a chave `service_role`.
4. Configure as variáveis (não commitar chaves):
   - `backend/.env.local` (use `backend/.env.example` como base)
   - `frontend/.env.local` (use `frontend/.env.example` como base)

> Se vocês trocaram de projeto Supabase e aparecer erro de token/sessão (ex.: “Sessão expirada”), limpem o armazenamento do site (LocalStorage/Cookies) e façam login de novo.

### 2. Rodando o Backend (API)
Abra um terminal na raiz do projeto e instale as dependências (caso seja a primeira vez):
```bash
pip install fastapi uvicorn pydantic supabase pillow
```

Inicie o servidor local do FastAPI:
```bash
python3 -m uvicorn backend.main:app --port 8000 --reload
```
A API estará rodando em `http://127.0.0.1:8000`. A documentação completa da API (Swagger) pode ser acessada em `http://127.0.0.1:8000/docs`. Mantenha este terminal aberto!

### 3. Rodando o Frontend (Interface Web)
Abra um **segundo terminal** no VSCode e execute:

```bash
# Navegar até a pasta do frontend
cd frontend

# Instalar as dependências do Node.js
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```
Acesse o link gerado no terminal (geralmente `http://127.0.0.1:5173`) no seu navegador.

---

## 👥 Acessos e Perfis de Teste

A plataforma conta com três níveis de acesso (Roles): **Cliente**, **Admin** e **Super Administrador**.

**Para testar a visão do Administrador:**
1. Crie uma conta pelo site (ex: `admin@saintluzia.com`).
2. Acesse o **SQL Editor** do Supabase e rode um update no usuário desejado (ajuste o e-mail):
```sql
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = '<seu-email>@...' LIMIT 1);
```
3. Acesse a URL do Vite (ex: `http://127.0.0.1:5173/admin/login`) e faça o login.

**Para testar a visão do Super Administrador:**
1. Crie uma conta pelo site.
2. Promova o usuário para `super_admin`:
```sql
UPDATE public.user_roles
SET role = 'super_admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = '<seu-email>@...' LIMIT 1);
```
3. Acesse a URL do Vite (ex: `http://127.0.0.1:5173/admin/login`) e entre (o sistema redireciona para `/super-admin`).

**Para testar a visão do Cliente:**
1. Crie uma conta pelo site normalmente (ou cadastre-se via o painel). A conta já é configurada automaticamente como Cliente pelo banco de dados.

---
*Projeto Acadêmico - Funerária Saint Luzia © 2026*
