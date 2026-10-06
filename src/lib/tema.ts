/**
 * Os dois apps saem do mesmo código. O que muda entre eles mora aqui:
 * nome, figuras, paletas de escolha e textos. As cores de papel (fundo,
 * texto, positivo, negativo…) ficam no globals.css, por [data-app].
 *
 * Inari: a raposa. Inari é o kami do arroz e da prosperidade; as raposas são
 * as mensageiras dele e, nos santuários, seguram a chave do celeiro.
 * Snowbobão: as contas da Iara Loren, com a identidade do site dela (vela,
 * vinho, cobre, papel antigo), o frajola de pelúcia de traços e os ícones
 * fofos desenhados à mão (components/Fofos.tsx).
 *
 * Os dois têm modo claro e escuro (data-tema no <html>; ver ModoTema.tsx).
 */

export type AppId = "inari" | "snowbobao";

export const APP: AppId = process.env.NEXT_PUBLIC_APP === "snowbobao" ? "snowbobao" : "inari";
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Onde fica guardado o modo escolhido (claro | escuro); sem escolha, vale o do aparelho. */
export const CHAVE_MODO = `modo-${APP}`;

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
  /** a linha pequena acima do nome, na faixa */
  marca: string;
  corDoNavegador: string;
  /** recado embaixo do «Entrar» (o Inari usa a conta do painel da Raposa) */
  notaDaConta?: string;
  /** oferece trazer os dados do antigo Finanças do Meu Consultório */
  trazAntigos: boolean;
  /** o que o bicho da faixa diz, conforme o mês (balãozinho) */
  falas?: Record<Humor, string>;
  /** a linha de assinatura do rodapé */
  assinatura?: string;
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
  marca: "as contas da raposa",
  corDoNavegador: "#13211F",
  trazAntigos: true,
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

const SNOWBOBAO: Tema = {
  nome: "Snowbobão",
  titulo: ["Snow", "bobão"],
  subtitulo: "as contas da Iara",
  marca: "Iara Loren",
  corDoNavegador: "#15100E",
  trazAntigos: false,
  falas: {
    vazio: "zzz… nada anotado ainda",
    bem: "tudo nos conformes, miau",
    otimo: "sobrou! hora do sachê",
    aperto: "eita… saiu mais do que entrou",
  },
  assinatura: "com carinho, o Snowbobão",
  figurasDaAba: {
    lancamentos: f("snowbobao/gato/escrevendo.webp", "O Snowbobão escrevendo com pena e tinteiro", 98),
    calendario: f("snowbobao/gato/olhando-as-estrelas.webp", "O Snowbobão olhando a lua e as estrelas", 104),
    fixos: f("snowbobao/gato/xicara-de-cafe.webp", "O Snowbobão com a xícara de café de todo dia", 100),
    pendencias: f("snowbobao/gato/detetive-de-lupa.webp", "O Snowbobão revisando com a lupa no olho", 102),
    metas: f("snowbobao/gato/na-caixa.webp", "O Snowbobão dentro de uma caixa de papelão", 84),
    cartoes: f("snowbobao/gato/de-oculos.webp", "O Snowbobão de óculos dourados ao lado dos livros", 92),
    categorias: f("snowbobao/gato/no-alto-da-pilha.webp", "O Snowbobão no alto de uma pilha de livros", 114),
    graficos: f("snowbobao/gato/lendo.webp", "O Snowbobão lendo um livro vinho", 100),
    projecao: f("snowbobao/gato/com-a-lanterna.webp", "O Snowbobão com a lanterna acesa", 104),
  },
  humor: {
    vazio: f("snowbobao/gato/sonolento.webp", "O Snowbobão bocejando de sono"),
    bem: f("snowbobao/gato/feliz.webp", "O Snowbobão feliz"),
    otimo: f("snowbobao/gato/barriga-pra-cima.webp", "O Snowbobão de barriga pra cima, todo bobo de alegria"),
    aperto: f("snowbobao/gato/assustado.webp", "O Snowbobão assustado, de pelo arrepiado"),
  },
  carregando: f("snowbobao/gato/de-lado-andando.webp", "O Snowbobão andando"),
  entrar: f("snowbobao/gato/espiando-atras-do-livro.webp", "O Snowbobão espiando atrás de um livro"),
  vazio: f("snowbobao/gato/bolinha-dormindo.webp", "O Snowbobão dormindo enrolado"),
  rodape: f("snowbobao/gato/espiando-de-baixo.webp", "O Snowbobão espiando por cima de uma linha"),
  categoriasIniciais: [
    { n: "Alimentação", c: "#C27840" },
    { n: "Transporte", c: "#4F6E8C" },
    { n: "Moradia", c: "#8A5A44" },
    { n: "Saúde", c: "#B0454F" },
    { n: "Lazer", c: "#C9963F" },
    { n: "Livros e estudo", c: "#7A5A8C" },
    { n: "Salário", c: "#5F7F4E" },
    { n: "Aulas particulares", c: "#3E7A72" },
    { n: "Revisão de textos", c: "#9C6A3A" },
    { n: "Outros", c: "#8C7C70" },
  ],
  coresCartao: ["#6E212B", "#2B1E19", "#3E5A4A", "#2F3B4F", "#7A4718", "#4A2F3D", "#1C1715", "#8A2F3B", "#5C4A3A", "#3B4A5E"],
  coresCaixinha: ["#B0454F", "#C9853F", "#5F7F4E", "#4F6E8C", "#8C6A9E", "#B9783F", "#3E7A72", "#A8323E", "#8C7C70", "#C9963F"],
  corCategoriaNova: "#B0454F",
  corAjuste: "#8C7C70",
  textos: {
    carregando: "O Snowbobão está procurando os óculos…",
    vazioLancamentos: "Nenhuma linha escrita neste mês. O Snowbobão dormiu em cima do caderno: use os botões acima para anotar um gasto ou uma entrada.",
    entrarTitulo: "Entrar",
    entrarSub: "Com a conta entrada, as contas ficam iguais no celular e no computador.",
    soNesteAparelho: "Só neste aparelho",
  },
};

export const TEMA: Tema = APP === "snowbobao" ? SNOWBOBAO : INARI;

/** Qual figura conta o mês: sem lançamento, no vermelho, bem, ou sobrando. */
export function humorDoMes(entradas: number, gastos: number, qtd: number): Humor {
  if (qtd === 0) return "vazio";
  const saldo = entradas - gastos;
  if (saldo < 0) return "aperto";
  if (entradas > 0 && saldo >= entradas * 0.2) return "otimo";
  return "bem";
}

/**
 * Cor escolhida pela pessoa (categoria, caixinha, cartão) usada como TEXTO:
 * puxada para a cor do texto do tema (um pouco no claro, mais no escuro, ver
 * --mistura-cor), para ler no papel claro e no escuro.
 */
export function tinta(cor: string) {
  return `color-mix(in oklab, ${cor} var(--mistura-cor), var(--text-primary))`;
}
