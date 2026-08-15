import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostCard } from "@/components/blog/post-card";
import { PostCover } from "@/components/blog/post-cover";
import { Prose } from "@/components/content/prose";
import { buttonStyles } from "@/components/ui/button";
import { posts } from "@/data/posts";
import { findPost, readingMinutes, relatedPosts, topicLabels } from "@/lib/blog";
import { formatGregorian } from "@/lib/format";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = findPost(slug);

  if (!post) return {};

  return { title: post.title, description: post.excerpt };
}

export default async function PostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = findPost(slug);

  if (!post) notFound();

  const related = relatedPosts(post);

  return (
    <main className="relative mx-auto flex w-full max-w-[1120px] flex-1 flex-col px-5 pt-10 sm:px-8 lg:pt-14">
      <article className="mx-auto flex w-full max-w-[760px] flex-col">
        <Link
          href="/blog"
          className="w-fit font-mono text-[12px] text-muted transition-colors hover:text-ink"
        >
          ← Blog
        </Link>

        <h1 className="mt-6 text-[32px] leading-[1.1] tracking-[-0.03em] sm:text-[38px] lg:text-[44px]">
          {post.title}
        </h1>

        <p className="mt-4 font-mono text-[12px] text-faint">
          {topicLabels[post.topic]} · {formatGregorian(post.publishedAt)} ·{" "}
          {readingMinutes(post)} min read
        </p>

        <PostCover post={post} className="mt-8" />

        <p className="mt-9 text-[17.5px] leading-[1.65] font-medium text-ink lg:text-[19px]">
          {post.excerpt}
        </p>

        <Prose blocks={post.body} className="mt-7" />

        <aside className="mt-12 flex flex-col items-start gap-4 rounded-[16px] border border-brand/28 bg-[#F7FAF7] px-6 py-8 sm:px-9">
          <h2 className="text-[22px] tracking-[-0.02em]">
            Put it against your own wallet
          </h2>
          <p className="max-w-[520px] text-[15px] leading-relaxed text-muted">
            The scan is read-only and never signs a transaction. Connect a wallet, or paste a public
            address and see the same report.
          </p>
          <Link href="/portfolio" className={buttonStyles("primary", "md")}>
            Open the calculator
          </Link>
        </aside>
      </article>

      {related.length > 0 ? (
        <section className="mt-16 flex flex-col gap-5 border-t border-line pt-12">
          {/* Mono eyebrow, not a display heading — opt out of the extrabold base rule. */}
          <h2 className="font-mono text-[11px] font-normal tracking-[0.12em] text-faint uppercase">
            More from the blog
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {related.map((entry) => (
              <PostCard key={entry.slug} post={entry} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
