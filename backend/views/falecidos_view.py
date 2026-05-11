from pydantic import BaseModel
from typing import Optional

class FalecidoCreate(BaseModel):
    nome: str
    data_nascimento: Optional[str] = None
    data_falecimento: Optional[str] = None
    cpf: Optional[str] = None
    parentesco: Optional[str] = None
    observacoes: Optional[str] = None

class FalecidoUpdate(BaseModel):
    nome: Optional[str] = None
    data_nascimento: Optional[str] = None
    data_falecimento: Optional[str] = None
    cpf: Optional[str] = None
    parentesco: Optional[str] = None
    observacoes: Optional[str] = None
