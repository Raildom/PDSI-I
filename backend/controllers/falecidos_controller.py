from fastapi import APIRouter, Depends, HTTPException
from ..config.deps import get_current_user
from ..models.falecidos_model import FalecidosModel
from ..views.falecidos_view import FalecidoCreate, FalecidoUpdate

router = APIRouter(prefix="/api/falecidos", tags=["Falecidos"])

@router.get("")
async def listar_falecidos(user: dict = Depends(get_current_user)):
    result = FalecidosModel.listar(user["id"])
    return result.data or []

@router.get("/{falecido_id}")
async def get_falecido(falecido_id: str, user: dict = Depends(get_current_user)):
    result = FalecidosModel.get(falecido_id, user["id"])
    if not result.data:
        raise HTTPException(status_code=404, detail="Falecido não encontrado")
    return result.data

@router.post("")
async def criar_falecido(body: FalecidoCreate, user: dict = Depends(get_current_user)):
    payload = {
        "user_id": user["id"],
        "nome": body.nome,
        "data_nascimento": body.data_nascimento,
        "data_falecimento": body.data_falecimento,
        "cpf": body.cpf,
        "parentesco": body.parentesco,
        "observacoes": body.observacoes,
    }
    result = FalecidosModel.criar(payload)
    if not result.data:
        raise HTTPException(status_code=400, detail="Erro ao criar registro")
    return result.data[0]

@router.put("/{falecido_id}")
async def atualizar_falecido(falecido_id: str, body: FalecidoUpdate, user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    result = FalecidosModel.atualizar(falecido_id, user["id"], update_data)
    if not result.data:
        raise HTTPException(status_code=404, detail="Falecido não encontrado")
    return result.data[0]
