import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/controllers/useAuthController";
import { usuarioModel } from "@/models/usuarioModel";
import { funerariaModel } from "@/models/funerariaModel";

export function usePerfilController() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome_admin: "",
    email: "",
    razao_social: "",
    telefone: "",
    cnpj: "",
    endereco: "",
  });
  const [funerariaId, setFunerariaId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [adminProfile, funId] = await Promise.all([
          usuarioModel.getByUserId(user.id),
          usuarioModel.getFunerariaDoAdmin(user.id),
        ]);
        setFunerariaId(funId);
        
        let funData = null;
        if (funId) {
          funData = await funerariaModel.getById(funId);
        }

        setForm({
          nome_admin: adminProfile?.nome ?? "",
          email: adminProfile?.email ?? "",
          razao_social: funData?.razao_social ?? "",
          telefone: funData?.telefone ?? "",
          cnpj: funData?.cnpj ?? "",
          endereco: funData?.endereco ?? "",
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    })();
  }, [user]);

  const isCnpjValid = (cnpj: string) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
  const isTelefoneValid = (tel: string) => {
    const digits = tel.replace(/\D/g, "");
    return digits.length >= 10 && digits.length <= 11;
  };

  const salvar = async () => {
    if (!user) return;
    if (!form.razao_social || form.razao_social.trim().length < 2) {
      toast.error("Nome da funerária deve ter pelo menos 2 caracteres");
      return;
    }
    if (!form.nome_admin || form.nome_admin.trim().length < 2) {
      toast.error("Nome do responsável deve ter pelo menos 2 caracteres");
      return;
    }
    if (form.cnpj && !isCnpjValid(form.cnpj)) {
      toast.error("CNPJ inválido. Use o formato 00.000.000/0000-00");
      return;
    }
    if (form.telefone && !isTelefoneValid(form.telefone)) {
      toast.error("Telefone inválido. Use o formato (99) 99999-9999");
      return;
    }
    setSaving(true);
    try {
      await usuarioModel.update(user.id, {
        nome: form.nome_admin,
      });
      if (funerariaId) {
        await funerariaModel.update(funerariaId, {
          razao_social: form.razao_social,
          telefone: form.telefone,
          cnpj: form.cnpj,
          endereco: form.endereco,
        });
      }
      toast.success("Perfil atualizado com sucesso!");
    } catch (e: any) { 
      toast.error(e.message); 
    }
    finally { setSaving(false); }
  };

  const sair = async () => { await signOut(); nav("/"); };

  return { loading, saving, form, setForm, salvar, sair };
}
