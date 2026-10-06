import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { classesDeFonte } from "./fontes";
import { APP, CHAVE_MODO, TEMA, asset } from "@/lib/tema";

export const metadata: Metadata = {
  title: `${TEMA.nome} · ${TEMA.subtitulo}`,
  description: "Controle financeiro pessoal: lançamentos, fixos, pendências, cartões, caixinhas e metas.",
  manifest: asset(`${APP}/manifest.webmanifest`),
  icons: {
    icon: asset(`${APP}/icone-192.png`),
    apple: asset(`${APP}/apple-touch-icon.png`),
  },
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: TEMA.nome, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: TEMA.corDoNavegador,
  width: "device-width",
  initialScale: 1,
};

const papel = (nome: string) => `url("${asset(`${APP}/papel/${nome}.webp`)}")`;

// As texturas vão como variáveis com o endereço completo, para o url() valer
// igual em qualquer lugar. O modo escuro não usa papel (globals.css: grão).
const papeis: Record<string, string> =
  APP === "snowbobao"
    ? {
        "--papel-pagina-claro": papel("pergaminho"), "--papel-cartao-claro": papel("marfim"),
      }
    : {
        "--papel-pagina-claro": papel("washi"), "--papel-cartao-claro": papel("cartao"),
      };

// Antes de pintar: o modo que a pessoa escolheu, ou o do aparelho.
const modoAntesDePintar = `(function(){var m;try{m=localStorage.getItem(${JSON.stringify(CHAVE_MODO)})}catch(e){}
if(m!=="claro"&&m!=="escuro"){m=window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"escuro":"claro"}
document.documentElement.setAttribute("data-tema",m)})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-app={APP} data-tema="claro" className={classesDeFonte} style={papeis as CSSProperties} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: modoAntesDePintar }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
