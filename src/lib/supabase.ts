import { createClient } from "@supabase/supabase-js";

/**
 * Banco da Raposa (projeto Supabase «Kitsune projeto»). A chave abaixo é a
 * PUBLICÁVEL: pode ficar no código. Quem protege os dados é a regra da
 * tabela financas_kv (cada pessoa só lê e grava as próprias linhas) e o
 * cadastro fechado (só entra quem já tem conta).
 */
const URL = "https://kqpdoyidalucsiqksjtr.supabase.co";
const CHAVE = "sb_publishable_fJOwnHy3XZuARp_Z0nhTRw_16yL_cpK";

export const supabase = createClient(URL, CHAVE, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});
