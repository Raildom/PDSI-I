from ..config.deps import get_supabase

class PerfilModel:
    @staticmethod
    def get_perfil(user_id: str):
        sb = get_supabase()
        return sb.table("profiles").select("*").eq("user_id", user_id).maybe_single().execute()

    @staticmethod
    def update_perfil(user_id: str, update_data: dict):
        sb = get_supabase()
        return sb.table("profiles").update(update_data).eq("user_id", user_id).execute()
