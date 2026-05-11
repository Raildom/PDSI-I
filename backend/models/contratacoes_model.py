from ..config.deps import get_supabase

class ContratacoesModel:
    @staticmethod
    def get_ativa(user_id: str):
        sb = get_supabase()
        return sb.table("contratacoes") \
            .select("*, planos(titulo, descricao, valor_mensal, beneficios)") \
            .eq("user_id", user_id) \
            .order("created_at", desc=True) \
            .limit(1).execute()

    @staticmethod
    def criar(payload: dict):
        sb = get_supabase()
        return sb.table("contratacoes").insert(payload).execute()

    @staticmethod
    def atualizar_status(contrato_id: str, status: str):
        sb = get_supabase()
        return sb.table("contratacoes").update({"status": status}).eq("id", contrato_id).execute()
