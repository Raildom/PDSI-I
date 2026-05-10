-- Add super_admin role to enum
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    WHERE t.typname = 'app_role' AND e.enumlabel = 'super_admin'
  ) THEN
    ALTER TYPE public.app_role ADD VALUE 'super_admin';
  END IF;
END $$;

-- Update handle_new_user to set funeraria_id and roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
  v_funeraria uuid;
BEGIN
  v_role := COALESCE(NEW.raw_user_meta_data->>'role', 'cliente');
  v_funeraria := NULLIF(NEW.raw_user_meta_data->>'funeraria_id', '')::uuid;

  INSERT INTO public.profiles (user_id, nome, email, telefone, cpf, funeraria_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'telefone',
    NEW.raw_user_meta_data->>'cpf',
    v_funeraria
  );

  IF v_role = 'super_admin' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin');
  ELSIF v_role = 'admin' THEN
    INSERT INTO public.user_roles (user_id, role, funeraria_id)
    VALUES (NEW.id, 'admin', v_funeraria);
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'cliente');
  END IF;

  RETURN NEW;
END;
$$;
