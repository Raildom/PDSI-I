from ..config.deps import get_supabase

class FalecidosModel:
    @staticmethod
    def listar(user_id: str):
        sb = get_supabase()
        return sb.table("falecidos").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()

    @staticmethod
    def get(falecido_id: str, user_id: str):
        sb = get_supabase()
        return sb.table("falecidos").select("*").eq("id", falecido_id).eq("user_id", user_id).maybe_single().execute()

    @staticmethod
    def get_by_id(falecido_id: str):
        """Busca falecido apenas pelo ID (sem filtro de user_id).
        Usado pelo endpoint de download do cartão."""
        sb = get_supabase()
        result = sb.table("falecidos").select("nome, data_nascimento, data_falecimento").eq("id", falecido_id).maybe_single().execute()
        data = getattr(result, "data", None)
        return data

    @staticmethod
    def criar(payload: dict):
        sb = get_supabase()
        return sb.table("falecidos").insert(payload).execute()

    @staticmethod
    def atualizar(falecido_id: str, user_id: str, update_data: dict):
        sb = get_supabase()
        return sb.table("falecidos").update(update_data).eq("id", falecido_id).eq("user_id", user_id).execute()
