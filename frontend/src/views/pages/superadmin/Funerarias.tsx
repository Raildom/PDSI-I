import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import InputMask from "react-input-mask";
import { Building2, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/views/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/views/components/ui/alert-dialog";
import { Input } from "@/views/components/ui/input";
import { Label } from "@/views/components/ui/label";
import { Textarea } from "@/views/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/models/api";

interface FunerariaRow {
  id: string;
  razao_social: string;
  cnpj: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  ativo: boolean;
}

const emptyForm = {
  id: "",
  razao_social: "",
  cnpj: "",
  telefone: "",
  email: "",
  endereco: "",
  ativo: true,
  admin_nome: "",
  admin_password: "",
};

type FunerariasLocationState = { showFunerariasList?: number };

export default function Funerarias() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [rows, setRows] = useState<FunerariaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [credenciais, setCredenciais] = useState<{
    admin_email: string;
    admin_password: string | null;
  } | null>(null);
  const [credenciaisLoading, setCredenciaisLoading] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<FunerariaRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await api.superAdmin.funerarias.listar();
      setRows(data ?? []);
    } catch (e: any) {
      toast.error(e.message);
    }
    setLoading(false);
  };

  const novo = useCallback(() => {
    setForm(emptyForm);
    setCredenciais(null);
    setCredenciaisLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    const st = location.state as FunerariasLocationState | null | undefined;
    if (st?.showFunerariasList === undefined) return;
    setShowForm(false);
    novo();
    navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: {} });
  }, [location.state, location.pathname, location.search, navigate, novo]);

  useEffect(() => {
    if (searchParams.get("new") === "1") {
      setShowForm(true);
      novo();
    } else {
      setShowForm(false);
    }
  }, [searchParams, novo]);

  const carregarCredenciais = async (funerariaId: string) => {
    setCredenciaisLoading(true);
    setCredenciais(null);
    try {
      const data = await api.superAdmin.funerarias.credenciais(funerariaId);
      setCredenciais(data);
    } catch (e: any) {
      toast.error(e.message);
    }
    setCredenciaisLoading(false);
  };

  const select = async (f: FunerariaRow) => {
    setForm({
      id: f.id,
      razao_social: f.razao_social,
      cnpj: f.cnpj ?? "",
      telefone: f.telefone ?? "",
      email: f.email ?? "",
      endereco: f.endereco ?? "",
      ativo: !!f.ativo,
      admin_nome: "",
      admin_password: "",
    });
    setShowForm(true);
    await carregarCredenciais(f.id);
  };

  const isCnpjValid = (cnpj: string) => /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(cnpj);
  const isTelefoneValid = (tel: string) => /^(\(\d{2}\)\s?)?\d{4,5}-\d{4}$/.test(tel);
  const isEmailValid = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const salvar = async () => {
    if (!form.razao_social.trim()) {
      toast.error("Informe a razao social");
      return;
    }
    if (form.razao_social.trim().length < 2) {
      toast.error("Razão social deve ter pelo menos 2 caracteres");
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
    if (form.email && !isEmailValid(form.email)) {
      toast.error("E-mail inválido");
      return;
    }
    if (!form.id && (!form.email.trim() || !form.admin_nome.trim() || !form.admin_password.trim())) {
      toast.error("Preencha e-mail e dados do administrador da funerária");
      return;
    }
    if (!form.id && form.admin_password.length < 8) {
      toast.error("A senha do admin deve ter no mínimo 8 caracteres");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        razao_social: form.razao_social.trim(),
        cnpj: form.cnpj.trim() || null,
        telefone: form.telefone.trim() || null,
        email: form.email.trim() || null,
        endereco: form.endereco.trim() || null,
        ativo: form.ativo,
        admin_nome: form.admin_nome.trim(),
        admin_password: form.admin_password,
      };
      if (form.id) await api.superAdmin.funerarias.atualizar(form.id, payload);
      else await api.superAdmin.funerarias.criar(payload);
      toast.success(form.id ? "Funerária atualizada" : "Funerária cadastrada");
      await fetchAll();
      setForm(emptyForm);
      setShowForm(false);
      setCredenciais(null);
    } catch (e: any) {
      toast.error(e.message);
    }
    setSaving(false);
  };

  const confirmarExclusao = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await api.superAdmin.funerarias.excluir(pendingDelete.id);
      toast.success("Funerária excluída");
      const idRemoved = pendingDelete.id;
      setPendingDelete(null);
      if (form.id === idRemoved) {
        setShowForm(false);
        novo();
        navigate("/super-admin/funerarias");
      }
      await fetchAll();
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível excluir");
    }
    setDeleting(false);
  };

  const toggleAtivo = async (f: FunerariaRow) => {
    setSaving(true);
    try {
      await api.superAdmin.funerarias.atualizar(f.id, { ativo: !f.ativo });
      toast.success(!f.ativo ? "Funerária ativada" : "Funerária desativada");
      await fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Gestão Global</p>
          <h1 className="font-serif text-4xl mt-2">Funerárias</h1>
          <p className="text-muted-foreground mt-1">Cadastre e gerencie todas as funerárias da plataforma.</p>
        </div>
      </header>

      <div>
        {!showForm && (
          <section className="max-w-3xl mx-auto w-full">
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Carregando…</div>
            ) : (
              <div className="space-y-3">
                {rows.map((f) => (
                  <div key={f.id} className="w-full rounded-2xl border p-5 transition-base bg-card hover:border-foreground/30 shadow-soft">
                    <div className="flex justify-between items-start gap-3">
                        <button
                          onClick={() => {
                            void select(f);
                          }}
                          className="text-left flex-1"
                        >
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">{f.ativo ? "Ativa" : "Inativa"}</div>
                        <h3 className="font-serif text-2xl mt-1">{f.razao_social}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{f.email ?? "—"}</p>
                      </button>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground">#{f.id.slice(0, 8)}</span>
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg"
                            disabled={saving || deleting}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAtivo(f);
                            }}
                          >
                            {f.ativo ? "Desativar" : "Ativar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg text-destructive hover:text-destructive border-destructive/40"
                            disabled={saving || deleting}
                            onClick={(e) => {
                              e.stopPropagation();
                              setPendingDelete(f);
                            }}
                          >
                            <Trash2 className="size-4 mr-1" /> Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {rows.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma funerária cadastrada.</p>}
              </div>
            )}
          </section>
        )}
        {showForm && (
          <section className="rounded-3xl bg-card border border-border p-7 shadow-soft space-y-5 self-start">
            <div className="flex items-center gap-2">
              <Building2 className="size-5" />
              <h2 className="font-serif text-2xl">{form.id ? "Editar Funerária" : "Nova Funerária"}</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Razão social</Label>
                <Input maxLength={150} value={form.razao_social} onChange={(e) => setForm({ ...form, razao_social: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">CNPJ</Label>
                <InputMask mask="99.999.999/9999-99" value={form.cnpj} onChange={(e) => setForm({ ...form, cnpj: e.target.value })}>{(inputProps: any) => (<Input {...inputProps} placeholder="00.000.000/0000-00" />)}</InputMask>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Telefone</Label>
                <InputMask mask="(99) 99999-9999" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}>{(inputProps: any) => (<Input {...inputProps} placeholder="(00) 00000-0000" />)}</InputMask>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</Label>
                <Input type="email" maxLength={100} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nome@empresa.com.br" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Endereço</Label>
                <Textarea rows={3} maxLength={300} value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
              </div>
            </div>

            {!form.id && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Administrador da funerária</Label>
                  <Input maxLength={100} value={form.admin_nome} onChange={(e) => setForm({ ...form, admin_nome: e.target.value })} placeholder="Nome completo do administrador" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Senha do administrador</Label>
                  <Input type="password" minLength={8} maxLength={128} value={form.admin_password} onChange={(e) => setForm({ ...form, admin_password: e.target.value })} placeholder="Mínimo 8 caracteres" />
                </div>
              </div>
            )}
            {form.id && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">E-mail do administrador</Label>
                  <Input
                    readOnly
                    value={credenciaisLoading ? "Carregando..." : (credenciais?.admin_email ?? "—")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Senha do administrador</Label>
                  <Input
                    type="text"
                    readOnly
                    value={
                      credenciaisLoading
                        ? "Carregando..."
                        : credenciais?.admin_password
                          ? credenciais.admin_password
                          : credenciais?.admin_email
                            ? "Senha não armazenada aqui — use recuperação no login do admin."
                            : "—"
                    }
                  />
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-2 pt-2 items-center">
              {form.id ? (
                <Button
                  type="button"
                  variant="destructive"
                  className="rounded-xl"
                  disabled={saving || deleting}
                  onClick={() =>
                    setPendingDelete({
                      id: form.id,
                      razao_social: form.razao_social,
                      cnpj: form.cnpj || null,
                      telefone: form.telefone || null,
                      email: form.email || null,
                      endereco: form.endereco || null,
                      ativo: form.ativo,
                    })
                  }
                >
                  <Trash2 className="size-4 mr-2" /> Excluir funerária
                </Button>
              ) : (
                <span />
              )}
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  disabled={deleting}
                  onClick={() => {
                    setShowForm(false);
                    novo();
                    navigate("/super-admin/funerarias");
                  }}
                >
                  Descartar
                </Button>
                <Button onClick={salvar} disabled={saving || deleting} className="rounded-xl">
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Salvar
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && !deleting && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir funerária?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span className="block">
                Esta ação remove <strong>{pendingDelete?.razao_social ?? "esta funerária"}</strong> e os dados vinculados
                aos planos (conforme o banco permite). Os logins dos administradores desta funerária serão encerrados.
              </span>
              <span className="block text-destructive">Não há como desfazer.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <Button variant="destructive" disabled={deleting} className="sm:mt-0" onClick={() => void confirmarExclusao()}>
              {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />} Excluir
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
