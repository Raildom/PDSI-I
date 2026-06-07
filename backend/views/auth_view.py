from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    nome: str
    telefone: Optional[str] = None
    cpf: Optional[str] = None
    funeraria_id: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
