"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays, CreditCard, LayoutGrid, List, Minus, PieChart, PiggyBank, Plus, Repeat, Tags, TimerReset, TrendingUp,
} from "lucide-react";
import Figura from "@/components/Figura";
import { Fofo, FOFOS, FOFO_DA_ABA } from "@/components/Fofos";
import { TEMA, type AbaId } from "@/lib/tema";

/**
 * As abas. No computador: a barra com o bicho da aba espiando por trás.
 * No celular: o nome da aba com o bicho ao lado, e embaixo da tela a barra
 * fixa (Lançamentos, Metas, o + do gasto/entrada, Cartões e «Mais», que abre
 * as outras abas).
 */

const ICONE_INARI: Record<AbaId, typeof List> = {
  lancamentos: List, calendario: CalendarDays, fixos: Repeat, pendencias: TimerReset, metas: PiggyBank,
  cartoes: CreditCard, categorias: Tags, graficos: PieChart, projecao: TrendingUp,
};

const CURTO: Partial<Record<AbaId, string>> = { metas: "Metas", lancamentos: "Lançamentos" };
const NA_BARRA: AbaId[] = ["lancamentos", "metas", "cartoes"];

function Icone({ id, tamanho }: { id: AbaId; tamanho: number }) {
  if (FOFOS) return <Fofo nome={FOFO_DA_ABA[id]} tamanho={tamanho} />;
  const I = ICONE_INARI[id];
  return <I size={tamanho - 2} strokeWidth={1.8} />;
}

export default function Abas({ abas, ativa, onTrocar, onNovo }: {
  abas: { id: AbaId; label: string }[];
  ativa: AbaId;
  onTrocar: (id: AbaId) => void;
  onNovo: (modo: "gasto" | "entrada") => void;
}) {
  const fig = TEMA.figurasDaAba[ativa];
  const nome = (id: AbaId) => abas.find((a) => a.id === id)?.label ?? id;

  function irPara(id: AbaId) {
    onTrocar(id);
    // no celular, se a pessoa estava lá embaixo, sobe até o nome da aba
    requestAnimationFrame(() => {
      const topo = document.getElementById("topo-da-aba");
      if (topo && topo.getBoundingClientRect().top < 0) topo.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <>
      {/* computador */}
      <div className="abas mt-20 mb-5 hidden md:block">
        <Figura key={ativa} fig={fig} className="espiando" />
        <div role="tablist" className="barra-abas flex gap-1 p-1 rounded-xl overflow-x-auto cartinha"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          {abas.map((t) => (
            <button key={t.id} role="tab" aria-selected={ativa === t.id} onClick={() => onTrocar(t.id)}
              className={FOFOS ? "aba inline-flex items-center justify-center gap-1.5" : "aba"}>
              {FOFOS && <Fofo nome={FOFO_DA_ABA[t.id]} tamanho={17} />}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* celular: o nome da aba, com o bicho ao lado */}
      <div id="topo-da-aba" className="md:hidden flex items-end justify-between gap-3 mt-8 mb-3 px-1 scroll-mt-3">
        <h2 className="titulo-aba font-fraunces flex items-center gap-2.5 min-w-0" style={{ color: "var(--text-primary)" }}>
          <span className="shrink-0" style={{ color: "var(--orange-500)" }}><Icone id={ativa} tamanho={26} /></span>
          <span className="truncate">{nome(ativa)}</span>
        </h2>
        <Figura key={ativa} fig={fig} altura={Math.round((fig.h ?? 96) * 0.78)} className="espiando-celular shrink-0" />
      </div>

      <NavCelular abas={abas} ativa={ativa} nome={nome} irPara={irPara} onNovo={onNovo} />
    </>
  );
}

function NavCelular({ abas, ativa, nome, irPara, onNovo }: {
  abas: { id: AbaId; label: string }[];
  ativa: AbaId;
  nome: (id: AbaId) => string;
  irPara: (id: AbaId) => void;
  onNovo: (modo: "gasto" | "entrada") => void;
}) {
  const [folha, setFolha] = useState<null | "mais" | "novo">(null);
  const foraDaBarra = !NA_BARRA.includes(ativa);

  useEffect(() => {
    if (!folha) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setFolha(null); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [folha]);

  const Item = ({ id }: { id: AbaId }) => (
    <button className="nav-item" aria-current={ativa === id ? "page" : undefined} onClick={() => irPara(id)}>
      <Icone id={id} tamanho={23} />
      <span>{CURTO[id] ?? nome(id)}</span>
    </button>
  );

  return (
    <>
      <nav className="nav-celular md:hidden" aria-label="Abas">
        <Item id="lancamentos" />
        <Item id="metas" />
        <button className="nav-mais-um" aria-label="Novo gasto ou entrada" onClick={() => setFolha("novo")}>
          <Plus size={26} strokeWidth={2.4} />
        </button>
        <Item id="cartoes" />
        <button className="nav-item" aria-current={foraDaBarra ? "page" : undefined} onClick={() => setFolha("mais")}>
          {foraDaBarra ? <Icone id={ativa} tamanho={23} /> : <LayoutGrid size={21} strokeWidth={1.8} />}
          <span>{foraDaBarra ? (CURTO[ativa] ?? nome(ativa)) : "Mais"}</span>
        </button>
      </nav>

      {folha && (
        <div className="fixed inset-0 z-[9000] flex items-end fundo-modal md:hidden"
          onClick={(e) => { if (e.target === e.currentTarget) setFolha(null); }}>
          <div className="folha-celular w-full">
            <span className="alca" aria-hidden />
            {folha === "novo" ? (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setFolha(null); onNovo("gasto"); }}
                  className="py-6 rounded-2xl font-dm font-semibold text-base flex flex-col items-center gap-2"
                  style={{ background: "color-mix(in srgb, var(--neg) 12%, transparent)", color: "var(--neg)", border: "1px solid color-mix(in srgb, var(--neg) 25%, transparent)" }}>
                  {FOFOS ? <Fofo nome="novelo" tamanho={34} /> : <Minus size={28} />}
                  Novo gasto
                </button>
                <button onClick={() => { setFolha(null); onNovo("entrada"); }}
                  className="py-6 rounded-2xl font-dm font-semibold text-base flex flex-col items-center gap-2"
                  style={{ background: "color-mix(in srgb, var(--pos) 12%, transparent)", color: "var(--pos)", border: "1px solid color-mix(in srgb, var(--pos) 25%, transparent)" }}>
                  {FOFOS ? <Fofo nome="peixinho" tamanho={34} /> : <Plus size={28} />}
                  Nova entrada
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {abas.map((t) => (
                  <button key={t.id} onClick={() => { setFolha(null); irPara(t.id); }}
                    className="folha-aba" aria-current={ativa === t.id ? "page" : undefined}>
                    <Icone id={t.id} tamanho={28} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
