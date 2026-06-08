
from pydantic import BaseModel, Field
from typing import Optional


class FalecidoCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    data_nascimento: Optional[str] = None
    data_falecimento: Optional[str] = None
    cpf: Optional[str] = Field(
        None,
        pattern=r"^\d{3}\.\d{3}\.\d{3}-\d{2}$",
        description="CPF no formato 000.000.000-00"
    )
    parentesco: Optional[str] = Field(None, max_length=50)
    observacoes: Optional[str] = Field(None, max_length=500)

class FalecidoUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=2, max_length=100)
    data_nascimento: Optional[str] = None
    data_falecimento: Optional[str] = None
    cpf: Optional[str] = Field(
        None,
        pattern=r"^\d{3}\.\d{3}\.\d{3}-\d{2}$",
        description="CPF no formato 000.000.000-00"
    )
    parentesco: Optional[str] = Field(None, max_length=50)
    observacoes: Optional[str] = Field(None, max_length=500)
