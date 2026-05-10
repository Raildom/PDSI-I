from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from ..config.deps import get_current_user
from ..models.cartoes_model import CartoesModel
from ..views.cartoes_view import CartaoCreate, CartaoUpdate

router = APIRouter(prefix="/api/cartoes", tags=["Cartão de Luto"])

@router.get("")
async def get_cartao(user: dict = Depends(get_current_user)):
    result = CartoesModel.get_por_usuario(user["id"])
    return result.data

@router.post("")
async def criar_cartao(body: CartaoCreate, user: dict = Depends(get_current_user)):
    payload = {
        "user_id": user["id"], "titulo": body.titulo, "mensagem": body.mensagem,
        "slug": body.slug, "publicado": body.publicado or False, "falecido_id": body.falecido_id,
    }
    result = CartoesModel.criar(payload)
    if not result.data:
        raise HTTPException(status_code=400, detail="Erro ao criar cartão")
    return result.data[0]

@router.put("/{cartao_id}")
async def atualizar_cartao(cartao_id: str, body: CartaoUpdate, user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in body.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")
    result = CartoesModel.atualizar(cartao_id, user["id"], update_data)
    if not result.data:
        raise HTTPException(status_code=404, detail="Cartão não encontrado")
    return result.data[0]

@router.get("/{slug}/download")
async def download_cartao(slug: str):
    cartao = CartoesModel.get_por_slug(slug)
    if not cartao.data:
        raise HTTPException(status_code=404, detail="Cartão não encontrado")
    buf = CartoesModel.gerar_imagem_cartao(cartao.data)
    return StreamingResponse(buf, media_type="image/png", headers={"Content-Disposition": f'attachment; filename="cartao-luto-{slug}.png"'})

@router.get("/publico/{slug}")
async def cartao_publico(slug: str):
    result = CartoesModel.get_publico(slug)
    if not result.data:
        raise HTTPException(status_code=404, detail="Cartão não encontrado ou não publicado")
    return result.data
