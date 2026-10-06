/**
 * Login simples: a pessoa digita só o nome («docinho», «angelo») e uma senha
 * de números. Por baixo continua sendo e-mail e senha do Supabase:
 * - o nome vira «nome@financas.lar» (domínio que não existe, de propósito:
 *   nenhum e-mail é enviado); e-mail completo passa direto;
 * - o Supabase pede senha de 6+, então a senha curta (um PIN de 4) vai
 *   completada com traços. Quem cria a conta grava a senha já completada.
 */
export const DOMINIO_DAS_CONTAS = "financas.lar";

export function emailDoLogin(digitado: string) {
  const s = digitado.trim().toLowerCase();
  if (!s.includes("@")) return `${s}@${DOMINIO_DAS_CONTAS}`;
  if (s.endsWith("@")) return `${s}${DOMINIO_DAS_CONTAS}`;
  return s;
}

export function senhaDoBanco(digitada: string) {
  return digitada.length < 6 ? digitada.padEnd(6, "-") : digitada;
}

/** Como a conta aparece na tela: só o nome, sem o domínio inventado. */
export function nomeDaConta(email: string | null | undefined) {
  if (!email) return null;
  return email.endsWith(`@${DOMINIO_DAS_CONTAS}`) ? email.slice(0, -DOMINIO_DAS_CONTAS.length - 1) : email;
}
