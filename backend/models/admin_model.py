from ..config.deps import get_supabase

class AdminModel:
    @staticmethod
    def get_stats(funeraria_id: str):
        sb = get_supabase()
        roles = (
            sb.table("user_roles")
            .select("user_id")
            .eq("role", "cliente")
            .execute()
        )
        cliente_ids = [r["user_id"] for r in (roles.data or []) if r.get("user_id")]
        perfis = (
            sb.table("profiles")
            .select("user_id", count="exact")
            .eq("funeraria_id", funeraria_id)
            .in_("user_id", cliente_ids or ["00000000-0000-0000-0000-000000000000"])
            .execute()
        )
        user_ids = [p["user_id"] for p in (perfis.data or []) if p.get("user_id")]

        if user_ids:
            pendentes = (
                sb.table("documentos")
                .select("id", count="exact")
                .in_("status", ["analise", "pendente"])
                .in_("user_id", user_ids)
                .execute()
            )
            pendentes_count = pendentes.count or 0
        else:
            pendentes_count = 0

        planos = sb.table("planos").select("id", count="exact").eq("ativo", True).eq("funeraria_id", funeraria_id).execute()
        clientes = perfis
        return {
            "pendentes": pendentes_count,
            "planos": planos.count or 0,
            "clientes": clientes.count or 0,
        }

    @staticmethod
    def listar_clientes(funeraria_id: str):
        sb = get_supabase()
        roles = (
            sb.table("user_roles")
            .select("user_id")
            .eq("role", "cliente")
            .execute()
        )
        cliente_ids = [r["user_id"] for r in (roles.data or []) if r.get("user_id")]
        if not cliente_ids:
            return []

        result = (
            sb.table("profiles")
            .select("user_id,nome,email,created_at")
            .eq("funeraria_id", funeraria_id)
            .in_("user_id", cliente_ids)
            .order("created_at", desc=True)
            .execute()
        )
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
    def listar_documentos_pendentes(funeraria_id: str):
        sb = get_supabase()
        perfis = sb.table("profiles").select("user_id").eq("funeraria_id", funeraria_id).execute()
        user_ids = [p["user_id"] for p in (perfis.data or []) if p.get("user_id")]
        if not user_ids:
            return []

        result = (
            sb.table("documentos")
            .select("id,user_id,status,arquivo_path,updated_at,tipo_id")
            .in_("status", ["analise", "pendente"])
            .in_("user_id", user_ids)
            .order("updated_at", desc=True)
            .execute()
        )
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
