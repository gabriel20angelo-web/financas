import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import "./globals.css";
import { classesDeFonte } from "./fontes";
import { APP, TEMA, asset } from "@/lib/tema";

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

// As texturas vão como variáveis com o endereço completo, para o
// url() valer igual em qualquer lugar onde o papel for usado.
const papeis: Record<string, string> =
  APP === "livro-caixa"
    ? { "--papel-pagina": papel("creme"), "--papel-cartao": papel("perola"), "--papel-noite": papel("noite"), "--papel-rosa": papel("rosa"), "--papel-jade": papel("jade") }
    : { "--papel-pagina": papel("washi"), "--papel-cartao": papel("cartao"), "--papel-noite": papel("noite") };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-app={APP} className={classesDeFonte} style={papeis as CSSProperties}>
      <body>{children}</body>
    </html>
  );
}
