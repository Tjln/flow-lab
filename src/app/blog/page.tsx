import Link from "next/link";
import type { Metadata } from "next";
import { Section } from "@/components/ui/Container";
import { PageHero } from "@/components/layout/PageHero";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { formatDate, posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Methode, outils et tutoriels pour automatiser votre business avec n8n, sans jargon inutile.",
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Le blog"
        intro="Ce que nous apprenons en construisant des automatisations, ecrit pour etre applique le jour meme."
        crumbs={[{ label: "Blog" }]}
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
          <div className="flex flex-col">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border-b border-[var(--color-border)] py-8 first:pt-0"
              >
                <div className="flex flex-wrap items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-2 text-[var(--color-brand)]">
                    <span aria-hidden="true" className="size-2 bg-[var(--color-brand)]" />
                    {post.category}
                  </span>
                  <span aria-hidden="true">/</span>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden="true">/</span>
                  <span>{post.readingMinutes} min de lecture</span>
                </div>

                <h2 className="mt-4 font-display text-2xl font-medium leading-snug sm:text-3xl">
                  <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-[var(--color-brand)]">
                    {post.title}
                  </Link>
                </h2>

                <p className="mt-3 max-w-2xl text-[var(--color-text-muted)]">{post.excerpt}</p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-block text-sm font-semibold text-[var(--color-brand)]"
                >
                  Lire l&apos;article &rarr;
                </Link>
              </article>
            ))}
          </div>

          <BlogSidebar />
        </div>
      </Section>
    </>
  );
}
