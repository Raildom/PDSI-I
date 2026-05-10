from ..config.deps import get_supabase

class ProcessosModel:
    @staticmethod
    def listar(user_id: str):
        sb = get_supabase()
        return sb.table("processo_etapas").select("*").eq("user_id", user_id).order("ordem").execute()

    @staticmethod
    def atualizar(etapa_id: str, user_id: str, concluido: bool):
        sb = get_supabase()
        return sb.table("processo_etapas").update({"concluido": concluido}).eq("id", etapa_id).eq("user_id", user_id).execute()

    @staticmethod
    def seed_initial(user_id: str):
        sb = get_supabase()
        # Create initial checklist
        etapas = [
            {"user_id": user_id, "titulo": "Dados do Falecido", "subtitulo": "Preencha as informações básicas", "ordem": 1, "acao": "Preencher"},
            {"user_id": user_id, "titulo": "Escolha do Plano", "subtitulo": "Selecione a cobertura desejada", "ordem": 2, "acao": "Selecionar"},
            {"user_id": user_id, "titulo": "Envio de Documentos", "subtitulo": "Anexe a documentação necessária", "ordem": 3, "acao": "Enviar"},
        ]
        return sb.table("processo_etapas").insert(etapas).execute()
