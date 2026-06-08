-- Separa a política RLS da tabela funerarias em duas:
--   1. Pública: qualquer um pode ver funerárias ativas (sem usar has_role)
--   2. Admin: admins podem ver todas as funerárias
-- Motivo: a migration 20260505111333 revogou EXECUTE de has_role para anon,
--         e PostgreSQL pode falhar ao verificar permissões mesmo com OR short-circuit.

DROP POLICY IF EXISTS "Funerárias visíveis publicamente" ON public.funerarias;

CREATE POLICY "Funerárias visíveis ao público" ON public.funerarias
  FOR SELECT
  USING (ativo = true);

CREATE POLICY "Admin vê todas as funerárias" ON public.funerarias
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
