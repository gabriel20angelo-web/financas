import { APP, type AbaId } from "@/lib/tema";

/**
 * Os ícones fofos do Snowbobão, desenhados à mão em SVG: traço arredondado na
 * cor do texto (currentColor) e um toque de cor de destaque (--fofo-acento, o
 * ouro da vela) e de rosa (o focinho do gato). Só o Snowbobão usa; no Inari,
 * fofo() devolve null e fica o ícone de sempre.
 */

export type NomeFofo =
  | "pena" | "gatoCalendario" | "xicara" | "lupa" | "caixinha" | "cartao" | "livros"
  | "gatoPizza" | "vela" | "novelo" | "peixinho" | "pata" | "lua" | "sol";

const ACENTO = "var(--fofo-acento)";
const ROSA = "#E99AA6";

/** coração do tamanho de um ícone (24), encolhido em volta do centro (x, y) */
function Coracao({ x, y, k, cor = ACENTO }: { x: number; y: number; k: number; cor?: string }) {
  return (
    <path transform={`translate(${x} ${y}) scale(${k}) translate(-12 -14.5)`} fill={cor} stroke="none"
      d="M12 21s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 9a3.8 3.8 0 0 1 7 2.5C19 16.6 12 21 12 21z" />
  );
}

const DESENHOS: Record<NomeFofo, React.ReactNode> = {
  // Lançamentos: a pena e o pingo de tinta
  pena: (
    <>
      <path d="M19.5 3.5C12.5 4 7.8 8.8 6.8 16.6c6.3-.7 11.4-5.3 12.7-13.1z" fill={ACENTO} fillOpacity=".22" />
      <path d="M6.8 16.6 4.2 20" />
      <path d="M9.8 13.6l5-5.2" />
      <circle cx="3.6" cy="20.7" r="1.1" fill={ACENTO} stroke="none" />
    </>
  ),
  // Calendário: a folhinha com orelhas e carinha de gato
  gatoCalendario: (
    <>
      <path d="M6.3 7.4 7.3 3.8l2.8 3.3" />
      <path d="M17.7 7.4l-1-3.6-2.8 3.3" />
      <rect x="4" y="7" width="16" height="13.4" rx="3" />
      <path d="M4 10.8h16" />
      <circle cx="9.4" cy="14.4" r=".95" fill="currentColor" stroke="none" />
      <circle cx="14.6" cy="14.4" r=".95" fill="currentColor" stroke="none" />
      <path d="M11.3 15.6h1.4l-.7.7z" fill={ROSA} stroke={ROSA} strokeWidth=".8" />
      <path d="M10.9 17.1c.6.5 1.6.5 2.2 0" />
    </>
  ),
  // Fixos: o café de todo dia, com coração no vapor
  xicara: (
    <>
      <path d="M5 10.5h11v3.8a5.2 5.2 0 0 1-5.2 5.2h-.6A5.2 5.2 0 0 1 5 14.3z" fill={ACENTO} fillOpacity=".18" />
      <path d="M16 11.8h1.3a2.4 2.4 0 0 1 0 4.8h-1.7" />
      <path d="M3.8 21.3h13.4" />
      <Coracao x={10.5} y={6.4} k={0.34} />
    </>
  ),
  // Pendências: a lupa da revisora, com um olho de gato dentro
  lupa: (
    <>
      <circle cx="10.2" cy="10.2" r="6.2" />
      <path d="M14.7 14.7 20.2 20.2" strokeWidth="2.2" />
      <path d="M7 10.2c1.8-2.1 4.6-2.1 6.4 0-1.8 2.1-4.6 2.1-6.4 0z" fill={ACENTO} fillOpacity=".35" />
      <path d="M10.2 8.9v2.6" />
    </>
  ),
  // Metas & caixinhas: a caixa com as orelhas do gato aparecendo
  caixinha: (
    <>
      <path d="M8.4 11 9.3 7.2l2.5 3.2" />
      <path d="M15.6 11l-.9-3.8-2.5 3.2" />
      <path d="M4 11h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill={ACENTO} fillOpacity=".18" />
      <path d="M4 11 2.4 8.2M20 11l1.6-2.8" />
      <Coracao x={12} y={16.2} k={0.3} />
    </>
  ),
  // Cartões: o cartão com uma patinha carimbada
  cartao: (
    <>
      <rect x="2.8" y="5.8" width="18.4" height="12.8" rx="2.4" />
      <path d="M2.8 9.6h18.4" />
      <path d="M6 14.6h4" />
      <ellipse cx="16.4" cy="15.1" rx="1.6" ry="1.3" fill={ACENTO} stroke="none" />
      <circle cx="14.7" cy="13.1" r=".65" fill={ACENTO} stroke="none" />
      <circle cx="16.4" cy="12.5" r=".65" fill={ACENTO} stroke="none" />
      <circle cx="18.1" cy="13.1" r=".65" fill={ACENTO} stroke="none" />
    </>
  ),
  // Categorias: os livros com as orelhas do gato por cima
  livros: (
    <>
      <path d="M9.3 9l.8-2.9 2 2.9" />
      <path d="M14.7 9l-.8-2.9-2 2.9" />
      <rect x="5.5" y="9" width="13" height="5.5" rx="1.3" fill={ACENTO} fillOpacity=".22" />
      <rect x="4" y="14.5" width="16" height="5.6" rx="1.3" />
      <path d="M8.6 9v5.5M7.2 14.5v5.6" />
    </>
  ),
  // Gráficos: a pizza com orelhas de gato e a fatia de ouro
  gatoPizza: (
    <>
      <path d="M6.5 8.5 6.1 4.4l3.4 2" />
      <path d="M17.5 8.5l.4-4.1-3.4 2" />
      <path d="M12 13V5.8A7.2 7.2 0 0 1 18.4 16.3z" fill={ACENTO} fillOpacity=".5" stroke="none" />
      <circle cx="12" cy="13" r="7.2" />
      <path d="M12 13V5.8M12 13l6.4 3.3" />
    </>
  ),
  // Projeção: a vela acesa que mostra o caminho
  vela: (
    <>
      <path d="M12 3c1.9 2.1 2.3 3.6 0 5.8-2.3-2.2-1.9-3.7 0-5.8z" fill={ACENTO} stroke={ACENTO} strokeWidth="1" />
      <path d="M12 8.8v1.6" />
      <rect x="9" y="10.4" width="6" height="9.4" rx="1.2" />
      <path d="M10.8 10.4v2.4" />
      <path d="M6 20.4h12" />
    </>
  ),
  // Novo gasto: o novelo que vai se desenrolando
  novelo: (
    <>
      <circle cx="11" cy="12" r="6.8" fill={ACENTO} fillOpacity=".2" />
      <path d="M5.4 8.4c3.6.4 7.6 3.4 9.6 8.6" />
      <path d="M4.6 12.6c3.3.6 6 2.8 7.4 6.1" />
      <path d="M8 5.8c3.6 1.2 6.8 4.2 8.6 8.6" />
      <path d="M17.6 14.4c1.8.4 3.2 1.8 2.8 3.8-.3 1.4-1.7 2.2-3 1.8" />
    </>
  ),
  // Nova entrada: o peixinho que chegou
  peixinho: (
    <>
      <path d="M3.5 12c2.6-3.6 6.8-4.7 10.4-2.6L17.5 7v10l-3.6-2.4C10.3 16.7 6.1 15.6 3.5 12z" fill={ACENTO} fillOpacity=".3" />
      <circle cx="8" cy="11.3" r=".95" fill="currentColor" stroke="none" />
      <path d="M11.2 9.8c.9 1.4.9 3 0 4.4" />
      <circle cx="20.3" cy="6.3" r="1" />
      <circle cx="19.6" cy="2.9" r=".6" />
    </>
  ),
  pata: (
    <>
      <path d="M12 20.2c-2.6 0-4.4-1.5-4.4-3.4 0-2 2-3.9 4.4-3.9s4.4 1.9 4.4 3.9c0 1.9-1.8 3.4-4.4 3.4z" fill="currentColor" stroke="none" />
      <ellipse cx="6.4" cy="11.6" rx="1.6" ry="2" fill="currentColor" stroke="none" />
      <ellipse cx="9.6" cy="8.2" rx="1.6" ry="2.1" fill="currentColor" stroke="none" />
      <ellipse cx="14.4" cy="8.2" rx="1.6" ry="2.1" fill="currentColor" stroke="none" />
      <ellipse cx="17.6" cy="11.6" rx="1.6" ry="2" fill="currentColor" stroke="none" />
    </>
  ),
  // Modo escuro: a lua dorminhoca
  lua: (
    <>
      <path d="M19 14.6A7.6 7.6 0 0 1 9.4 5a7.6 7.6 0 1 0 9.6 9.6z" fill={ACENTO} fillOpacity=".25" />
      <path d="M9.4 13.4c.8.8 2 .8 2.8 0" />
      <circle cx="9" cy="15.6" r=".85" fill={ROSA} stroke="none" />
      <path d="M18 3.4l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill={ACENTO} stroke="none" />
    </>
  ),
  // Modo claro: o sol sorrindo
  sol: (
    <>
      <circle cx="12" cy="12" r="4.4" fill={ACENTO} fillOpacity=".3" />
      <path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4" />
      <circle cx="10.5" cy="11.2" r=".6" fill="currentColor" stroke="none" />
      <circle cx="13.5" cy="11.2" r=".6" fill="currentColor" stroke="none" />
      <path d="M10.7 13c.7.7 1.9.7 2.6 0" />
    </>
  ),
};

export function Fofo({ nome, tamanho = 18, className = "", style }: {
  nome: NomeFofo;
  tamanho?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg viewBox="0 0 24 24" width={tamanho} height={tamanho} fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" className={`fofo ${className}`} style={style} aria-hidden="true">
      {DESENHOS[nome]}
    </svg>
  );
}

export const FOFOS = APP === "snowbobao";

/** O ícone fofo, ou null fora do Snowbobão (aí o código usa o ícone de sempre). */
export function fofo(nome: NomeFofo, tamanho?: number, className?: string) {
  return FOFOS ? <Fofo nome={nome} tamanho={tamanho} className={className} /> : null;
}

export const FOFO_DA_ABA: Record<AbaId, NomeFofo> = {
  lancamentos: "pena",
  calendario: "gatoCalendario",
  fixos: "xicara",
  pendencias: "lupa",
  metas: "caixinha",
  cartoes: "cartao",
  categorias: "livros",
  graficos: "gatoPizza",
  projecao: "vela",
};
