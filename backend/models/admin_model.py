from ..config.deps import get_supabase

class AdminModel:
    @staticmethod
    def get_stats():
        sb = get_supabase()
        pendentes = sb.table("documentos").select("id", count="exact").in_("status", ["analise", "pendente"]).execute()
        planos = sb.table("planos").select("id", count="exact").eq("ativo", True).execute()
        clientes = sb.table("profiles").select("id", count="exact").execute()
        return {
            "pendentes": pendentes.count or 0,
            "planos": planos.count or 0,
            "clientes": clientes.count or 0,
        }

    @staticmethod
    def listar_clientes():
        sb = get_supabase()
        result = sb.table("profiles").select("user_id,nome,email,created_at").order("created_at", desc=True).execute()
        clientes = []
        for p in (result.data or []):
            fal = sb.table("falecidos").select("nome").eq("user_id", p["user_id"]).limit(1).execute()
            con = sb.table("contratacoes").select("status").eq("user_id", p["user_id"]).limit(1).execute()
            clientes.append({
                "user_id": p["user_id"],
                "nome": p["nome"],
                "email": p["email"],
                "falecido": fal.data[0]["nome"] if fal.data else None,
                "status_contrato": con.data[0]["status"] if con.data else None,
            })
        return clientes

    @staticmethod
    def listar_documentos_pendentes():
        sb = get_supabase()
        result = sb.table("documentos") \
            .select("id,user_id,status,arquivo_path,updated_at,tipo_id") \
            .in_("status", ["analise", "pendente", "rejeitado"]) \
            .order("updated_at", desc=True).execute()
        docs = []
        for d in (result.data or []):
            tipo = sb.table("tipos_documento").select("nome,descricao").eq("id", d["tipo_id"]).maybe_single().execute()
            profile = sb.table("profiles").select("nome,email").eq("user_id", d["user_id"]).maybe_single().execute()
            docs.append({
                **d,
                "tipos_documento": tipo.data,
                "profiles": profile.data,
            })
        return docs
