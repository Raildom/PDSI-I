from ..config.deps import get_supabase
from ..views.auth_view import RegisterRequest, LoginRequest

class AuthModel:
    @staticmethod
    def register_user(data: RegisterRequest):
        sb = get_supabase()
        return sb.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {
                "data": {
                    "nome": data.nome,
                    "telefone": data.telefone or "",
                    "cpf": data.cpf or "",
                    "funeraria_id": data.funeraria_id or "",
                },
            },
        })

    @staticmethod
    def login_user(data: LoginRequest):
        sb = get_supabase()
        return sb.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })

    @staticmethod
    def get_user_roles(user_id: str):
        sb = get_supabase()
        return sb.table("user_roles").select("role").eq("user_id", user_id).execute()
