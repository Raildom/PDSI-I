"""Dependências compartilhadas — cliente Supabase e autenticação JWT."""

from fastapi import Depends, HTTPException, Header
from supabase import create_client, Client
from . import env

_admin_client: Client | None = None
_last_supabase_url: str | None = None
_last_service_key: str | None = None

def get_supabase() -> Client:
    """Retorna o cliente Supabase admin (service_role).

    Recria o client se URL/chave mudarem (evita ficar preso em env antigo).
    """
    global _admin_client, _last_supabase_url, _last_service_key

    if not env.SUPABASE_URL or not env.SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(status_code=500, detail="Backend sem configuração do Supabase (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY)")

    if (
        _admin_client is None
        or _last_supabase_url != env.SUPABASE_URL
        or _last_service_key != env.SUPABASE_SERVICE_ROLE_KEY
    ):
        _admin_client = create_client(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
        _last_supabase_url = env.SUPABASE_URL
        _last_service_key = env.SUPABASE_SERVICE_ROLE_KEY

    return _admin_client

async def get_current_user(authorization: str = Header(..., alias="Authorization")) -> dict:
    """Extrai e valida o JWT do header Authorization."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")
    token = authorization.replace("Bearer ", "")
    sb = get_supabase()
    try:
        resp = sb.auth.get_user(token)
        if resp is None or resp.user is None:
            raise HTTPException(status_code=401, detail="Usuário não autenticado")
        return {"id": resp.user.id, "email": resp.user.email, "token": token}
    except Exception as e:
        msg = str(e)
        if "session_id" in msg.lower() and "does not exist" in msg.lower():
            raise HTTPException(status_code=401, detail="Sessão expirada. Faça login novamente.")
        raise HTTPException(status_code=401, detail=f"Token inválido: {msg}")

async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    """Verifica se o usuário autenticado possui papel de admin."""
    sb = get_supabase()
    try:
        result = sb.table("user_roles").select("role").eq("user_id", user["id"]).eq("role", "admin").execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Falha ao validar admin no Supabase: {str(e)}")
    if not getattr(result, "data", None):
        raise HTTPException(status_code=403, detail="Acesso restrito a administradores")
    return user

async def require_super_admin(user: dict = Depends(get_current_user)) -> dict:
    """Verifica se o usuário autenticado possui papel de super_admin."""
    sb = get_supabase()
    try:
        result = sb.table("user_roles").select("role").eq("user_id", user["id"]).eq("role", "super_admin").execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Falha ao validar super_admin no Supabase: {str(e)}")
    if not getattr(result, "data", None):
        raise HTTPException(status_code=403, detail="Acesso restrito a super administradores")
    return user
