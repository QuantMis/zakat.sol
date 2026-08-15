import { posts } from "@/data/posts";
import type { ContentBlock, Post, PostTopic } from "@/lib/types";

const WORDS_PER_MINUTE = 200;

export const topicLabels: Record<PostTopic, string> = {
  rulings: "Rulings",
  product: "Product",
  guides: "Guides",
};

export function isPostTopic(value: string): value is PostTopic {
  return value in topicLabels;
}

function blockText(block: ContentBlock): string {
  switch (block.kind) {
    case "list":
      return block.items.join(" ");
    case "note":
      return `${block.title} ${block.text}`;
    default:
      return block.text;
  }
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

/** Derived from the writing itself, so it can never drift from the article. */
export function readingMinutes(post: Post): number {
  const words = post.body.reduce(
    (total, block) => total + countWords(blockText(block)),
    countWords(post.excerpt),
  );

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Newest first — the order every listing uses. `filter` already copies. */
export function sortedPosts(topic?: PostTopic | null): Post[] {
  return posts
    .filter((post) => !topic || post.topic === topic)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function findPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** Same topic first, then whatever is newest, so there is always something. */
export function relatedPosts(post: Post, count = 2): Post[] {
  const others = sortedPosts().filter((candidate) => candidate.slug !== post.slug);
  const sameTopic = others.filter((candidate) => candidate.topic === post.topic);

  return [...sameTopic, ...others.filter((candidate) => candidate.topic !== post.topic)].slice(
    0,
    count,
  );
}

export function topicCounts(): Array<{ topic: PostTopic; label: string; count: number }> {
  return (Object.keys(topicLabels) as PostTopic[])
    .map((topic) => ({
      topic,
      label: topicLabels[topic],
      count: posts.filter((post) => post.topic === topic).length,
    }))
    .filter((entry) => entry.count > 0);
}
