from fastapi import APIRouter, Depends, HTTPException
import uuid
from ..config.deps import get_current_user
from ..models.perfil_model import PerfilModel
from ..models.funerarias_model import FunerariasModel
from ..views.perfil_view import PerfilUpdate

router = APIRouter(prefix="/api/perfil", tags=["Perfil"])

@router.get("")
async def get_perfil(user: dict = Depends(get_current_user)):
    result = PerfilModel.get_perfil(user["id"])
    if not result.data:
        raise HTTPException(status_code=404, detail="Perfil não encontrado")
    return result.data

@router.put("")
async def update_perfil(body: PerfilUpdate, user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    if "funeraria_id" in update_data:
        if update_data["funeraria_id"] == "":
            update_data["funeraria_id"] = None
        elif update_data["funeraria_id"] is not None:
            try:
                uuid.UUID(str(update_data["funeraria_id"]))
            except ValueError:
                raise HTTPException(status_code=400, detail="Funeraria invalida")
            if not FunerariasModel.existe_ativa(update_data["funeraria_id"]):
                raise HTTPException(status_code=400, detail="Funeraria invalida ou inativa")

    result = PerfilModel.update_perfil(user["id"], update_data)
    if not result.data:
        raise HTTPException(status_code=404, detail="Perfil não encontrado")
    return result.data[0]
