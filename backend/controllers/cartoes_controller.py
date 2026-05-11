from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from ..config.deps import get_current_user
from ..models.cartoes_model import CartoesModel
from ..views.cartoes_view import CartaoCreate, CartaoUpdate
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/cartoes", tags=["Cartão de Luto"])

@router.get("")
async def get_cartao(user: dict = Depends(get_current_user)):
    result = CartoesModel.get_por_usuario(user["id"])
    return result.data

@router.post("")
async def criar_cartao(body: CartaoCreate, user: dict = Depends(get_current_user)):
    existing = CartoesModel.get_por_usuario(user["id"])
    if existing.data:
        update_data = {
            "titulo": body.titulo,
            "mensagem": body.mensagem,
            "slug": body.slug,
            "publicado": body.publicado or False,
            "falecido_id": body.falecido_id,
            "foto_path": body.foto_path,
        }
        result = CartoesModel.atualizar(existing.data["id"], user["id"], update_data)
        if not result.data:
            raise HTTPException(status_code=400, detail="Erro ao atualizar cartão")
        return result.data[0]

    payload = {
        "user_id": user["id"], "titulo": body.titulo, "mensagem": body.mensagem,
        "slug": body.slug, "publicado": body.publicado or False, "falecido_id": body.falecido_id,
        "foto_path": body.foto_path,
    }
    try:
        result = CartoesModel.criar(payload)
    except Exception as e:
        msg = str(e)
        if "cartoes_luto_slug_key" in msg or "duplicate key" in msg:
            payload["slug"] = f"{payload['slug']}-{uuid.uuid4().hex[:6]}"
            result = CartoesModel.criar(payload)
        else:
            raise HTTPException(status_code=400, detail=f"Erro ao criar cartão: {msg}")

    if not result.data:
        raise HTTPException(status_code=400, detail="Erro ao criar cartão")
    return result.data[0]

@router.put("/{cartao_id}")
async def atualizar_cartao(cartao_id: str, body: CartaoUpdate, user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in body.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")
    try:
        result = CartoesModel.atualizar(cartao_id, user["id"], update_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar cartão: {str(e)}")
    if not result.data:
        raise HTTPException(status_code=404, detail="Cartão não encontrado")
    return result.data[0]

@router.get("/{slug}/download")
async def download_cartao(slug: str):
    cartao = CartoesModel.get_por_slug(slug)
    if not cartao.data:
        raise HTTPException(status_code=404, detail="Cartão não encontrado")
    buf = CartoesModel.gerar_imagem_cartao(cartao.data)
    return StreamingResponse(
        buf,
        media_type="image/png",
        headers={
            "Content-Disposition": f'attachment; filename="cartao-luto-{slug}-{int(datetime.now().timestamp())}.png"',
            "Cache-Control": "no-store",
        },
    )

@router.post("/upload-foto")
async def upload_foto(arquivo: UploadFile = File(...), user: dict = Depends(get_current_user)):
    file_content = await arquivo.read()
    safe_name = arquivo.filename.replace(" ", "-")
    file_name = f"{user['id']}/{int(datetime.now().timestamp())}-{safe_name}"

    try:
        CartoesModel.upload_storage(file_name, file_content, arquivo.content_type or "application/octet-stream")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro no upload: {str(e)}")

    cartao = CartoesModel.get_por_usuario(user["id"])
    if cartao.data:
        CartoesModel.atualizar(cartao.data["id"], user["id"], {"foto_path": file_name})

    return {"path": file_name}

@router.get("/publico/{slug}")
async def cartao_publico(slug: str):
    result = CartoesModel.get_publico(slug)
    if not result.data:
        raise HTTPException(status_code=404, detail="Cartão não encontrado ou não publicado")
    return result.data
