/**
 * Accordeon FAQ bati sur <details>/<summary> : accessible au clavier et
 * fonctionnel meme sans JavaScript, sans etat a gerer cote React.
 */
export function Accordion({ items }: { items: readonly { question: string; answer: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 transition-colors open:border-[var(--color-brand)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="relative size-4 shrink-0 border border-[var(--color-border-strong)] transition-colors group-open:border-[var(--color-brand)] group-open:bg-[var(--color-brand)]"
            >
              <span className="absolute left-1/2 top-1/2 h-px w-2 -translate-x-1/2 -translate-y-1/2 bg-[var(--color-ink)] group-open:bg-white" />
              <span className="absolute left-1/2 top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-[var(--color-ink)] group-open:hidden" />
            </span>
          </summary>
          <p className="mt-3 max-w-3xl text-[var(--color-text-muted)]">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
