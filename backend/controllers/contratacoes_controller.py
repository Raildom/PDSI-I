from fastapi import APIRouter, Depends, HTTPException
from ..config.deps import get_current_user
from ..models.contratacoes_model import ContratacoesModel
from ..models.planos_model import PlanosModel
from ..views.contratacoes_view import ContratacaoCreate
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/contratacoes", tags=["Contratações"])

@router.get("")
async def get_contratacao(user: dict = Depends(get_current_user)):
    result = ContratacoesModel.get_ativa(user["id"])
    return result.data[0] if result.data else None

@router.post("")
async def contratar(body: ContratacaoCreate, user: dict = Depends(get_current_user)):
    plano = PlanosModel.get_plano(body.plano_id)
    if not plano.data or not plano.data.get("ativo"):
        raise HTTPException(status_code=404, detail="Plano não encontrado ou inativo")

    carencia = (datetime.now() + timedelta(days=90)).strftime("%Y-%m-%d")
    payload = {
        "user_id": user["id"],
        "plano_id": body.plano_id,
        "valor_mensal": body.valor_mensal,
        "status": "carencia",
        "carencia_ate": body.carencia_ate or carencia,
    }
    result = ContratacoesModel.criar(payload)
    if not result.data:
        raise HTTPException(status_code=400, detail="Erro ao contratar plano")
    return result.data[0]
