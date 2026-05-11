from fastapi import APIRouter, Depends
from ..config.deps import require_admin
from ..models.admin_model import AdminModel

router = APIRouter(prefix="/api/admin", tags=["Administração"])

@router.get("/stats")
async def dashboard_stats(user: dict = Depends(require_admin)):
    return AdminModel.get_stats(user["funeraria_id"])

@router.get("/clientes")
async def listar_clientes(user: dict = Depends(require_admin)):
    return AdminModel.listar_clientes(user["funeraria_id"])

@router.get("/documentos")
async def documentos_pendentes(user: dict = Depends(require_admin)):
    return AdminModel.listar_documentos_pendentes(user["funeraria_id"])
