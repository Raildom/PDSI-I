from pydantic import BaseModel
from typing import Optional

class PlanoCreate(BaseModel):
    titulo: str
    descricao: str
    valor_mensal: float
    beneficios: Optional[str] = None
    destaque: Optional[bool] = False
    ativo: Optional[bool] = True

class PlanoUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    valor_mensal: Optional[float] = None
    beneficios: Optional[str] = None
    destaque: Optional[bool] = None
    ativo: Optional[bool] = None
