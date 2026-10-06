import { Fraunces, Barlow, Barlow_Semi_Condensed, Cormorant_Garamond, Jost } from "next/font/google";
import { APP } from "@/lib/tema";

// Inari: as fontes do site da Raposa Analítica.
const fraunces = Fraunces({ subsets: ["latin"], axes: ["SOFT", "WONK"], style: ["normal", "italic"], variable: "--font-fraunces-nf", display: "swap", preload: false });
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-barlow", display: "swap", preload: false });
const barlowCond = Barlow_Semi_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-barlow-cond", display: "swap", preload: false });

// Snowbobão: as fontes do site da Iara Loren (Cormorant Garamond + Jost).
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap", preload: false });
const jost = Jost({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-jost", display: "swap", preload: false });

export const classesDeFonte =
  APP === "snowbobao"
    ? [cormorant, jost].map((f) => f.variable).join(" ")
    : [fraunces, barlow, barlowCond].map((f) => f.variable).join(" ");
