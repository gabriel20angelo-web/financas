"use client";

import Figura from "@/components/Figura";
import { Fofo, FOFOS, FOFO_DA_ABA } from "@/components/Fofos";
import { TEMA, type AbaId } from "@/lib/tema";

/** A barra de abas, com o bicho da aba espiando por trás dela. */
export default function Abas({ abas, ativa, onTrocar }: {
  abas: { id: AbaId; label: string }[];
  ativa: AbaId;
  onTrocar: (id: AbaId) => void;
}) {
  const fig = TEMA.figurasDaAba[ativa];
  return (
    <div className="abas mt-20 mb-5">
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
  );
}
