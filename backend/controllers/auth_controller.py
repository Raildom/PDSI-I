from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
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

        response = JSONResponse(
            status_code=200,
            content={
                "access_token": res.session.access_token,
                "refresh_token": res.session.refresh_token,
                "user": {
                    "id": res.user.id,
                    "email": res.user.email,
                    "role": role,
                },
            },
        )

        # Enviar token como HTTP-only cookie (não acessível via JavaScript)
        response.set_cookie(
            key="auth_token",
            value=res.session.access_token,
            httponly=True,  # Protege contra XSS
            secure=False,   # Mude para True em produção (apenas HTTPS)
            samesite="Lax", # Protege contra CSRF
            max_age=3600,   # 1 hora
            path="/api"     # Cookie só é enviado para /api requests
        )

        return response
    except Exception as e:
        detail = str(e)
        if "Invalid login credentials" in detail:
            detail = "E-mail ou senha incorretos"
        raise HTTPException(status_code=401, detail=detail)

@router.post("/logout")
async def logout():
    """Endpoint para fazer logout e limpar o cookie de autenticação"""
    response = JSONResponse(
        status_code=200,
        content={"message": "Logout realizado com sucesso"},
    )

    # Limpar o cookie de autenticação (max_age=0 o deleta)
    response.delete_cookie(
        key="auth_token",
        path="/api",
        httponly=True,
        samesite="Lax"
    )

    return response
