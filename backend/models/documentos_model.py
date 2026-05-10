from ..config.deps import get_supabase

class DocumentosModel:
    @staticmethod
    def listar_tipos():
        sb = get_supabase()
        return sb.table("tipos_documento").select("*").order("ordem").execute()

    @staticmethod
    def listar_por_usuario(user_id: str):
        sb = get_supabase()
        return sb.table("documentos").select("id,tipo_id,status,updated_at,arquivo_path,observacao_admin").eq("user_id", user_id).execute()

    @staticmethod
    def upload_storage(file_name: str, file_content: bytes, content_type: str):
        sb = get_supabase()
        return sb.storage.from_("documentos").upload(file_name, file_content, file_options={"content-type": content_type})

    @staticmethod
    def create_signed_url(arquivo_path: str, expires_in: int = 300):
        sb = get_supabase()
        return sb.storage.from_("documentos").create_signed_url(arquivo_path, expires_in)

    @staticmethod
    def buscar_existente(user_id: str, tipo_id: str):
        sb = get_supabase()
        return sb.table("documentos").select("id").eq("user_id", user_id).eq("tipo_id", tipo_id).maybe_single().execute()

    @staticmethod
    def inserir(payload: dict):
        sb = get_supabase()
        return sb.table("documentos").insert(payload).execute()

    @staticmethod
    def atualizar(doc_id: str, payload: dict):
        sb = get_supabase()
        return sb.table("documentos").update(payload).eq("id", doc_id).execute()

    @staticmethod
    def get_by_id(doc_id: str):
        sb = get_supabase()
        return sb.table("documentos").select("arquivo_path,user_id").eq("id", doc_id).maybe_single().execute()
