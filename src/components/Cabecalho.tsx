"use client";

import { ChevronLeft, ChevronRight, Cloud, CloudOff, Download, LogOut, RefreshCw, Upload } from "lucide-react";
import Figura from "@/components/Figura";
import Losango from "@/components/Losango";
import ModoTema from "@/components/ModoTema";
import { Fofo } from "@/components/Fofos";
import { useConta } from "@/components/Moldura";
import { APP, TEMA, type Humor } from "@/lib/tema";
import { MESES } from "@/lib/financas-data";

/**
 * A faixa do alto: o nome do app, o mês e o bicho que conta como está o mês
 * (dormindo sem lançamento, contente no azul, apertado no vermelho).
 * Inari: noite da mata com estrelas e fogo-de-raposa, morro na passagem.
 * Snowbobão: a mesa da Iara à noite, com velas no pires de latão, poeira de
 * ouro, o losango do site dela e o fio de ouro na base.
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
  const snow = APP === "snowbobao";
  const fig = TEMA.humor[humor];

  const botaoFaixa = `inline-flex items-center gap-1.5 px-2.5 py-1.5 font-dm text-[12px] transition-colors ${snow ? "rounded-sm font-medium" : "rounded-lg font-semibold"}`;
  const estiloBotaoFaixa = snow
    ? { background: "rgb(255 255 255 / .04)", border: "1px solid rgb(224 168 103 / .24)", color: "inherit" }
    : { background: "rgb(255 255 255 / .08)", border: "1px solid rgb(255 255 255 / .16)", color: "inherit" };
  const bordaSeta = snow ? "1px solid rgb(224 168 103 / .35)" : "1px solid rgb(255 255 255 / .2)";

  return (
    <header className={`faixa ceu -mx-3 sm:mx-0 sm:rounded-b-[28px] overflow-hidden mb-7 ${snow ? "" : "pb-6"}`}>
      {!snow && (
        <>
          <span className="kitsunebi" style={{ left: "58%", top: "26%" }} />
          <span className="kitsunebi" style={{ left: "66%", top: "58%", animationDelay: "-1.2s", transform: "scale(.8)" }} />
          <span className="kitsunebi" style={{ left: "49%", top: "70%", animationDelay: "-2.4s" }} />
        </>
      )}
      {snow && (
        <>
          <Losango className="cintila" style={{ left: "61%", top: 84, width: 15, height: 15 }} />
          <Losango className="cintila hidden sm:block" style={{ left: "44%", top: 26, width: 20, height: 20, animationDelay: "-2.2s" }} />
          <Losango className="cintila hidden sm:block" style={{ left: "36%", top: 118, width: 10, height: 10, animationDelay: "-3.5s" }} />
          <div className="patinhas hidden md:flex" aria-hidden>
            {[0, 1, 2, 3, 4].map((i) => (
              <Fofo key={i} nome="pata" tamanho={14} style={{ transform: `translateY(${i % 2 ? -5 : 2}px) rotate(80deg)`, animationDelay: `${i * .35}s` }} />
            ))}
          </div>
          <div className="velas hidden md:flex" style={{ right: "clamp(200px, 23vw, 260px)" }} aria-hidden>
            <Vela altura={30} />
            <Vela altura={48} atraso="-1.1s" />
            <Vela altura={21} atraso="-.6s" />
          </div>
        </>
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
          <ModoTema className={botaoFaixa} style={estiloBotaoFaixa} />
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
          {snow ? (
            <p className="font-dm uppercase text-[11px] tracking-[.28em] flex items-center gap-3" style={{ color: "var(--vela)" }}>
              <span className="w-[26px] h-px opacity-60" style={{ background: "var(--vela)" }} />
              {TEMA.marca}
            </p>
          ) : (
            <p className="font-mono uppercase text-[12px] tracking-[.22em]" style={{ color: "var(--ouro)" }}>
              {TEMA.marca}
            </p>
          )}
          <h1 className="font-fraunces leading-[.95] mt-1"
            style={snow ? {
              fontSize: "clamp(48px, 12.5vw, 80px)", fontWeight: 500, fontSizeAdjust: "none",
              letterSpacing: "-.01em", color: "#F2E9DF",
            } : {
              fontSize: "clamp(44px, 11vw, 72px)", color: "#F2EBDC",
              fontVariationSettings: '"SOFT" 100, "WONK" 1',
            }}>
            {TEMA.titulo[0]}<em style={{ color: snow ? "var(--vela)" : "var(--ouro)", fontStyle: "italic" }}>{TEMA.titulo[1]}</em>
          </h1>

          <div className="mt-4 inline-flex items-center gap-1">
            <button onClick={() => onMes(-1)} aria-label="Mês anterior"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ border: bordaSeta }}>
              <ChevronLeft size={16} />
            </button>
            <span className="font-fraunces italic min-w-[150px] text-center whitespace-nowrap"
              style={{ fontSize: snow ? 22 : 19, fontSizeAdjust: "none" }}>
              {MESES[mM]} {mY}
            </span>
            <button onClick={() => onMes(1)} aria-label="Próximo mês"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ border: bordaSeta }}>
              <ChevronRight size={16} />
            </button>
          </div>
          {snow && TEMA.falas && (
            <p className="md:hidden font-fraunces italic text-[16px] mt-2.5" style={{ color: "rgb(242 233 223 / .78)", fontSizeAdjust: "none" }}>
              <span style={{ color: "var(--vela)" }}>“</span>{TEMA.falas[humor]}<span style={{ color: "var(--vela)" }}>”</span>
            </p>
          )}
        </div>

        <div className="relative shrink-0 self-end" key={humor}>
          {snow && TEMA.falas && <p className="fala hidden md:block">{TEMA.falas[humor]}</p>}
          <Figura fig={fig} altura={snow ? 156 : 170}
            className="relative block translate-y-1 pointer-events-none select-none max-w-[38vw] object-contain object-bottom"
            style={snow ? undefined : { filter: "drop-shadow(0 6px 10px rgb(0 0 0 / .35))" }} />
        </div>
      </div>

      {snow ? <div className="fio relative z-[2]"><Losango className="orn" /></div> : <div className="morro z-[2]" />}
    </header>
  );
}

/** Uma vela acesa do pires (Snowbobão): cera, pavio, chama que tremula e o halo. */
function Vela({ altura, atraso }: { altura: number; atraso?: string }) {
  return (
    <span className="vela" style={{ height: altura }}>
      <span className="halo" style={{ animationDelay: atraso }} />
      <span className="pavio" />
      <span className="chama" style={{ animationDelay: atraso }} />
    </span>
  );
}
