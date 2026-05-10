from typing import Any, Optional

from ..config.deps import get_supabase

class FunerariasModel:
    @staticmethod
    def listar_todas():
        sb = get_supabase()
        return sb.table("funerarias").select("*").order("created_at", desc=True).execute()

    @staticmethod
    def criar(payload: dict):
        sb = get_supabase()
        return sb.table("funerarias").insert(payload).execute()

    @staticmethod
    def atualizar(funeraria_id: str, payload: dict):
        sb = get_supabase()
        return sb.table("funerarias").update(payload).eq("id", funeraria_id).execute()

    @staticmethod
    def deletar(funeraria_id: str):
        sb = get_supabase()
        return sb.table("funerarias").delete().eq("id", funeraria_id).execute()

    @staticmethod
    def existe(funeraria_id: str) -> bool:
        sb = get_supabase()
        r = sb.table("funerarias").select("id").eq("id", funeraria_id).limit(1).execute()
        return bool(getattr(r, "data", None))

    @staticmethod
    def listar_admin_user_ids(funeraria_id: str) -> list[str]:
        sb = get_supabase()
        r = (
            sb.table("user_roles")
            .select("user_id")
            .eq("role", "admin")
            .eq("funeraria_id", funeraria_id)
            .execute()
        )
        rows = getattr(r, "data", None) or []
        return [row["user_id"] for row in rows if row.get("user_id")]

    @staticmethod
    def salvar_credenciais(funeraria_id: str, admin_email: str, admin_password: str):
        sb = get_supabase()
        payload = {
            "funeraria_id": funeraria_id,
            "admin_email": admin_email,
            "admin_password": admin_password,
        }
        return sb.table("funeraria_admin_credentials").insert(payload).execute()

    @staticmethod
    def obter_credenciais(funeraria_id: str) -> Optional[dict[str, Any]]:
        """Credenciais salvas pela plataforma, ou apenas e-mail do admin (fallback)."""
        sb = get_supabase()
        stored = (
            sb.table("funeraria_admin_credentials")
            .select("admin_email, admin_password")
            .eq("funeraria_id", funeraria_id)
            .limit(1)
            .execute()
        )
        rows = getattr(stored, "data", None) or []
        if rows:
            return rows[0]

        admins = (
            sb.table("user_roles")
            .select("user_id")
            .eq("role", "admin")
            .eq("funeraria_id", funeraria_id)
            .limit(1)
            .execute()
        )
        admins_rows = getattr(admins, "data", None) or []
        if not admins_rows:
            return None
        uid = admins_rows[0]["user_id"]
        prof = (
            sb.table("profiles")
            .select("email")
            .eq("user_id", uid)
            .limit(1)
            .execute()
        )
        prof_rows = getattr(prof, "data", None) or []
        if not prof_rows:
            return None
        email = prof_rows[0].get("email")
        if not email:
            return None
        return {"admin_email": email, "admin_password": None}
