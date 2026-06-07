import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/controllers/useAuthController";
import { usuarioModel } from "@/models/usuarioModel";

export function usePerfilController() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", cpf: "", endereco: "" });

  useEffect(() => {
    if (!user) return;
    usuarioModel.getByUserId(user.id).then((data) => {
      if (data) setForm({
        nome: data.nome ?? "", email: data.email ?? "",
        telefone: data.telefone ?? "", cpf: data.cpf ?? "", endereco: data.endereco ?? "",
      });
      setLoading(false);
    });
  }, [user]);

  const salvar = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await usuarioModel.update(user.id, {
        nome: form.nome, telefone: form.telefone, cpf: form.cpf, endereco: form.endereco,
      });
      toast.success("Perfil atualizado");
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(false); }
  };

  const sair = async () => { await signOut(); nav("/"); };

  return { loading, saving, form, setForm, salvar, sair };
}
