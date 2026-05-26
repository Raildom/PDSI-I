
from pydantic import BaseModel, Field
from typing import Optional

class PerfilUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=2, max_length=100)
    telefone: Optional[str] = Field(
        None,
        pattern=r"^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$",
        description="Telefone no formato (99) 99999-9999 ou 99999-9999"
    )

class PerfilResponse(BaseModel):
    id: str
    user_id: str
    nome: str
    email: str
    telefone: Optional[str] = None
