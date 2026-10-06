"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Figura from "@/components/Figura";
import ModoTema from "@/components/ModoTema";
import { supabase } from "@/lib/supabase";
import {
  definirUsuario, usuarioAtual, reenviarTudo, temDadosLocais, dadosAntigos, importarAntigos,
  esperarEnvios, limparDadosLocais, assumirDadosLocais,
} from "@/lib/sync";
import { CHAVES_FINANCAS, initFinancasSync } from "@/lib/financas-data";
import { APP, TEMA } from "@/lib/tema";
import { emailDoLogin, nomeDaConta, senhaDoBanco } from "@/lib/conta";
import { fofo } from "@/components/Fofos";

// ─── a conta (entrar, sair, sincronizar) ───────────────────────
// ⛔ Sem login, o app não mostra NADA da conta: só a tela de entrar. Os dados
// só são lidos depois que a conta entra (e é deste app), e saem do aparelho
// quando ela sai.

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
          assumirDadosLocais(u.id);
          definirUsuario(u.id);
          await puxar();
          setEmail(nomeDaConta(u.email));
        }
      } catch {}
      if (!vivo) return;
      let dispensou = false;
      try { dispensou = localStorage.getItem(DISPENSOU_ANTIGOS) === "1"; } catch {}
      if (TEMA.trazAntigos && usuarioAtual() && !dispensou && !temDadosLocais(CHAVES_FINANCAS)) setAntigos(dadosAntigos(CHAVES_FINANCAS));
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
    assumirDadosLocais(data.user.id);
    definirUsuario(data.user.id);
    await puxar();
    setVersao((v) => v + 1);
    setEmail(nomeDaConta(data.user.email));
    return null;
  }

  async function sair() {
    if (!confirm("Sair da conta? As contas saem deste aparelho e continuam guardadas no login.")) return;
    // antes de apagar daqui, garante que tudo subiu
    await comPrazo(reenviarTudo(), 8000, false);
    const subiu = await comPrazo(esperarEnvios(), 8000, false);
    if (!subiu && !confirm("Não consegui confirmar que tudo foi para a nuvem (sem internet?). Sair mesmo assim? O que não subiu se perde.")) return;
    await supabase.auth.signOut({ scope: "local" });
    limparDadosLocais();
    definirUsuario(null);
    setAntigos(null);
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

  if (!email) return <TelaEntrar onEntrar={entrar} />;

  return (
    <ContaCtx.Provider value={{ email, sincronizando, abrirEntrar: () => {}, sair }}>
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
    </ContaCtx.Provider>
  );
}

/** A única coisa que aparece sem login: o nome do app e o formulário de entrar. */
function TelaEntrar({ onEntrar }: { onEntrar: (email: string, senha: string) => Promise<string | null> }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [indo, setIndo] = useState(false);
  const snow = APP === "snowbobao";

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setIndo(true);
    setErro(await onEntrar(email, senha));
    setIndo(false);
  }

  const campo = "w-full px-3.5 py-3 rounded-lg font-dm text-base outline-none";
  const estiloCampo = { background: "var(--bg-input)", border: "1px solid var(--border-default)", color: "var(--text-primary)" };

  return (
    <main className="tela-entrar min-h-screen flex flex-col items-center justify-center px-5 py-10">
      <div className="absolute right-4 top-4" style={{ marginTop: "env(safe-area-inset-top)" }}>
        <ModoTema className="btn-soft" />
      </div>
      <p className="font-dm uppercase text-[11px] tracking-[.24em] text-center" style={{ color: "var(--orange-500)" }}>
        {TEMA.marca}
      </p>
      <h1 className="font-fraunces leading-none text-center mt-1"
        style={{
          fontSize: "clamp(46px, 13vw, 68px)", color: "var(--text-primary)", fontSizeAdjust: "none",
          fontWeight: snow ? 500 : undefined, fontVariationSettings: snow ? undefined : '"SOFT" 100, "WONK" 1',
        }}>
        {TEMA.titulo[0]}<em style={{ color: "var(--orange-500)", fontStyle: "italic" }}>{TEMA.titulo[1]}</em>
      </h1>
      <form onSubmit={enviar} className="relative rounded-2xl w-full max-w-sm p-7 pt-24 mt-24 cartinha"
        style={{ background: "var(--bg-card-elevated)", border: "1px solid var(--border-default)" }}>
        <Figura fig={TEMA.entrar} altura={140} className="absolute left-1/2 -translate-x-1/2 -top-16 pointer-events-none" />
        <h2 className="font-fraunces text-2xl text-center mb-1" style={{ color: "var(--text-primary)" }}>{TEMA.textos.entrarTitulo}</h2>
        <p className="font-dm text-sm text-center mb-5" style={{ color: "var(--text-secondary)" }}>
          As contas só aparecem depois de entrar.
        </p>
        <label className="block font-dm text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Nome</label>
        <input type="text" autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} required
          value={email} onChange={(e) => setEmail(e.target.value)}
          className={`${campo} mb-3`} style={estiloCampo} />
        <label className="block font-dm text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>Senha</label>
        <input type="password" inputMode="numeric" autoComplete="current-password" required value={senha} onChange={(e) => setSenha(e.target.value)}
          className={`${campo} mb-4`} style={estiloCampo} />
        {erro && <p className="font-dm text-sm mb-3" style={{ color: "var(--neg)" }}>{erro}</p>}
        <button type="submit" disabled={indo} className="w-full py-3.5 rounded-xl font-dm text-base font-semibold transition-all disabled:opacity-60"
          style={{ background: "var(--orange-500)", color: "var(--sobre-acento)" }}>
          {indo ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
