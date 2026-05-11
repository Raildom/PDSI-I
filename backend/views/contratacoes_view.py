from pydantic import BaseModel
from typing import Optional

class ContratacaoCreate(BaseModel):
    plano_id: str
    valor_mensal: float
    carencia_ate: Optional[str] = None
