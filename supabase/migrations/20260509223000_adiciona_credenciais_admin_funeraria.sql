-- Store funeraria admin credentials for super admin access
CREATE TABLE IF NOT EXISTS public.funeraria_admin_credentials (
  funeraria_id uuid PRIMARY KEY REFERENCES public.funerarias(id) ON DELETE CASCADE,
  admin_email text NOT NULL,
  admin_password text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.funeraria_admin_credentials ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'funeraria_admin_credentials'
      AND policyname = 'Super admin gerencia credenciais'
  ) THEN
    EXECUTE 'DROP POLICY "Super admin gerencia credenciais" ON public.funeraria_admin_credentials';
  END IF;
END $$;

CREATE POLICY "Super admin gerencia credenciais"
ON public.funeraria_admin_credentials
FOR ALL
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
