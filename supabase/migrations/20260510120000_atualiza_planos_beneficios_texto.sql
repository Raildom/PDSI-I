-- Convert planos.beneficios from JSONB to text
ALTER TABLE public.planos
  ALTER COLUMN beneficios TYPE text
    USING (CASE WHEN beneficios IS NULL THEN NULL ELSE beneficios::text END),
  ALTER COLUMN beneficios DROP NOT NULL,
  ALTER COLUMN beneficios SET DEFAULT '';
