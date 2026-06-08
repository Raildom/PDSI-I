
from pydantic import BaseModel, Field
from typing import Optional

class PlanoCreate(BaseModel):
    titulo: str = Field(..., min_length=2, max_length=100)
    descricao: str = Field(..., min_length=2, max_length=500)
    valor_mensal: float = Field(..., ge=0)
    beneficios: Optional[str] = Field(None, max_length=500)
    destaque: Optional[bool] = False
    ativo: Optional[bool] = True

class PlanoUpdate(BaseModel):
    titulo: Optional[str] = Field(None, min_length=2, max_length=100)
    descricao: Optional[str] = Field(None, min_length=2, max_length=500)
    valor_mensal: Optional[float] = Field(None, ge=0)
    beneficios: Optional[str] = Field(None, max_length=500)
    destaque: Optional[bool] = None
    ativo: Optional[bool] = None
