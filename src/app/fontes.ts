import {
  Fraunces, Barlow, Barlow_Semi_Condensed,
  DM_Serif_Display, Cormorant_Garamond, Special_Elite, Cinzel, Caveat,
} from "next/font/google";
import { APP } from "@/lib/tema";

// Inari: as fontes do site da Raposa Analítica.
const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK"], style: ["normal", "italic"], variable: "--font-fraunces-nf", display: "swap", preload: false });
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow", display: "swap", preload: false });
const barlowCond = Barlow_Semi_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-barlow-cond", display: "swap", preload: false });

// Livro-caixa: as fontes das cartinhas do Clube Entrelinhas.
const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-dmserif", display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap", preload: false });
const elite = Special_Elite({ subsets: ["latin"], weight: "400", variable: "--font-elite", display: "swap", preload: false });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-cinzel", display: "swap", preload: false });
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-caveat", display: "swap", preload: false });

export const classesDeFonte =
  APP === "livro-caixa"
    ? [dmSerif, cormorant, elite, cinzel, caveat].map((f) => f.variable).join(" ")
    : [fraunces, barlow, barlowCond].map((f) => f.variable).join(" ");
