import Figura from "@/components/Figura";
import { TEMA } from "@/lib/tema";

/** O bicho dormindo, para as caixas vazias das abas. */
export default function FiguraVazia() {
  return <Figura fig={TEMA.vazio} altura={84} className="mx-auto mb-3 opacity-95" />;
}
