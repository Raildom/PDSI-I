from fastapi import APIRouter, Depends, HTTPException
from ..config.deps import get_current_user
from ..models.processos_model import ProcessosModel
from ..views.processos_view import ProcessoUpdate

router = APIRouter(prefix="/api/processos", tags=["Processos"])

@router.get("")
async def listar_processos(user: dict = Depends(get_current_user)):
    result = ProcessosModel.listar(user["id"])
    if not result.data:
        # Auto-seed se estiver vazio
        ProcessosModel.seed_initial(user["id"])
        result = ProcessosModel.listar(user["id"])
    return result.data or []

@router.put("/{etapa_id}")
async def atualizar_processo(etapa_id: str, body: ProcessoUpdate, user: dict = Depends(get_current_user)):
    result = ProcessosModel.atualizar(etapa_id, user["id"], body.concluido)
    if not result.data:
        raise HTTPException(status_code=404, detail="Etapa não encontrada")
    return result.data[0]
