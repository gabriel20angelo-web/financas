import { asset, type Figura as F } from "@/lib/tema";

/** Uma figura do banco da identidade, com o basePath já resolvido. */
export default function Figura({ fig, altura, className = "", style }: {
  fig: F;
  altura?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(fig.src)}
      alt={fig.alt}
      draggable={false}
      className={`figura ${className}`}
      style={{ height: altura ?? fig.h, width: "auto", ...style }}
    />
  );
}
