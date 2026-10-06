"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";
import Figura from "@/components/Figura";
import { supabase } from "@/lib/supabase";
import {
  definirUsuario, usuarioAtual, reenviarTudo, temDadosLocais, dadosAntigos, importarAntigos,
} from "@/lib/sync";
import { CHAVES_FINANCAS, initFinancasSync } from "@/lib/financas-data";
import { APP, TEMA } from "@/lib/tema";
import { emailDoLogin, nomeDaConta, senhaDoBanco } from "@/lib/conta";
import { fofo } from "@/components/Fofos";

// ─── a conta (entrar, sair, sincronizar) ───────────────────────

interface Conta {
  email: string | null;
  sincronizando: boolean;
  abrirEntrar: () => void;
  sair: () => void;
}

const ContaCtx = createContext<Conta>({ email: null, sincronizando: false, abrirEntrar: () => {}, sair: () => {} });
export const useConta = () => useContext(ContaCtx);

const DISPENSOU_ANTIGOS = `${APP}:antigos-dispensado`;

/**
 * A conta é deste app? Cada login abre um app só (tabela financas_contas):
 * o da Iara não abre o Inari, o do Ângelo não abre o Snowbobão. Sem internet
 * não dá para saber; aí deixa passar, porque o banco recusa do mesmo jeito.
 */
async function contaDesteApp(): Promise<boolean> {
  const { data, error } = await supabase.from("financas_contas").select("app").maybeSingle();
  if (error) return true;
  return data?.app === APP;
}

function comPrazo<T>(p: Promise<T>, ms: number, reserva: T): Promise<T> {
  return Promise.race([p, new Promise<T>((r) => setTimeout(() => r(reserva), ms))]);
}

export default function Moldura({ children }: { children: React.ReactNode }) {
  const [pronto, setPronto] = useState(false);
  const [versao, setVersao] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const [sincronizando, setSincronizando] = useState(false);
  const [entrando, setEntrando] = useState(false);
  const [antigos, setAntigos] = useState<{ qtdLancamentos: number; chaves: string[] } | null>(null);

  const puxar = useCallback(async () => {
    if (!usuarioAtual()) return false;
    setSincronizando(true);
    const mudou = await comPrazo(initFinancasSync(), 8000, false);
    setSincronizando(false);
    return mudou;
  }, []);

  useEffect(() => {
    let vivo = true;
    (async () => {
      try {
        const { data } = await comPrazo(supabase.auth.getSession(), 5000, { data: { session: null } } as Awaited<ReturnType<typeof supabase.auth.getSession>>);
        const u = data.session?.user;
        if (u && !(await comPrazo(contaDesteApp(), 5000, true))) {
          await supabase.auth.signOut({ scope: "local" });
        } else if (u) {
          definirUsuario(u.id);
          setEmail(nomeDaConta(u.email));
          await puxar();
        }
      } catch {}
      if (!vivo) return;
      let dispensou = false;
      try { dispensou = localStorage.getItem(DISPENSOU_ANTIGOS) === "1"; } catch {}
      if (TEMA.trazAntigos && !dispensou && !temDadosLocais(CHAVES_FINANCAS)) setAntigos(dadosAntigos(CHAVES_FINANCAS));
      setPronto(true);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === "SIGNED_OUT") {
        definirUsuario(null);
        setEmail(null);
      }
    });
    const voltouInternet = () => { void reenviarTudo(); };
    const voltouPraAba = async () => {
      if (document.visibilityState !== "visible") return;
      if (await puxar()) setVersao((v) => v + 1);
    };
    window.addEventListener("online", voltouInternet);
    document.addEventListener("visibilitychange", voltouPraAba);
    return () => {
      vivo = false;
      sub.subscription.unsubscribe();
      window.removeEventListener("online", voltouInternet);
      document.removeEventListener("visibilitychange", voltouPraAba);
    };
  }, [puxar]);

  async function entrar(emailDigitado: string, senha: string): Promise<string | null> {
    const { data, error } = await supabase.auth.signInWithPassword({ email: emailDoLogin(emailDigitado), password: senhaDoBanco(senha) });
    if (error || !data.user) {
      if (error?.message?.toLowerCase().includes("invalid")) return "Nome ou senha não conferem.";
      return "Não consegui entrar agora. Confira a internet e tente de novo.";
    }
    if (!(await contaDesteApp())) {
      await supabase.auth.signOut({ scope: "local" });
      return `Esse login não abre o ${TEMA.nome}.`;
    }
    definirUsuario(data.user.id);
    setEmail(nomeDaConta(data.user.email));
    await puxar();
    setVersao((v) => v + 1);
    setEntrando(false);
    return null;
  }

  async function sair() {
    if (!confirm("Sair da conta? Os dados continuam neste aparelho; só param de ir para a nuvem.")) return;
    await supabase.auth.signOut({ scope: "local" });
    definirUsuario(null);
    setEmail(null);
  }

  function trazerAntigos() {
    if (!antigos) return;
    importarAntigos(antigos.chaves);
    setAntigos(null);
    setVersao((v) => v + 1);
  }

  function dispensarAntigos() {
    try { localStorage.setItem(DISPENSOU_ANTIGOS, "1"); } catch {}
    setAntigos(null);
  }

  if (!pronto) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-6 text-center">
        <Figura fig={TEMA.carregando} altura={120} className="animate-pulse" />
        <p className="font-dm text-sm" style={{ color: "var(--text-secondary)" }}>{TEMA.textos.carregando}</p>
      </div>
    );
  }

  return (
    <ContaCtx.Provider value={{ email, sincronizando, abrirEntrar: () => setEntrando(true), sair }}>
      <main className="max-w-6xl mx-auto px-3 sm:px-5 md:px-8 pb-28 overflow-x-clip">
        {antigos && (
          <div className="mt-4 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 cartinha"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-orange)" }}>
            <p className="font-dm text-sm flex-1" style={{ color: "var(--text-primary)" }}>
              Achei neste navegador os dados do antigo Finanças do Meu Consultório
              {antigos.qtdLancamentos > 0 ? ` (${antigos.qtdLancamentos} lançamentos)` : ""}. Quer trazer para o {TEMA.nome}?
            </p>
            <div className="flex gap-2">
              <button onClick={trazerAntigos} className="px-4 py-2 rounded-lg font-dm text-sm font-semibold"
                style={{ background: "var(--orange-500)", color: "var(--sobre-acento)" }}>
                Trazer
              </button>
              <button onClick={dispensarAntigos} className="btn-soft">Agora não</button>
            </div>
          </div>
        )}
        <div key={versao}>{children}</div>
        <footer className="relative mt-20 flex flex-col items-center gap-1 text-center">
          <Figura fig={TEMA.rodape} altura={APP === "inari" ? 70 : 60} className="pointer-events-none select-none" />
          {TEMA.assinatura && (
            <p className="font-fraunces italic text-[17px] flex items-center gap-1.5 mb-1" style={{ color: "var(--text-secondary)" }}>
              {TEMA.assinatura} <span style={{ color: "var(--orange-500)" }}>{fofo("pata", 14)}</span>
            </p>
          )}
          <p className="font-dm text-xs" style={{ color: "var(--text-tertiary)" }}>
            {email ? `Guardado neste aparelho e na conta ${email}.` : "Guardado só neste aparelho. Entre na conta para ver no celular e no computador."}
          </p>
        </footer>
      </main>
      {entrando && <ModalEntrar onClose={() => setEntrando(false)} onEntrar={entrar} />}
    </ContaCtx.Provider>
  );
}

function ModalEntrar({ onClose, onEntrar }: {
  onClose: () => void;
  onEntrar: (email: string, senha: string) => Promise<string | null>;
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [indo, setIndo] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setIndo(true);
    setErro(await onEntrar(email, senha));
    setIndo(false);
  }

  const campo = "w-full px-3.5 py-2.5 rounded-lg font-dm text-sm outline-none";
  const estiloCampo = { background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-primary)" };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center fundo-modal p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form onSubmit={enviar} className="relative rounded-2xl w-full max-w-sm p-7 pt-24 cartinha"
        style={{ background: "var(--bg-card-elevated)", border: "1px solid var(--border-default)" }}>
        <Figura fig={TEMA.entrar} altura={140} className="absolute left-1/2 -translate-x-1/2 -top-16 pointer-events-none" />
        <button type="button" onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg" aria-label="Fechar"
          style={{ color: "var(--text-tertiary)" }}>
          <X size={18} />
        </button>
        <h2 className="font-fraunces text-2xl text-center mb-1" style={{ color: "var(--text-primary)" }}>{TEMA.textos.entrarTitulo}</h2>
        <p className="font-dm text-sm text-center mb-5" style={{ color: "var(--text-secondary)" }}>{TEMA.textos.entrarSub}</p>
        <label className="block font-dm text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Nome</label>
        <input type="text" autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className={`${campo} mb-3`} style={estiloCampo} />
        <label className="block font-dm text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Senha</label>
        <input type="password" inputMode="numeric" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)}
          className={`${campo} mb-4`} style={estiloCampo} />
        {erro && <p className="font-dm text-sm mb-3" style={{ color: "var(--neg)" }}>{erro}</p>}
        <button type="submit" disabled={indo} className="w-full py-3 rounded-xl font-dm text-sm font-semibold transition-all disabled:opacity-60"
          style={{ background: "var(--orange-500)", color: "var(--sobre-acento)" }}>
          {indo ? "Entrando…" : "Entrar"}
        </button>
        {TEMA.notaDaConta && (
          <p className="font-dm text-[12px] text-center mt-4" style={{ color: "var(--text-tertiary)" }}>
            {TEMA.notaDaConta}
          </p>
        )}
      </form>
    </div>
  );
}
