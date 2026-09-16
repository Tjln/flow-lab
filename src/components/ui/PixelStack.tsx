/**
 * Le motif signature de la charte : un escalier de carres.
 * On le retrouve en decoration d'angle sur toutes les sections.
 * Purement decoratif, donc masque aux lecteurs d'ecran.
 */

type Cell = [col: number, row: number];

/** Escalier descendant, pour les angles superieurs gauches. */
const DESCENDING: Cell[] = [
  [0, 0],
  [1, 1],
  [2, 1],
  [2, 2],
];

/** Escalier montant, pour les angles inferieurs droits. */
const ASCENDING: Cell[] = [
  [0, 2],
  [0, 1],
  [1, 1],
  [2, 0],
];

const PRESETS = { descending: DESCENDING, ascending: ASCENDING } as const;

type Props = {
  variant?: keyof typeof PRESETS;
  cells?: Cell[];
  /** Cote d'un carre, en pixels. */
  size?: number;
  color?: string;
  className?: string;
};

export function PixelStack({
  variant = "descending",
  cells,
  size = 28,
  color = "var(--color-brand)",
  className = "",
}: Props) {
  const grid = cells ?? PRESETS[variant];
  const cols = Math.max(...grid.map(([c]) => c)) + 1;
  const rows = Math.max(...grid.map(([, r]) => r)) + 1;

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={cols * size}
      height={rows * size}
      viewBox={`0 0 ${cols} ${rows}`}
      className={`pointer-events-none select-none ${className}`}
    >
      {grid.map(([col, row]) => (
        <rect key={`${col}-${row}`} x={col} y={row} width="1" height="1" fill={color} />
      ))}
    </svg>
  );
}

/**
 * Reperes de coupe : les quatre petits carres d'angle qui encadrent les blocs
 * dans la maquette. Ils donnent le cote « planche de direction artistique »
 * qui signe l'identite.
 */
export function CropMarks() {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute -left-[3px] -top-[3px] size-1.5 bg-[var(--color-ink)]" />
      <span className="absolute -right-[3px] -top-[3px] size-1.5 bg-[var(--color-ink)]" />
      <span className="absolute -bottom-[3px] -left-[3px] size-1.5 bg-[var(--color-ink)]" />
      <span className="absolute -bottom-[3px] -right-[3px] size-1.5 bg-[var(--color-ink)]" />
    </span>
  );
}
