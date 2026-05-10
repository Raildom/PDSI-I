from pydantic import BaseModel, EmailStr
from typing import Optional

class FunerariaCreate(BaseModel):
    razao_social: str
    cnpj: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[EmailStr] = None
    endereco: Optional[str] = None
    ativo: Optional[bool] = True
    admin_nome: str
    admin_password: str

class FunerariaUpdate(BaseModel):
    razao_social: Optional[str] = None
    cnpj: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[EmailStr] = None
    endereco: Optional[str] = None
    ativo: Optional[bool] = None
