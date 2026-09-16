import Link from "next/link";
import Image from "next/image";
import { legalNav, mainNav, site, socials } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { PixelStack } from "@/components/ui/PixelStack";
import { CtaBanner } from "./CtaBanner";
import { ContactBand } from "./ContactBand";

export function Footer() {
  return (
    <footer>
      <CtaBanner />
      <ContactBand />

      {/* Rangee de liens separes par un carre, comme sur la maquette. */}
      <Container>
        <nav
          aria-label="Pages principales"
          className="flex flex-wrap items-center justify-between gap-y-4 border-b border-[var(--color-border)] py-8"
        >
          {mainNav.slice(1).map((item, index) => (
            <span key={item.href} className="flex items-center gap-8">
              {index > 0 && <span aria-hidden="true" className="size-1.5 bg-[var(--color-border-strong)]" />}
              <Link href={item.href} className="transition-colors hover:text-[var(--color-brand)]">
                {item.label}
              </Link>
            </span>
          ))}
        </nav>
      </Container>

      {/* Logotype monumental : le dernier element vu, donc celui qu'on retient. */}
      <div className="relative overflow-hidden py-16">
        <PixelStack
          variant="descending"
          size={34}
          color="var(--color-surface)"
          className="absolute left-4 top-6 hidden md:block"
        />
        <PixelStack
          variant="ascending"
          size={34}
          color="var(--color-surface)"
          className="absolute bottom-6 right-4 hidden md:block"
        />
        <Container>
          <Image
            src="/brand/logo-dark.svg"
            alt=""
            aria-hidden="true"
            width={385}
            height={95}
            className="mx-auto h-auto w-full max-w-3xl"
          />
        </Container>
      </div>

      <Container>
        <div className="flex flex-col gap-4 border-t border-[var(--color-border)] py-6 text-xs text-[var(--color-text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-4">
            {socials.map((social) => (
              <li key={social.id}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-[var(--color-brand)]"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>

          <p>
            &copy; {new Date().getFullYear()} {site.name}. Projet etudiant, aucune vente reelle.
          </p>

          <ul className="flex flex-wrap gap-4">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-[var(--color-brand)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
