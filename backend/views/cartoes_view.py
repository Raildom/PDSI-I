
from pydantic import BaseModel, Field
from typing import Optional

class CartaoCreate(BaseModel):
    titulo: str = Field(..., min_length=2, max_length=100)
    mensagem: Optional[str] = Field(None, max_length=500)
    slug: str
    publicado: Optional[bool] = False
    falecido_id: Optional[str] = None

class CartaoUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=2, max_length=100)
    mensagem: Optional[str] = Field(None, max_length=500)
    slug: Optional[str] = None
    publicado: Optional[bool] = None
    falecido_id: Optional[str] = None
