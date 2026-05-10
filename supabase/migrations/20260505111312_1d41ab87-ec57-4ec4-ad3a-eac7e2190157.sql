
-- 1. Tabela funerarias
CREATE TABLE public.funerarias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  razao_social text NOT NULL,
  cnpj text UNIQUE,
  logo_url text,
  telefone text,
  email text,
  endereco text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.funerarias ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_funerarias_updated_at
BEFORE UPDATE ON public.funerarias
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Vincular entidades à funerária
ALTER TABLE public.profiles
  ADD COLUMN funeraria_id uuid REFERENCES public.funerarias(id) ON DELETE SET NULL,
  ADD COLUMN cpf text,
  ADD COLUMN endereco text;

ALTER TABLE public.planos
  ADD COLUMN funeraria_id uuid REFERENCES public.funerarias(id) ON DELETE CASCADE;

ALTER TABLE public.user_roles
  ADD COLUMN funeraria_id uuid REFERENCES public.funerarias(id) ON DELETE SET NULL;

ALTER TABLE public.cartoes_luto
  ADD COLUMN template_usado text DEFAULT 'classico',
  ADD COLUMN url_arquivo text;

-- 3. Função: retorna funeraria_id do admin logado
CREATE OR REPLACE FUNCTION public.get_user_funeraria(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT funeraria_id FROM public.user_roles
   WHERE user_id = _user_id AND role = 'admin'
   LIMIT 1
$$;

-- 4. Seed: funerária demo + vincular planos existentes
INSERT INTO public.funerarias (id, razao_social, cnpj, telefone, email, endereco)
VALUES ('00000000-0000-0000-0000-000000000001',
        'Saint Luzia Matriz', '00.000.000/0001-00',
        '(86) 0000-0000', 'contato@saintluzia.com',
        'Picos - PI');

UPDATE public.planos
   SET funeraria_id = '00000000-0000-0000-0000-000000000001'
 WHERE funeraria_id IS NULL;

-- 5. RLS — Funerarias
CREATE POLICY "Funerárias visíveis publicamente"
ON public.funerarias FOR SELECT
USING (ativo = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin atualiza própria funerária"
ON public.funerarias FOR UPDATE
USING (id = public.get_user_funeraria(auth.uid()));

CREATE POLICY "Admin insere funerária"
ON public.funerarias FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Atualizar RLS de planos para isolamento por funerária
DROP POLICY IF EXISTS "Admin gerencia planos" ON public.planos;
DROP POLICY IF EXISTS "Planos ativos são públicos" ON public.planos;

CREATE POLICY "Planos ativos visíveis"
ON public.planos FOR SELECT
USING (ativo = true OR funeraria_id = public.get_user_funeraria(auth.uid()));

CREATE POLICY "Admin gerencia planos da própria funerária"
ON public.planos FOR ALL
USING (funeraria_id = public.get_user_funeraria(auth.uid()))
WITH CHECK (funeraria_id = public.get_user_funeraria(auth.uid()));

-- 7. Atualizar RLS de profiles para multi-tenant
DROP POLICY IF EXISTS "Admin gerencia perfis" ON public.profiles;

CREATE POLICY "Admin gerencia perfis da própria funerária"
ON public.profiles FOR ALL
USING (funeraria_id = public.get_user_funeraria(auth.uid()))
WITH CHECK (funeraria_id = public.get_user_funeraria(auth.uid()));

-- 8. Documentos: admin só vê de clientes da sua funerária
DROP POLICY IF EXISTS "Cliente vê próprios documentos" ON public.documentos;
DROP POLICY IF EXISTS "Cliente atualiza próprio documento" ON public.documentos;
DROP POLICY IF EXISTS "Admin deleta documento" ON public.documentos;

CREATE POLICY "Cliente vê próprios documentos"
ON public.documentos FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.user_id = documentos.user_id
                AND p.funeraria_id = public.get_user_funeraria(auth.uid()))
);

CREATE POLICY "Cliente/Admin atualiza documento"
ON public.documentos FOR UPDATE
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.user_id = documentos.user_id
                AND p.funeraria_id = public.get_user_funeraria(auth.uid()))
);

CREATE POLICY "Admin deleta documento da funerária"
ON public.documentos FOR DELETE
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.user_id = documentos.user_id
                AND p.funeraria_id = public.get_user_funeraria(auth.uid()))
);

-- 9. Falecidos: admin só vê dos clientes da sua funerária
DROP POLICY IF EXISTS "Cliente vê próprio falecido" ON public.falecidos;
DROP POLICY IF EXISTS "Cliente atualiza próprio falecido" ON public.falecidos;
DROP POLICY IF EXISTS "Cliente deleta próprio falecido" ON public.falecidos;

CREATE POLICY "Cliente/Admin vê falecido"
ON public.falecidos FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.user_id = falecidos.user_id
                AND p.funeraria_id = public.get_user_funeraria(auth.uid()))
);

CREATE POLICY "Cliente/Admin atualiza falecido"
ON public.falecidos FOR UPDATE
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.user_id = falecidos.user_id
                AND p.funeraria_id = public.get_user_funeraria(auth.uid()))
);

CREATE POLICY "Cliente/Admin deleta falecido"
ON public.falecidos FOR DELETE
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.user_id = falecidos.user_id
                AND p.funeraria_id = public.get_user_funeraria(auth.uid()))
);

-- 10. Contratações: admin da funerária do plano
DROP POLICY IF EXISTS "Cliente vê própria contratação" ON public.contratacoes;
DROP POLICY IF EXISTS "Admin atualiza contratação" ON public.contratacoes;
DROP POLICY IF EXISTS "Admin deleta contratação" ON public.contratacoes;

CREATE POLICY "Cliente/Admin vê contratação"
ON public.contratacoes FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.planos pl
              WHERE pl.id = contratacoes.plano_id
                AND pl.funeraria_id = public.get_user_funeraria(auth.uid()))
);

CREATE POLICY "Admin atualiza contratação da funerária"
ON public.contratacoes FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.planos pl
                WHERE pl.id = contratacoes.plano_id
                  AND pl.funeraria_id = public.get_user_funeraria(auth.uid())));

CREATE POLICY "Admin deleta contratação da funerária"
ON public.contratacoes FOR DELETE
USING (EXISTS (SELECT 1 FROM public.planos pl
                WHERE pl.id = contratacoes.plano_id
                  AND pl.funeraria_id = public.get_user_funeraria(auth.uid())));

-- 11. Processo etapas: admin da funerária do cliente
DROP POLICY IF EXISTS "Admin gerencia processo" ON public.processo_etapas;
DROP POLICY IF EXISTS "Cliente vê próprio processo" ON public.processo_etapas;

CREATE POLICY "Cliente/Admin vê processo"
ON public.processo_etapas FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (SELECT 1 FROM public.profiles p
              WHERE p.user_id = processo_etapas.user_id
                AND p.funeraria_id = public.get_user_funeraria(auth.uid()))
);

CREATE POLICY "Admin gerencia processo da funerária"
ON public.processo_etapas FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles p
                WHERE p.user_id = processo_etapas.user_id
                  AND p.funeraria_id = public.get_user_funeraria(auth.uid())));

-- 12. user_roles: admin só vê papéis dentro da sua funerária
DROP POLICY IF EXISTS "Admin gerencia papéis" ON public.user_roles;

CREATE POLICY "Admin gerencia papéis da funerária"
ON public.user_roles FOR ALL
USING (
  funeraria_id = public.get_user_funeraria(auth.uid())
  OR has_role(auth.uid(), 'admin')
);
