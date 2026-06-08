from fastapi import APIRouter, HTTPException

from ..config.deps import get_supabase

router = APIRouter(prefix="/api/funerarias", tags=["Funerárias"])


@router.get("/ativas")
async def listar_funerarias_ativas():
    """Endpoint público — lista funerárias ativas (usa service role key, sem RLS)."""
    try:
        sb = get_supabase()
        result = (
            sb.table("funerarias")
            .select("id, razao_social, logo_url")
            .eq("ativo", True)
            .order("razao_social")
            .execute()
        )
        return result.data or []
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Falha ao listar funerárias ativas: {str(e)}",
        )
