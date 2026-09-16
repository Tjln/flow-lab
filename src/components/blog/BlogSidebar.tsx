import Link from "next/link";
import { Eyebrow } from "@/components/ui/Container";
import { LeadForm } from "@/components/lead/LeadForm";
import { getCategories, getTags, posts } from "@/content/posts";

/**
 * Colonne laterale du blog. Elle porte volontairement un formulaire :
 * le lecteur d'un article est deja engage, c'est le meilleur moment
 * pour lui proposer la newsletter.
 */
export function BlogSidebar() {
  const categories = getCategories();
  const tags = getTags();
  const recent = posts.slice(0, 3);

  return (
    <aside className="flex flex-col gap-10">
      <section className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <Eyebrow>Newsletter</Eyebrow>
        <p className="mt-3 mb-5 text-sm text-[var(--color-text-muted)]">
          Un workflow n8n utile chaque semaine, avec le fichier a importer.
        </p>
        <LeadForm
          source="blog-sidebar"
          tag="newsletter"
          submitLabel="Je m'abonne"
          reassurance="Un email par semaine. Desinscription en un clic."
        />
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Articles recents</h2>
        <ul className="mt-4 flex flex-col">
          {recent.map((post) => (
            <li key={post.slug} className="border-b border-[var(--color-border)] last:border-0">
              <Link
                href={`/blog/${post.slug}`}
                className="block py-3 text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-brand)]"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Categories</h2>
        <ul className="mt-4 flex flex-col">
          {categories.map((category) => (
            <li
              key={category.name}
              className="flex items-center justify-between border-b border-[var(--color-border)] py-3 text-sm text-[var(--color-text-muted)] last:border-0"
            >
              {category.name}
              <span className="font-mono text-xs">({category.count})</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-medium">Mots-cles</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag}
              className="border border-[var(--color-border)] px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
            >
              {tag}
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
