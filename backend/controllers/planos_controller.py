from fastapi import APIRouter, Depends, HTTPException
from ..config.deps import require_admin
from ..models.planos_model import PlanosModel
from ..views.planos_view import PlanoCreate, PlanoUpdate

router = APIRouter(prefix="/api/planos", tags=["Planos"])

@router.get("")
async def listar_planos():
    result = PlanosModel.listar_ativos()
    return result.data or []

@router.get("/todos")
async def listar_todos_planos(user: dict = Depends(require_admin)):
    result = PlanosModel.listar_todos(user["funeraria_id"])
    return result.data or []

@router.post("")
async def criar_plano(body: PlanoCreate, user: dict = Depends(require_admin)):
    payload = {
        "titulo": body.titulo,
        "descricao": body.descricao,
        "valor_mensal": body.valor_mensal,
        "beneficios": body.beneficios or {},
        "destaque": body.destaque or False,
        "ativo": body.ativo if body.ativo is not None else True,
        "funeraria_id": user["funeraria_id"],
    }
    result = PlanosModel.criar(payload)
    if not result.data:
        raise HTTPException(status_code=400, detail="Erro ao criar plano")
    return result.data[0]

@router.put("/{plano_id}")
async def atualizar_plano(plano_id: str, body: PlanoUpdate, user: dict = Depends(require_admin)):
    update_data = {k: v for k, v in body.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    result = PlanosModel.atualizar(plano_id, update_data, user["funeraria_id"])
    if not result.data:
        raise HTTPException(status_code=404, detail="Plano não encontrado")
    return result.data[0]
