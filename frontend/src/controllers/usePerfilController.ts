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

  const isCpfValid = (cpf: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
  const isTelefoneValid = (tel: string) => /^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$/.test(tel);

  const salvar = async () => {
    if (!user) return;
    if (!form.nome || form.nome.trim().length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres");
      return;
    }
    if (form.cpf && !isCpfValid(form.cpf)) {
      toast.error("CPF inválido. Use o formato 000.000.000-00");
      return;
    }
    if (form.telefone && !isTelefoneValid(form.telefone)) {
      toast.error("Telefone inválido. Use o formato (99) 99999-9999");
      return;
    }
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
