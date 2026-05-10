from pydantic import BaseModel
from typing import Optional

class CartaoCreate(BaseModel):
    titulo: str
    mensagem: Optional[str] = None
    slug: str
    publicado: Optional[bool] = False
    falecido_id: Optional[str] = None

class CartaoUpdate(BaseModel):
    titulo: Optional[str] = None
    mensagem: Optional[str] = None
    slug: Optional[str] = None
    publicado: Optional[bool] = None
    falecido_id: Optional[str] = None
