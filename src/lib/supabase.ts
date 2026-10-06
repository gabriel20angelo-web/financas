import { createClient } from "@supabase/supabase-js";
import { APP } from "./tema";

/**
 * Banco da Raposa (projeto Supabase «Kitsune projeto»). A chave abaixo é a
 * PUBLICÁVEL: pode ficar no código. Quem protege os dados é a regra da
 * tabela financas_kv (cada pessoa só lê e grava as próprias linhas, e só do
 * app da sua conta: tabela financas_contas) e o cadastro fechado.
 *
 * Cada app guarda o login na sua própria chave do navegador: os dois moram no
 * mesmo endereço (gabriel20angelo-web.github.io), e sem isso o login de um
 * aparecia no outro.
 */
const URL = "https://kqpdoyidalucsiqksjtr.supabase.co";
const CHAVE = "sb_publishable_fJOwnHy3XZuARp_Z0nhTRw_16yL_cpK";

export const supabase = createClient(URL, CHAVE, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: `financas-${APP}-login` },
});
