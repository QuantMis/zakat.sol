import { PostCard } from "@/components/blog/post-card";
import { TopicFilter } from "@/components/blog/topic-filter";
import { Star } from "@/components/ui/star";
import { posts } from "@/data/posts";
import { isPostTopic, sortedPosts, topicCounts, topicLabels } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description:
    "Notes on how the zakat.sol calculator prices a Solana wallet, and the rulings behind the numbers it reports.",
};

export default async function BlogPage(props: PageProps<"/blog">) {
  const { topic } = await props.searchParams;
  const active = typeof topic === "string" && isPostTopic(topic) ? topic : null;
  const visible = sortedPosts(active);

  return (
    <main className="relative mx-auto flex w-full max-w-[1120px] flex-1 flex-col gap-9 px-5 pt-14 sm:px-8 lg:pt-20">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Star className="size-[26px]" />
          <h1 className="text-[38px] tracking-[-0.03em] lg:text-[46px]">Blog</h1>
        </div>
        <p className="max-w-[560px] text-[16px] leading-relaxed text-muted lg:text-[18px]">
          How the calculator reads a wallet, and the rulings that decide what it does with what it
          finds.
        </p>
      </header>

      <TopicFilter active={active} total={posts.length} topics={topicCounts()} />

      {visible.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {visible.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <p className="rounded-[14px] border border-dashed border-line px-6 py-12 text-center text-[15px] text-muted">
          Nothing filed under {active ? topicLabels[active] : "that topic"} yet.
        </p>
      )}
    </main>
  );
}
