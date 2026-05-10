from fastapi import APIRouter, Depends, HTTPException
from postgrest.exceptions import APIError

from ..config.deps import require_super_admin, get_supabase
from ..models.funerarias_model import FunerariasModel
from ..views.funerarias_view import FunerariaCreate, FunerariaUpdate

router = APIRouter(prefix="/api/super-admin", tags=["Super Admin"])

@router.get("/funerarias")
async def listar_funerarias(user: dict = Depends(require_super_admin)):
    try:
        result = FunerariasModel.listar_todas()
        return result.data or []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Falha ao listar funerarias: {str(e)}")

@router.post("/funerarias")
async def criar_funeraria(body: FunerariaCreate, user: dict = Depends(require_super_admin)):
    payload = {
        "razao_social": body.razao_social,
        "cnpj": body.cnpj,
        "telefone": body.telefone,
        "email": body.email,
        "endereco": body.endereco,
        "ativo": body.ativo if body.ativo is not None else True,
    }
    result = FunerariasModel.criar(payload)
    if not result.data:
        raise HTTPException(status_code=400, detail="Erro ao criar funeraria")
    funeraria = result.data[0]

    try:
        FunerariasModel.salvar_credenciais(
            funeraria["id"],
            body.email,
            body.admin_password,
        )
    except Exception:
        pass

    sb = get_supabase()
    try:
        admin = sb.auth.admin.create_user({
            "email": body.email,
            "password": body.admin_password,
            "email_confirm": True,
            "user_metadata": {
                "nome": body.admin_nome,
                "role": "admin",
                "funeraria_id": funeraria["id"],
            },
        })
    except Exception as e:
        FunerariasModel.deletar(funeraria["id"])
        raise HTTPException(status_code=400, detail=f"Erro ao criar admin: {str(e)}")

    if admin is None or admin.user is None:
        FunerariasModel.deletar(funeraria["id"])
        raise HTTPException(status_code=400, detail="Erro ao criar admin")

    return funeraria

@router.put("/funerarias/{funeraria_id}")
async def atualizar_funeraria(funeraria_id: str, body: FunerariaUpdate, user: dict = Depends(require_super_admin)):
    update_data = {k: v for k, v in body.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")
    result = FunerariasModel.atualizar(funeraria_id, update_data)
    if not result.data:
        raise HTTPException(status_code=404, detail="Funeraria nao encontrada")
    return result.data[0]

@router.get("/funerarias/{funeraria_id}/credenciais")
async def credenciais_funeraria(funeraria_id: str, user: dict = Depends(require_super_admin)):
    return FunerariasModel.obter_credenciais(funeraria_id)


@router.delete("/funerarias/{funeraria_id}")
async def excluir_funeraria(funeraria_id: str, user: dict = Depends(require_super_admin)):
    if not FunerariasModel.existe(funeraria_id):
        raise HTTPException(status_code=404, detail="Funeraria nao encontrada")
    sb = get_supabase()
    for uid in FunerariasModel.listar_admin_user_ids(funeraria_id):
        try:
            sb.auth.admin.delete_user(uid)
        except Exception:
            pass
    try:
        FunerariasModel.deletar(funeraria_id)
    except APIError as e:
        hint = getattr(e, "message", "") or str(e)
        raise HTTPException(
            status_code=400,
            detail=(
                "Nao foi possivel excluir: podem existir contratacoes ou outros dados ligados aos planos desta funeraria. "
                f"Detalhe: {hint}"
            ),
        ) from e
    return {"ok": True}
