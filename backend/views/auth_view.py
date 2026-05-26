
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class RegisterRequest(BaseModel):
    email: EmailStr  # Usa validação robusta do Pydantic
    password: str = Field(..., min_length=8, max_length=128)
    nome: str = Field(..., min_length=2, max_length=100)
    telefone: Optional[str] = Field(
        None,
        pattern=r"^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$",
        description="Telefone no formato (99) 99999-9999 ou 99999-9999"
    )
    cpf: Optional[str] = Field(
        None,
        pattern=r"^\d{3}\.\d{3}\.\d{3}-\d{2}$",
        description="CPF no formato 000.000.000-00"
    )
    funeraria_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
