/**
 * Os dois apps saem do mesmo código. O que muda entre eles mora aqui:
 * nome, figuras, paletas de escolha e textos. As cores de papel (fundo,
 * texto, positivo, negativo…) ficam no globals.css, por [data-app].
 *
 * Inari: a raposa. Inari é o kami do arroz e da prosperidade; as raposas são
 * as mensageiras dele e, nos santuários, seguram a chave do celeiro.
 * Livro-caixa: os gatos do Clube Entrelinhas. Livro, porque é um clube de
 * literatura; caixa, porque é onde o gato senta.
 */

export type AppId = "inari" | "livro-caixa";

export const APP: AppId = process.env.NEXT_PUBLIC_APP === "livro-caixa" ? "livro-caixa" : "inari";
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Caminho de um arquivo de public/, já com o basePath. */
export function asset(caminho: string) {
  return `${BASE}/${caminho.replace(/^\//, "")}`;
}

export type AbaId =
  | "lancamentos" | "calendario" | "fixos" | "pendencias" | "metas"
  | "cartoes" | "categorias" | "graficos" | "projecao";

export interface Figura {
  src: string;
  alt: string;
  /** altura em px quando aparece espiando por cima das abas */
  h?: number;
}

export type Humor = "vazio" | "bem" | "otimo" | "aperto";

interface Tema {
  nome: string;
  /** o nome em duas partes: a segunda vai em itálico no acento */
  titulo: [string, string];
  subtitulo: string;
  corDoNavegador: string;
  figurasDaAba: Record<AbaId, Figura>;
  humor: Record<Humor, Figura>;
  carregando: Figura;
  entrar: Figura;
  vazio: Figura;
  rodape: Figura;
  categoriasIniciais: { n: string; c: string }[];
  coresCartao: string[];
  coresCaixinha: string[];
  corCategoriaNova: string;
  corAjuste: string;
  textos: {
    carregando: string;
    vazioLancamentos: string;
    entrarTitulo: string;
    entrarSub: string;
    soNesteAparelho: string;
  };
}

const f = (src: string, alt: string, h?: number): Figura => ({ src, alt, h });

const INARI: Tema = {
  nome: "Inari",
  titulo: ["Ina", "ri"],
  subtitulo: "as contas da raposa",
  corDoNavegador: "#13211F",
  figurasDaAba: {
    lancamentos: f("inari/fig/raposa-anotando.webp", "Raposa de óculos anotando num caderno", 96),
    calendario: f("inari/fig/raposa-olhando-lua.webp", "Raposa de costas olhando a lua", 92),
    fixos: f("inari/obj/tunel-de-torii.webp", "Túnel de torii, um portal atrás do outro", 74),
    pendencias: f("inari/obj/ema.webp", "Plaquinha ema de madeira, de pendurar pedido", 70),
    metas: f("inari/fig/raposa-daruma.webp", "Raposa ao lado de um daruma, o boneco das metas", 88),
    cartoes: f("inari/fig/raposa-noren.webp", "Raposa espiando por baixo da cortina de loja", 90),
    categorias: f("inari/kamon/raposa.webp", "Brasão de família com uma raposa", 70),
    graficos: f("inari/obj/montanha.webp", "O monte Fuji", 62),
    projecao: f("inari/fig/raposa-lanterna.webp", "Raposa segurando uma lanterna acesa", 96),
  },
  humor: {
    vazio: f("inari/fig/raposa-dormindo-lua.webp", "Raposa dormindo encolhida na lua"),
    bem: f("inari/fig/raposa-inari.webp", "Raposa de Inari no pedestal, com o pergaminho na boca"),
    otimo: f("inari/fig/raposa-inari.webp", "Raposa de Inari no pedestal, com o pergaminho na boca"),
    aperto: f("inari/fig/raposa-wagasa.webp", "Raposa debaixo do guarda-chuva, na chuva"),
  },
  carregando: f("inari/fig/raposa-trotando.webp", "Raposa trotando"),
  entrar: f("inari/fig/perfil-kitsune-oculos.webp", "Kitsune de óculos, cachimbo e gravata-borboleta"),
  vazio: f("inari/fig/raposa-tigela.webp", "Raposa dentro de uma tigela vazia"),
  rodape: f("inari/fig/raposa-dormindo.webp", "Raposa dormindo enrolada na própria cauda"),
  categoriasIniciais: [
    { n: "Alimentação", c: "#DE7A3C" },
    { n: "Transporte", c: "#2E4C7A" },
    { n: "Moradia", c: "#6B4A35" },
    { n: "Saúde", c: "#CF432F" },
    { n: "Lazer", c: "#D7A441" },
    { n: "Educação", c: "#9B89C2" },
    { n: "Salário", c: "#5C7D4E" },
    { n: "Freelance", c: "#6DB5AE" },
    { n: "Outros", c: "#8A968F" },
  ],
  coresCartao: ["#1E3A2F", "#2E4C7A", "#962B24", "#7A4A2E", "#9C3D5C", "#13211F", "#2E5240", "#5C7D4E", "#1B2B33", "#CF432F"],
  coresCaixinha: ["#CF432F", "#5C7D4E", "#2E4C7A", "#D7A441", "#9B89C2", "#DE7A3C", "#9C3D5C", "#6DB5AE", "#7A4A2E", "#8DAA68"],
  corCategoriaNova: "#CF432F",
  corAjuste: "#8A968F",
  textos: {
    carregando: "Buscando as contas na mata…",
    vazioLancamentos: "Nada lançado neste mês. A tigela está vazia: use os botões acima para anotar um gasto ou uma entrada.",
    entrarTitulo: "Entrar",
    entrarSub: "Com a conta entrada, as contas aparecem iguais no celular e no computador.",
    soNesteAparelho: "Só neste aparelho",
  },
};

const LIVRO_CAIXA: Tema = {
  nome: "Livro-caixa",
  titulo: ["Livro-", "caixa"],
  subtitulo: "as contas do gato · Entrelinhas",
  corDoNavegador: "#30323C",
  figurasDaAba: {
    lancamentos: f("livro-caixa/gato/escrevendo.webp", "O gato escrevendo com pena e tinteiro", 100),
    calendario: f("livro-caixa/gato/olhando-as-estrelas.webp", "O gato olhando a lua e as estrelas", 104),
    fixos: f("livro-caixa/gato/brincando-com-novelo.webp", "O gato brincando com o novelo", 96),
    pendencias: f("livro-caixa/gato/detetive-de-lupa.webp", "O gato de detetive, com a lupa no olho", 100),
    metas: f("livro-caixa/gato/na-caixa.webp", "O gato dentro de uma caixa de papelão", 82),
    cartoes: f("livro-caixa/gato/tirando-cartas.webp", "O gato tirando cartas", 100),
    categorias: f("livro-caixa/gato/no-alto-da-pilha.webp", "O gato no alto de uma pilha de livros", 112),
    graficos: f("livro-caixa/gato/de-oculos.webp", "O gato de óculos dourados ao lado dos livros", 98),
    projecao: f("livro-caixa/gato/bola-de-cristal.webp", "O gato com a bola de cristal", 100),
  },
  humor: {
    vazio: f("livro-caixa/gato/sonolento.webp", "O gato bocejando de sono"),
    bem: f("livro-caixa/gato/feliz.webp", "O gato feliz"),
    otimo: f("livro-caixa/gato/em-pe-comemorando.webp", "O gato em pé, comemorando"),
    aperto: f("livro-caixa/gato/assustado.webp", "O gato assustado, de pelo arrepiado"),
  },
  carregando: f("livro-caixa/gato/de-lado-andando.webp", "O gato andando"),
  entrar: f("livro-caixa/gato/espiando-atras-do-livro.webp", "O gato espiando atrás de um livro"),
  vazio: f("livro-caixa/gato/bolinha-dormindo.webp", "O gato dormindo enrolado"),
  rodape: f("livro-caixa/gato/espiando-de-baixo.webp", "O gato espiando por cima de uma linha"),
  categoriasIniciais: [
    { n: "Alimentação", c: "#C27A4E" },
    { n: "Transporte", c: "#4F6A8A" },
    { n: "Moradia", c: "#624956" },
    { n: "Saúde", c: "#A33A4A" },
    { n: "Lazer", c: "#D9B36A" },
    { n: "Educação", c: "#7D5C8C" },
    { n: "Salário", c: "#5F857C" },
    { n: "Freelance", c: "#C799AA" },
    { n: "Outros", c: "#8A7F86" },
  ],
  coresCartao: ["#30323C", "#624956", "#6E1F2E", "#3D6B5F", "#4F6A8A", "#7D5C8C", "#8A5A3C", "#26304E", "#A33A4A", "#5F857C"],
  coresCaixinha: ["#5F857C", "#C799AA", "#D9B36A", "#624956", "#6E1F2E", "#4F6A8A", "#7D5C8C", "#C27A4E", "#30323C", "#A9C2B6"],
  corCategoriaNova: "#C799AA",
  corAjuste: "#8A7F86",
  textos: {
    carregando: "O gato está abrindo o livro…",
    vazioLancamentos: "Nenhuma linha escrita neste mês. O gato dormiu em cima do livro: use os botões acima para anotar um gasto ou uma entrada.",
    entrarTitulo: "Entrar",
    entrarSub: "Com a conta entrada, o livro fica igual no celular e no computador.",
    soNesteAparelho: "Só neste aparelho",
  },
};

export const TEMA: Tema = APP === "livro-caixa" ? LIVRO_CAIXA : INARI;

/** Qual figura conta o mês: sem lançamento, no vermelho, bem, ou sobrando. */
export function humorDoMes(entradas: number, gastos: number, qtd: number): Humor {
  if (qtd === 0) return "vazio";
  const saldo = entradas - gastos;
  if (saldo < 0) return "aperto";
  if (entradas > 0 && saldo >= entradas * 0.2) return "otimo";
  return "bem";
}
