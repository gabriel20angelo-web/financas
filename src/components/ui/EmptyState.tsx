import Figura from "@/components/Figura";
import { TEMA } from "@/lib/tema";

interface Props {
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/** Vazio com o bicho do app no lugar do ícone cinza. */
export default function EmptyState({ message, action, className = "" }: Props) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 rounded-2xl ${className}`}>
      <Figura fig={TEMA.vazio} altura={110} className="mb-4 opacity-95" />
      <p className="font-dm text-sm max-w-sm text-center leading-relaxed" style={{ color: "var(--text-secondary)" }}>{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
