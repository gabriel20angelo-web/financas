"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { CHAVE_MODO } from "@/lib/tema";
import { fofo } from "@/components/Fofos";

type Modo = "claro" | "escuro";

const escolhido = (): Modo | null => {
  try {
    const m = localStorage.getItem(CHAVE_MODO);
    return m === "claro" || m === "escuro" ? m : null;
  } catch {
    return null;
  }
};

/**
 * O botão de modo claro/escuro da faixa. O modo já chega aplicado antes de
 * pintar (script no layout); aqui só troca, guarda a escolha e, enquanto a
 * pessoa não escolheu, acompanha o modo do aparelho.
 */
export default function ModoTema({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const [modo, setModo] = useState<Modo>("claro");

  useEffect(() => {
    setModo(document.documentElement.getAttribute("data-tema") === "escuro" ? "escuro" : "claro");
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const doAparelho = () => {
      if (escolhido()) return;
      const m: Modo = mq.matches ? "escuro" : "claro";
      document.documentElement.setAttribute("data-tema", m);
      setModo(m);
    };
    mq.addEventListener("change", doAparelho);
    return () => mq.removeEventListener("change", doAparelho);
  }, []);

  function trocar() {
    const m: Modo = modo === "escuro" ? "claro" : "escuro";
    document.documentElement.setAttribute("data-tema", m);
    try { localStorage.setItem(CHAVE_MODO, m); } catch {}
    setModo(m);
  }

  const escuro = modo === "escuro";
  return (
    <button onClick={trocar} className={className} style={style}
      aria-label={escuro ? "Passar para o modo claro" : "Passar para o modo escuro"}
      title={escuro ? "Modo claro" : "Modo escuro"}>
      {escuro ? (fofo("sol", 16) ?? <Sun size={13} />) : (fofo("lua", 16) ?? <Moon size={13} />)}
      <span className="hidden sm:inline">{escuro ? "Claro" : "Escuro"}</span>
    </button>
  );
}
