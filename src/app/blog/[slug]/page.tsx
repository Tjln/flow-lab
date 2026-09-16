import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { CropMarks } from "@/components/ui/PixelStack";
import { LeadForm } from "@/components/lead/LeadForm";
import { formatDate, getPost, postSlugs } from "@/content/posts";
import { getResource } from "@/content/resources";
import type { Block } from "@/content/posts";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return postSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

/** Rendu d'un bloc de contenu. Voir le commentaire de `Block` pour le choix du format. */
function renderBlock(block: Block, index: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={index} className="mt-10 font-display text-2xl font-medium">
          {block.text}
        </h2>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="my-8 border-l-2 border-[var(--color-brand)] py-1 pl-5 font-display text-xl leading-snug"
        >
          {block.text}
        </blockquote>
      );
    case "ul":
      return (
        <ul key={index} className="mt-5 flex flex-col gap-2.5">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-[var(--color-text-muted)]">
              <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 bg-[var(--color-brand)]" />
              {item}
            </li>
          ))}
        </ul>
      );
    default:
      return (
        <p key={index} className="mt-5 text-[var(--color-text-muted)]">
          {block.text}
        </p>
      );
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const upgrade = getResource(post.upgradeSlug);

  return (
    <>
      <PageHero title={post.title} crumbs={[{ label: "Blog", href: "/blog" }, { label: post.category }]} />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
          <article>
            <div className="flex flex-wrap items-center gap-3 border-b border-[var(--color-border)] pb-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
              <span className="flex items-center gap-2 text-[var(--color-brand)]">
                <span aria-hidden="true" className="size-2 bg-[var(--color-brand)]" />
                {post.category}
              </span>
              <span aria-hidden="true">/</span>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">/</span>
              <span>{post.readingMinutes} min de lecture</span>
            </div>

            <div className="text-lg leading-relaxed">{post.body.map(renderBlock)}</div>

            {/* Content upgrade : une offre liee au sujet lu convertit bien mieux
                qu'une newsletter generique posee en bas de page. */}
            {upgrade && (
              <div className="relative mt-14 border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
                <CropMarks />
                <Eyebrow>Pour aller plus loin</Eyebrow>
                <p className="mt-4 font-display text-2xl font-medium leading-snug">{upgrade.title}</p>
                <p className="mt-2 mb-6 text-[var(--color-text-muted)]">{upgrade.hook}</p>
                <div className="max-w-md">
                  <LeadForm
                    source={`blog-${post.slug}`}
                    tag={upgrade.n8nTag}
                    redirectTo={`/merci/${upgrade.slug}`}
                    submitLabel={upgrade.cta}
                  />
                </div>
              </div>
            )}

            <ul className="mt-10 flex flex-wrap items-center gap-2">
              <li className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Mots-cles
              </li>
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="border border-[var(--color-border)] px-3 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[var(--color-text-muted)]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </article>

          <BlogSidebar />
        </div>
      </Section>
    </>
  );
}
