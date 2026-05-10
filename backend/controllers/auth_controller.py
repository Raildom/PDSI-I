from fastapi import APIRouter, HTTPException
from ..models.auth_model import AuthModel
from ..views.auth_view import RegisterRequest, LoginRequest

router = APIRouter(prefix="/api/auth", tags=["Autenticação"])

@router.post("/register")
async def register(body: RegisterRequest):
    try:
        res = AuthModel.register_user(body)
        if res.user is None:
            raise HTTPException(status_code=400, detail="Erro ao criar conta")
        return {
            "message": "Cadastro criado com sucesso",
            "user_id": res.user.id,
            "email": res.user.email,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
async def login(body: LoginRequest):
    try:
        res = AuthModel.login_user(body)
        if res.user is None:
            raise HTTPException(status_code=401, detail="Credenciais inválidas")

        roles = AuthModel.get_user_roles(res.user.id)
        role_list = [r["role"] for r in (roles.data or [])]
        role = "super_admin" if "super_admin" in role_list else "admin" if "admin" in role_list else "cliente" if "cliente" in role_list else None

        return {
            "access_token": res.session.access_token,
            "refresh_token": res.session.refresh_token,
            "user": {
                "id": res.user.id,
                "email": res.user.email,
                "role": role,
            },
        }
    except Exception as e:
        detail = str(e)
        if "Invalid login credentials" in detail:
            detail = "E-mail ou senha incorretos"
        raise HTTPException(status_code=401, detail=detail)
