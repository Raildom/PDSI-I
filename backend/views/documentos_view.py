from pydantic import BaseModel
from typing import Optional

class DocumentoStatusUpdate(BaseModel):
    status: str  # aprovado | rejeitado
    observacao_admin: Optional[str] = None
