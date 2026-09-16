import type { ReactNode } from "react";

/**
 * Bandeau defilant. Le contenu est duplique une fois : l'animation translate
 * de -50%, ce qui fait boucler le defilement sans saut visible.
 * La copie est masquee aux lecteurs d'ecran pour ne pas lire deux fois.
 */
export function Marquee({
  children,
  durationSeconds = 30,
  className = "",
}: {
  children: ReactNode;
  durationSeconds?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="fl-marquee-track"
        style={{ ["--marquee-duration" as string]: `${durationSeconds}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
