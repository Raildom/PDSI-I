from pydantic import BaseModel
from typing import Optional

class PerfilUpdate(BaseModel):
    nome: Optional[str] = None
    telefone: Optional[str] = None

class PerfilResponse(BaseModel):
    id: str
    user_id: str
    nome: str
    email: str
    telefone: Optional[str] = None
