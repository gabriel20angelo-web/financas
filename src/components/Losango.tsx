/** O ornamento losango do site da Iara Loren (a estrela de quatro pontas em traço). */
export default function Losango({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M20 3 L24 20 L20 37 L16 20 Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 20 L20 16 L37 20 L20 24 Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
