-- =====================================================
-- SAINT LUZIA — Setup Completo do Banco de Dados
-- Execute este SQL no Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Cole e Execute
-- =====================================================

-- =========== ENUMS ===========
CREATE TYPE public.app_role AS ENUM ('admin', 'cliente');
CREATE TYPE public.doc_status AS ENUM ('pendente', 'analise', 'aprovado', 'rejeitado');
CREATE TYPE public.contratacao_status AS ENUM ('ativo', 'carencia', 'suspenso', 'cancelado');

-- =========== UTIL: updated_at ===========
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- =========== PROFILES ===========
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== USER ROLES ===========
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-criação de perfil + papel cliente ao registrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, email, telefone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    NEW.email,
    NEW.raw_user_meta_data->>'telefone'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'cliente');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========== PLANOS ===========
CREATE TABLE public.planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor_mensal NUMERIC(10,2) NOT NULL,
  beneficios JSONB NOT NULL DEFAULT '{}'::jsonb,
  destaque BOOLEAN NOT NULL DEFAULT false,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_planos_updated BEFORE UPDATE ON public.planos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== FALECIDOS ===========
CREATE TABLE public.falecidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  data_nascimento DATE,
  data_falecimento DATE,
  cpf TEXT,
  parentesco TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.falecidos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_falecidos_updated BEFORE UPDATE ON public.falecidos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== CONTRATAÇÕES ===========
CREATE TABLE public.contratacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plano_id UUID NOT NULL REFERENCES public.planos(id),
  status contratacao_status NOT NULL DEFAULT 'carencia',
  valor_mensal NUMERIC(10,2) NOT NULL,
  dependentes INT NOT NULL DEFAULT 0,
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  carencia_ate DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contratacoes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_contratacoes_updated BEFORE UPDATE ON public.contratacoes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== TIPOS DE DOCUMENTO ===========
CREATE TABLE public.tipos_documento (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT NOT NULL,
  obrigatorio BOOLEAN NOT NULL DEFAULT true,
  ordem INT NOT NULL DEFAULT 0
);
ALTER TABLE public.tipos_documento ENABLE ROW LEVEL SECURITY;

-- =========== DOCUMENTOS ===========
CREATE TABLE public.documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo_id TEXT NOT NULL REFERENCES public.tipos_documento(id),
  arquivo_path TEXT,
  status doc_status NOT NULL DEFAULT 'pendente',
  observacao_admin TEXT,
  validado_por UUID REFERENCES auth.users(id),
  validado_em TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_documentos_updated BEFORE UPDATE ON public.documentos
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== PROCESSO ETAPAS ===========
CREATE TABLE public.processo_etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  subtitulo TEXT,
  ordem INT NOT NULL DEFAULT 0,
  concluido BOOLEAN NOT NULL DEFAULT false,
  acao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.processo_etapas ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_processo_updated BEFORE UPDATE ON public.processo_etapas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== CARTÃO DE LUTO ===========
CREATE TABLE public.cartoes_luto (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  falecido_id UUID REFERENCES public.falecidos(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  mensagem TEXT,
  foto_path TEXT,
  publicado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cartoes_luto ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_cartoes_updated BEFORE UPDATE ON public.cartoes_luto
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========== RLS POLICIES ===========
CREATE POLICY "Usuário vê próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Usuário atualiza próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuário insere próprio perfil" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin gerencia perfis" ON public.profiles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Usuário vê próprios papéis" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin gerencia papéis" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Planos ativos são públicos" ON public.planos FOR SELECT USING (ativo = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin gerencia planos" ON public.planos FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Cliente vê próprio falecido" ON public.falecidos FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente cria próprio falecido" ON public.falecidos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Cliente atualiza próprio falecido" ON public.falecidos FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente deleta próprio falecido" ON public.falecidos FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Cliente vê própria contratação" ON public.contratacoes FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente contrata plano" ON public.contratacoes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin atualiza contratação" ON public.contratacoes FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin deleta contratação" ON public.contratacoes FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Tipos de documento visíveis" ON public.tipos_documento FOR SELECT USING (true);
CREATE POLICY "Admin gerencia tipos" ON public.tipos_documento FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Cliente vê próprios documentos" ON public.documentos FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente envia documento" ON public.documentos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Cliente atualiza próprio documento" ON public.documentos FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin deleta documento" ON public.documentos FOR DELETE USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);

CREATE POLICY "Cliente vê próprio processo" ON public.processo_etapas FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin gerencia processo" ON public.processo_etapas FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente atualiza próprio processo" ON public.processo_etapas FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Cartões publicados são públicos" ON public.cartoes_luto FOR SELECT USING (publicado = true OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente cria próprio cartão" ON public.cartoes_luto FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Cliente atualiza próprio cartão" ON public.cartoes_luto FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente deleta próprio cartão" ON public.cartoes_luto FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- =========== STORAGE BUCKETS ===========
INSERT INTO storage.buckets (id, name, public) VALUES ('documentos', 'documentos', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('cartoes', 'cartoes', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Cliente vê próprios docs no storage" ON storage.objects FOR SELECT USING (bucket_id = 'documentos' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Cliente envia próprio doc no storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documentos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Cliente atualiza próprio doc" ON storage.objects FOR UPDATE USING (bucket_id = 'documentos' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Cliente deleta próprio doc" ON storage.objects FOR DELETE USING (bucket_id = 'documentos' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Fotos de cartões visíveis" ON storage.objects FOR SELECT USING (bucket_id = 'cartoes' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin') OR EXISTS (SELECT 1 FROM public.cartoes_luto c WHERE c.foto_path = storage.objects.name AND c.publicado = true)));
CREATE POLICY "Cliente envia foto do cartão" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cartoes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Cliente atualiza foto do cartão" ON storage.objects FOR UPDATE USING (bucket_id = 'cartoes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Cliente deleta foto do cartão" ON storage.objects FOR DELETE USING (bucket_id = 'cartoes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =========== GRANT ===========
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, anon;

-- =========== SEED DATA: TIPOS DOCUMENTO ===========
INSERT INTO public.tipos_documento (id, nome, descricao, obrigatorio, ordem) VALUES
  ('obito', 'Atestado de Óbito', 'Documento emitido pelo médico que atesta o falecimento', true, 1),
  ('rg', 'RG do Falecido', 'Documento de identidade (RG) do falecido', true, 2),
  ('cpf', 'CPF do Falecido', 'Cadastro de Pessoa Física do falecido', true, 3),
  ('certidao_nasc', 'Certidão de Nascimento ou Casamento', 'Documento civil do falecido', true, 4),
  ('residencia', 'Comprovante de Residência', 'Comprovante de endereço do responsável', true, 5),
  ('rg_resp', 'RG do Responsável', 'Documento de identidade do responsável pelo funeral', true, 6)
ON CONFLICT DO NOTHING;

-- =========== SEED DATA: PLANOS ===========
INSERT INTO public.planos (titulo, descricao, valor_mensal, beneficios, destaque, ativo) VALUES
  ('Plano Essencial', 'Cobertura básica para procedimentos funerários essenciais com suporte dedicado.', 89.90,
   '{"urna":["Urna simples padrão","Ornamentação básica com flores naturais"],"logistica":"Traslado municipal até 50km","cerimonial":"Velório de até 12 horas","taxas":["Taxa de sepultamento","Registro em cartório"]}'::jsonb,
   false, true),
  ('Plano Conforto', 'Atendimento completo com serviços ampliados e cobertura para dependentes.', 149.90,
   '{"urna":["Urna sextavada em madeira nobre","Ornamentação premium com arranjos florais","Kit de paramentação completo"],"logistica":"Traslado intermunicipal até 200km","cerimonial":"Velório de até 24 horas em sala reservada","taxas":["Taxa de sepultamento","Registro em cartório","Publicação em jornal","Coroa de flores"]}'::jsonb,
   true, true),
  ('Plano Premium', 'Cobertura máxima com serviços exclusivos e assistência 24 horas personalizada.', 249.90,
   '{"urna":["Urna especial em mogno com acabamento luxo","Ornamentação completa com designer floral","Kit de paramentação premium com personalização"],"logistica":"Traslado nacional sem limite de distância","cerimonial":"Velório ilimitado com sala VIP e coffee break","taxas":["Taxa de sepultamento","Registro em cartório","Publicação em 3 jornais","Coroa de flores premium","Cremação inclusa","Homenagem musical"]}'::jsonb,
   false, true);
