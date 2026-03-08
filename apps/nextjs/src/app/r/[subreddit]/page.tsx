import { Suspense } from "react";
import { QueryClient } from "@tanstack/react-query";

import { PostCardSkeleton, PostList } from "~/app/_components/posts";
import { HydrateClient } from "~/query/server";

export default async function SubredditPage({
  params,
}: {
  params: Promise<{ subreddit: string }>;
}) {
  const { subreddit } = await params;
  const queryClient = new QueryClient();

  return (
    <HydrateClient>
      <Suspense
        fallback={
          <div className="flex w-full flex-col gap-4">
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        }
      >
        <PostList subreddit={subreddit} />
      </Suspense>
    </HydrateClient>
  );
}
