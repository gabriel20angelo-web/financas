"use client";

import { ChevronLeft, ChevronRight, Cloud, CloudOff, Download, LogOut, RefreshCw, Upload } from "lucide-react";
import Figura from "@/components/Figura";
import { useConta } from "@/components/Moldura";
import { APP, TEMA, asset, type Humor } from "@/lib/tema";
import { MESES } from "@/lib/financas-data";

/**
 * A faixa do alto: o nome do app, o mês e o bicho que conta como está o mês
 * (dormindo sem lançamento, contente no azul, apertado no vermelho).
 * Inari: noite da mata com estrelas e fogo-de-raposa, morro na passagem.
 * Livro-caixa: veludo com estrelas, lacre e a borda de correio aéreo.
 */
export default function Cabecalho({ mY, mM, onMes, humor, onBackup, onImportar }: {
  mY: number;
  mM: number;
  onMes: (delta: number) => void;
  humor: Humor;
  onBackup: () => void;
  onImportar: () => void;
}) {
  const { email, sincronizando, abrirEntrar, sair } = useConta();
  const gatos = APP === "livro-caixa";
  const fig = TEMA.humor[humor];

  const botaoFaixa = "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-dm text-[12px] font-semibold transition-colors";
  const estiloBotaoFaixa = { background: "rgb(255 255 255 / .08)", border: "1px solid rgb(255 255 255 / .16)", color: "inherit" };

  return (
    <header className={`faixa ceu -mx-3 sm:mx-0 sm:rounded-b-[28px] overflow-hidden mb-7 ${gatos ? "" : "pb-6"}`}>
      {!gatos && (
        <>
          <span className="kitsunebi" style={{ left: "58%", top: "26%" }} />
          <span className="kitsunebi" style={{ left: "66%", top: "58%", animationDelay: "-1.2s", transform: "scale(.8)" }} />
          <span className="kitsunebi" style={{ left: "49%", top: "70%", animationDelay: "-2.4s" }} />
        </>
      )}
      {gatos && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={asset("livro-caixa/enfeite/estrela-dourada-8-longa.webp")} alt="" aria-hidden
          className="absolute pointer-events-none opacity-90 hidden sm:block" style={{ left: "52%", top: 18, height: 34 }} />
      )}

      <div className="relative z-[1] flex items-start justify-between gap-3 px-5 sm:px-8 pt-5">
        <div className="flex flex-wrap gap-1.5">
          {email ? (
            <button onClick={sair} className={botaoFaixa} style={estiloBotaoFaixa} title={`Conta: ${email}. Clique para sair.`}>
              {sincronizando ? <RefreshCw size={13} className="animate-spin" /> : <Cloud size={13} />}
              <span className="hidden sm:inline">{sincronizando ? "Sincronizando" : "Na nuvem"}</span>
              <LogOut size={12} className="opacity-60" />
            </button>
          ) : (
            <button onClick={abrirEntrar} className={botaoFaixa} style={estiloBotaoFaixa} title="Entrar para guardar na nuvem">
              <CloudOff size={13} /> {TEMA.textos.soNesteAparelho} · <u>entrar</u>
            </button>
          )}
        </div>
        <div className="flex gap-1.5">
          <button onClick={onBackup} className={botaoFaixa} style={estiloBotaoFaixa} title="Baixar uma cópia de tudo">
            <Download size={13} /> <span className="hidden sm:inline">Backup</span>
          </button>
          <button onClick={onImportar} className={botaoFaixa} style={estiloBotaoFaixa} title="Trazer de um arquivo de backup">
            <Upload size={13} /> <span className="hidden sm:inline">Importar</span>
          </button>
        </div>
      </div>

      <div className="relative z-[1] flex items-end justify-between gap-2 px-5 sm:px-8 pt-3">
        <div className="pb-4 min-w-0">
          <p className={gatos ? "font-dm uppercase text-[11px] tracking-[.18em]" : "font-mono uppercase text-[12px] tracking-[.22em]"}
            style={{ color: gatos ? "var(--rosa)" : "var(--ouro)" }}>
            {gatos ? "Clube de Literatura Entrelinhas" : TEMA.subtitulo}
          </p>
          <h1 className="font-fraunces leading-[.95] mt-1"
            style={{
              fontSize: "clamp(44px, 11vw, 72px)",
              color: gatos ? "var(--rosa)" : "#F2EBDC",
              fontVariationSettings: gatos ? undefined : '"SOFT" 100, "WONK" 1',
              textShadow: gatos ? "2px 2px 0 #624956" : undefined,
            }}>
            {TEMA.titulo[0]}<em style={{ color: "var(--ouro)", fontStyle: "italic" }}>{TEMA.titulo[1]}</em>
          </h1>

          <div className={`mt-4 inline-flex items-center gap-1 ${gatos ? "etiqueta" : ""}`}
            style={gatos ? {
              background: "var(--papel-cartao) #FAF5EE", color: "#30323C", padding: "4px 6px",
              transform: "rotate(-1.2deg)", boxShadow: "0 2px 0 rgb(0 0 0 / .25)",
            } : undefined}>
            <button onClick={() => onMes(-1)} aria-label="Mês anterior"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ border: gatos ? "1px solid rgba(98,73,86,.3)" : "1px solid rgb(255 255 255 / .2)" }}>
              <ChevronLeft size={16} />
            </button>
            <span className={`${gatos ? "font-mono text-[17px]" : "font-fraunces text-[19px] italic"} min-w-[150px] text-center whitespace-nowrap`}>
              {MESES[mM]} {mY}
            </span>
            <button onClick={() => onMes(1)} aria-label="Próximo mês"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ border: gatos ? "1px solid rgba(98,73,86,.3)" : "1px solid rgb(255 255 255 / .2)" }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="relative shrink-0 self-end" key={humor}>
          <Figura fig={fig} altura={gatos ? 150 : 170}
            className="relative block translate-y-1 pointer-events-none select-none max-w-[38vw] object-contain object-bottom"
            style={{ filter: "drop-shadow(0 6px 10px rgb(0 0 0 / .35))" }} />
        </div>
      </div>

      {gatos ? <div className="correio relative z-[2]" /> : <div className="morro z-[2]" />}
    </header>
  );
}
