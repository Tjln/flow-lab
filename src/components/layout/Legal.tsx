import type { ReactNode } from "react";

/**
 * Mise en forme commune aux pages legales : une colonne etroite, une
 * hierarchie sobre, rien qui detourne de la lecture.
 */
export function LegalBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[var(--color-border)] py-8">
      <h2 className="font-display text-2xl font-medium">{title}</h2>
      <div className="mt-4 flex flex-col gap-4 text-[var(--color-text-muted)]">{children}</div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-[var(--color-brand)]" />
          {item}
        </li>
      ))}
    </ul>
  );
}
