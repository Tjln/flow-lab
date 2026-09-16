"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { announcement, mainNav } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { CropMarks } from "@/components/ui/PixelStack";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // L'en-tete se compacte apres le premier ecran, pour rendre de la hauteur
  // au contenu sans jamais disparaitre : le bouton de collecte reste atteignable.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 150);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      {/* Bandeau d'annonce : un seul message a la fois, sinon il ne sert plus a rien. */}
      <Link
        href={announcement.href}
        className="block bg-[var(--color-ink)] py-2.5 text-center transition-colors hover:bg-[var(--color-ink-deep)]"
      >
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-[var(--color-text-inverted)]">
          <span className="text-[var(--color-brand)]">{announcement.prefix}</span>{" "}
          {announcement.text}
        </span>
      </Link>

      <header
        className={`border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur transition-shadow duration-300 ${
          scrolled ? "shadow-[0_1px_20px_rgba(25,25,25,0.08)]" : ""
        }`}
      >
        <Container>
          <div
            className={`relative flex items-center justify-between gap-6 transition-all duration-300 ${
              scrolled ? "h-[60px]" : "h-[72px]"
            }`}
          >
            <CropMarks />

            <Link href="/" aria-label="flow_lab, accueil" className="shrink-0">
              <Logo className={`w-auto transition-all duration-300 ${scrolled ? "h-5" : "h-6"}`} />
            </Link>

            <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
              {mainNav.map((item) => {
                const active =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors hover:text-[var(--color-text)] ${
                      active
                        ? "text-[var(--color-text)] underline decoration-[var(--color-brand)] decoration-2 underline-offset-8"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <ButtonLink href="/ressources" className="hidden sm:inline-flex" withPip>
                Ressources gratuites
              </ButtonLink>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="menu-mobile"
                className="flex size-10 items-center justify-center border border-[var(--color-border)] lg:hidden"
              >
                <span className="sr-only">{menuOpen ? "Fermer le menu" : "Ouvrir le menu"}</span>
                <span aria-hidden="true" className="flex flex-col gap-1">
                  <span className="block h-px w-5 bg-[var(--color-ink)]" />
                  <span className="block h-px w-5 bg-[var(--color-ink)]" />
                  <span className="block h-px w-5 bg-[var(--color-ink)]" />
                </span>
              </button>
            </div>
          </div>
        </Container>

        {menuOpen && (
          <nav
            id="menu-mobile"
            aria-label="Navigation mobile"
            className="border-t border-[var(--color-border)] bg-[var(--color-bg)] lg:hidden"
          >
            <Container className="flex flex-col py-2">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-[var(--color-border)] py-3.5 font-mono text-xs uppercase tracking-[0.14em] last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <ButtonLink href="/ressources" className="my-4 w-full" withPip>
                Ressources gratuites
              </ButtonLink>
            </Container>
          </nav>
        )}
      </header>
    </div>
  );
}
