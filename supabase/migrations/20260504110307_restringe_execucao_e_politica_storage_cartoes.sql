
-- Revoga execução pública das funções SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Restringe listagem do bucket cartoes: só objetos referenciados por cartões publicados
DROP POLICY IF EXISTS "Cartões fotos são públicas" ON storage.objects;
CREATE POLICY "Fotos de cartões publicados visíveis"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'cartoes' AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR public.has_role(auth.uid(), 'admin')
    OR EXISTS (
      SELECT 1 FROM public.cartoes_luto c
      WHERE c.foto_path = storage.objects.name AND c.publicado = true
    )
  )
);
