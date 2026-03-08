import { Suspense } from "react";
import { QueryClient } from "@tanstack/react-query";

import { Post, PostCardSkeleton, PostList } from "~/app/_components/posts";
import { HydrateClient } from "~/query/server";

export default async function SubredditPage({
  params,
}: {
  params: Promise<{ subreddit: string; postId: string }>;
}) {
  const { subreddit, postId } = await params;
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
        <Post subreddit={subreddit} postId={postId} />
      </Suspense>
    </HydrateClient>
  );
}
