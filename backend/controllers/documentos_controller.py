from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from ..config.deps import get_current_user, require_admin, get_admin_funeraria_id, get_supabase
from ..models.documentos_model import DocumentosModel
from ..models.auth_model import AuthModel
from ..views.documentos_view import DocumentoStatusUpdate
from datetime import datetime

router = APIRouter(prefix="/api/documentos", tags=["Documentos"])

@router.get("/tipos")
async def listar_tipos():
    result = DocumentosModel.listar_tipos()
    return result.data or []

@router.get("")
async def listar_documentos(user: dict = Depends(get_current_user)):
    result = DocumentosModel.listar_por_usuario(user["id"])
    return result.data or []

@router.post("/upload")
async def upload_documento(tipo_id: str = Form(...), arquivo: UploadFile = File(...), user: dict = Depends(get_current_user)):
    file_content = await arquivo.read()
    file_name = f"{user['id']}/{tipo_id}-{int(datetime.now().timestamp())}-{arquivo.filename}"

    try:
        DocumentosModel.upload_storage(file_name, file_content, arquivo.content_type or "application/octet-stream")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro no upload: {str(e)}")

    existing = DocumentosModel.buscar_existente(user["id"], tipo_id)
    payload = {"user_id": user["id"], "tipo_id": tipo_id, "arquivo_path": file_name, "status": "analise"}

    if existing.data:
        result = DocumentosModel.atualizar(existing.data["id"], payload)
    else:
        result = DocumentosModel.inserir(payload)

    if not result.data:
        raise HTTPException(status_code=400, detail="Erro ao salvar documento")
    return {"message": "Documento enviado para análise", "data": result.data[0]}

@router.put("/{doc_id}/status")
async def validar_documento(doc_id: str, body: DocumentoStatusUpdate, user: dict = Depends(require_admin)):
    if body.status not in ("aprovado", "rejeitado"):
        raise HTTPException(status_code=400, detail="Status deve ser 'aprovado' ou 'rejeitado'")

    doc = DocumentosModel.get_by_id(doc_id)
    if not doc.data:
        raise HTTPException(status_code=404, detail="Documento não encontrado")

    sb = get_supabase()
    profile = sb.table("profiles").select("funeraria_id").eq("user_id", doc.data["user_id"]).maybe_single().execute()
    doc_funeraria = getattr(profile, "data", None) and profile.data.get("funeraria_id")
    if doc_funeraria != user["funeraria_id"]:
        raise HTTPException(status_code=403, detail="Sem permissão para este documento")

    update_data = {"status": body.status, "validado_por": user["id"], "validado_em": datetime.now().isoformat()}
    if body.observacao_admin is not None:
        update_data["observacao_admin"] = body.observacao_admin

    result = DocumentosModel.atualizar(doc_id, update_data)
    if not result.data:
        raise HTTPException(status_code=404, detail="Documento não encontrado")
    return result.data[0]

@router.get("/{doc_id}/download")
async def download_documento(doc_id: str, user: dict = Depends(get_current_user)):
    doc = DocumentosModel.get_by_id(doc_id)
    if not doc.data:
        raise HTTPException(status_code=404, detail="Documento não encontrado")

    roles = AuthModel.get_user_roles(user["id"])
    role_list = [r.get("role") for r in (roles.data or [])]
    is_admin = "admin" in role_list
    if doc.data["user_id"] != user["id"] and not is_admin:
        raise HTTPException(status_code=403, detail="Sem permissão")
    if is_admin:
        admin_funeraria_id = get_admin_funeraria_id(user["id"])
        if not admin_funeraria_id:
            raise HTTPException(status_code=403, detail="Admin sem funerária vinculada")
        sb = get_supabase()
        profile = sb.table("profiles").select("funeraria_id").eq("user_id", doc.data["user_id"]).maybe_single().execute()
        doc_funeraria = getattr(profile, "data", None) and profile.data.get("funeraria_id")
        if doc_funeraria != admin_funeraria_id:
            raise HTTPException(status_code=403, detail="Sem permissão")

    if not doc.data.get("arquivo_path"):
        raise HTTPException(status_code=404, detail="Nenhum arquivo anexado")

    signed = DocumentosModel.create_signed_url(doc.data["arquivo_path"])
    return {"url": signed.get("signedURL") or signed.get("signedUrl", "")}
