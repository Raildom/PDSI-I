import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/controllers/useAuthController";
import { falecidoModel } from "@/models/falecidoModel";

const empty = { nome: "", data_nascimento: "", data_falecimento: "", cpf: "", parentesco: "", observacoes: "" };

export function useFalecidoController() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (!user) return;
    falecidoModel.getDoUsuario(user.id).then((data) => {
      if (data) {
        setId(data.id);
        setForm({
          nome: data.nome ?? "",
          data_nascimento: data.data_nascimento ?? "",
          data_falecimento: data.data_falecimento ?? "",
          cpf: data.cpf ?? "",
          parentesco: data.parentesco ?? "",
          observacoes: data.observacoes ?? "",
        });
      }
      setLoading(false);
    });
  }, [user]);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await falecidoModel.upsert(user.id, form, id);
      toast.success("Registro salvo");
      nav("/cliente");
    } catch (err: any) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return { loading, saving, id, form, setForm, salvar, nav };
}
