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

@router.post("/cancelar")
async def cancelar_contratacao(user: dict = Depends(get_current_user)):
    atual = ContratacoesModel.get_ativa(user["id"])
    contrato = (atual.data or [None])[0]
    if not contrato:
        raise HTTPException(status_code=404, detail="Contrato não encontrado")
    if contrato.get("status") == "cancelado":
        return contrato
    result = ContratacoesModel.atualizar_status(contrato["id"], "cancelado")
    if not result.data:
        raise HTTPException(status_code=400, detail="Erro ao cancelar contrato")
    return result.data[0]

@router.post("/trocar")
async def trocar_plano(body: ContratacaoCreate, user: dict = Depends(get_current_user)):
    plano = PlanosModel.get_plano(body.plano_id)
    if not plano.data or not plano.data.get("ativo"):
        raise HTTPException(status_code=404, detail="Plano não encontrado ou inativo")

    atual = ContratacoesModel.get_ativa(user["id"])
    contrato = (atual.data or [None])[0]
    if contrato and contrato.get("status") != "cancelado":
        ContratacoesModel.atualizar_status(contrato["id"], "cancelado")

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
        raise HTTPException(status_code=400, detail="Erro ao trocar plano")
    return result.data[0]
