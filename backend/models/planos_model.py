from ..config.deps import get_supabase

class PlanosModel:
    @staticmethod
    def listar_ativos():
        sb = get_supabase()
        return sb.table("planos").select("*").eq("ativo", True).order("destaque", desc=True).execute()

    @staticmethod
    def listar_todos():
        sb = get_supabase()
        return sb.table("planos").select("*").order("destaque", desc=True).execute()

    @staticmethod
    def criar(payload: dict):
        sb = get_supabase()
        return sb.table("planos").insert(payload).execute()

    @staticmethod
    def atualizar(plano_id: str, update_data: dict):
        sb = get_supabase()
        return sb.table("planos").update(update_data).eq("id", plano_id).execute()

    @staticmethod
    def get_plano(plano_id: str):
        sb = get_supabase()
        return sb.table("planos").select("id,ativo").eq("id", plano_id).maybe_single().execute()
