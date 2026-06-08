
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class FunerariaCreate(BaseModel):
    razao_social: str = Field(..., min_length=2, max_length=100)
    cnpj: Optional[str] = Field(
        None,
        pattern=r"^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$",
        description="CNPJ no formato 00.000.000/0000-00"
    )
    telefone: Optional[str] = Field(
        None,
        pattern=r"^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$",
        description="Telefone no formato (99) 99999-9999 ou 99999-9999"
    )
    email: Optional[EmailStr] = None
    endereco: Optional[str] = Field(None, max_length=300)
    ativo: Optional[bool] = True
    admin_nome: str = Field(..., min_length=2, max_length=100)
    admin_password: str = Field(..., min_length=8, max_length=128)

class FunerariaUpdate(BaseModel):
    razao_social: Optional[str] = Field(None, min_length=2, max_length=100)
    cnpj: Optional[str] = Field(
        None,
        pattern=r"^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$",
        description="CNPJ no formato 00.000.000/0000-00"
    )
    telefone: Optional[str] = Field(
        None,
        pattern=r"^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$",
        description="Telefone no formato (99) 99999-9999 ou 99999-9999"
    )
    email: Optional[EmailStr] = None
    endereco: Optional[str] = Field(None, max_length=300)
    ativo: Optional[bool] = None
