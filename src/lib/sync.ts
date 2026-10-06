/**
 * Guarda os dados no aparelho (localStorage) e, com a conta entrada, na
 * tabela financas_kv do banco. Cada app tem o seu prefixo, então o Inari e o
 * Snowbobão nunca se misturam, nem no aparelho nem no banco.
 *
 * - Salvar: grava no aparelho na hora e manda para o banco em segundo plano.
 * - Abrir (ou entrar na conta): compara chave por chave; ganha a versão mais
 *   nova. Se o envio falhou (sem internet), a versão local fica mais nova e
 *   sobe na próxima vez que o app abrir ou a internet voltar.
 */

import { supabase } from "./supabase";
import { APP } from "./tema";

const NS = `${APP}:`;
const TS = `${APP}:__ts:`;

let usuario: string | null = null;
const conhecidas = new Set<string>();

export function definirUsuario(id: string | null) {
  usuario = id;
}

export function usuarioAtual() {
  return usuario;
}

function lerTs(chave: string): number {
  try {
    return Number(localStorage.getItem(TS + chave) || "0");
  } catch {
    return 0;
  }
}

function gravarLocal(chave: string, valor: unknown, ts: number) {
  try {
    localStorage.setItem(NS + chave, JSON.stringify(valor));
    localStorage.setItem(TS + chave, String(ts));
  } catch {}
}

function lerLocal(chave: string): unknown | undefined {
  try {
    const bruto = localStorage.getItem(NS + chave);
    return bruto ? JSON.parse(bruto) : undefined;
  } catch {
    return undefined;
  }
}

const pendentes = new Set<Promise<boolean>>();

/** Manda uma chave para o banco. Devolve se subiu. */
function enviar(chave: string, valor: unknown, ts: number): Promise<boolean> {
  if (!usuario) return Promise.resolve(false);
  const uid = usuario;
  const p = (async () => {
    try {
      const { error } = await supabase.from("financas_kv").upsert({
        user_id: uid,
        app: APP,
        chave,
        valor,
        atualizado_em: new Date(ts).toISOString(),
      });
      if (error && process.env.NODE_ENV === "development") console.warn("[sync] envio falhou", chave, error.message);
      return !error;
    } catch {
      return false;
    }
  })();
  pendentes.add(p);
  void p.finally(() => pendentes.delete(p));
  return p;
}

/** Espera os envios em andamento. Devolve se todos subiram. */
export async function esperarEnvios(): Promise<boolean> {
  const r = await Promise.all(Array.from(pendentes));
  return r.every(Boolean);
}

// ─── Os dados do aparelho são de uma conta só ─────────────────
// Sem login o app não mostra nada (Moldura). Ao sair, os dados deste app saem
// do aparelho; e se outra conta entrar num aparelho que tem dados de alguém,
// eles somem antes de sincronizar, para nunca subir para a conta errada.

const DONO = `${NS}__dono`;

/** Apaga deste aparelho tudo o que é deste app (dados e carimbos de hora). */
export function limparDadosLocais() {
  try {
    const fora: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(NS)) fora.push(k);
    }
    fora.forEach((k) => localStorage.removeItem(k));
  } catch {}
}

/** Marca os dados deste aparelho como da conta que entrou (limpa se eram de outra). */
export function assumirDadosLocais(uid: string) {
  try {
    const dono = localStorage.getItem(DONO);
    if (dono && dono !== uid) limparDadosLocais();
    localStorage.setItem(DONO, uid);
  } catch {}
}

/** Puxa do banco as chaves pedidas e acerta com o aparelho. Devolve se algo mudou aqui. */
export async function initSync(chaves: string[]): Promise<boolean> {
  if (typeof window === "undefined") return false;
  chaves.forEach((c) => conhecidas.add(c));
  if (!usuario) return false;
  const { data, error } = await supabase
    .from("financas_kv")
    .select("chave, valor, atualizado_em")
    .eq("app", APP)
    .in("chave", chaves);
  if (error) {
    if (process.env.NODE_ENV === "development") console.warn("[sync] leitura falhou", error.message);
    return false;
  }
  let mudou = false;
  const noBanco = new Set<string>();
  for (const linha of data || []) {
    noBanco.add(linha.chave);
    const tsRemoto = new Date(linha.atualizado_em).getTime();
    const tsLocal = lerTs(linha.chave);
    if (tsRemoto > tsLocal) {
      gravarLocal(linha.chave, linha.valor, tsRemoto);
      mudou = true;
    } else if (tsLocal > tsRemoto) {
      const local = lerLocal(linha.chave);
      if (local !== undefined) void enviar(linha.chave, local, tsLocal);
    }
  }
  for (const chave of chaves) {
    if (noBanco.has(chave)) continue;
    const local = lerLocal(chave);
    if (local !== undefined && lerTs(chave) > 0) void enviar(chave, local, lerTs(chave));
  }
  return mudou;
}

/** Sobe o que ficou para trás (chamado quando a internet volta). */
export function reenviarTudo() {
  return initSync(Array.from(conhecidas));
}

export function syncSave<T>(chave: string, dados: T): void {
  if (typeof window === "undefined") return;
  const ts = Date.now();
  gravarLocal(chave, dados, ts);
  void enviar(chave, dados, ts);
}

export function syncLoad<T>(chave: string, semente: T): T {
  if (typeof window === "undefined") return semente;
  const local = lerLocal(chave);
  return local === undefined ? semente : (local as T);
}

/** Tem algum dado salvo neste app, neste aparelho? */
export function temDadosLocais(chaves: string[]) {
  return chaves.some((c) => lerTs(c) > 0);
}

// ─── Dados do antigo Meu Consultório ──────────────────────────
// O módulo Finanças de lá guardava as mesmas chaves sem prefixo («fin:txs»…)
// neste mesmo endereço (gabriel20angelo-web.github.io). Se ainda estiverem no
// navegador, dá para trazer.

export function dadosAntigos(chaves: string[]): { qtdLancamentos: number; chaves: string[] } | null {
  try {
    const achadas = chaves.filter((c) => localStorage.getItem(c) !== null);
    if (!achadas.length) return null;
    const txs = JSON.parse(localStorage.getItem("fin:txs") || "[]");
    const qtd = Array.isArray(txs) ? txs.length : 0;
    const fixos = JSON.parse(localStorage.getItem("fin:fixos") || "[]");
    if (qtd === 0 && !(Array.isArray(fixos) && fixos.length)) return null;
    return { qtdLancamentos: qtd, chaves: achadas };
  } catch {
    return null;
  }
}

export function importarAntigos(chaves: string[]) {
  for (const c of chaves) {
    try {
      const bruto = localStorage.getItem(c);
      if (bruto !== null) syncSave(c, JSON.parse(bruto));
    } catch {}
  }
}
