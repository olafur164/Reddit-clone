"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useMutation,
  useQuery,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useInView } from "react-intersection-observer";

import { cn } from "@holm/ui";

import type {
  PostWithComments,
  RedditComment,
  RedditCommentData,
  RedditFullname,
  RedditMore,
  RedditPost,
  RedditPostData,
} from "~/reddit-types";
import {
  getPostComments,
  getPostMoreComments,
  getSubreddit,
} from "~/query/reddit-api";
import { isComment, isListing, isMore } from "~/reddit-types";

export function PostList({ subreddit }: { subreddit: string }) {
  const { ref, inView } = useInView();

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: [subreddit, "posts"],
      // initialPageParam is required in v5
      initialPageParam: undefined as string | undefined,
      queryFn: async ({
        pageParam,
      }): Promise<{
        data: RedditPost[] | null;
        previousId?: string | null;
        nextId?: string | null;
      }> => {
        try {
          const result = await getSubreddit(subreddit, {
            after: pageParam,
          });
          return {
            data: result.data.children,
            previousId: result.data.before,
            nextId: result.data.after,
          };
        } catch {
          return {
            data: null,
          };
        }
      },
      getPreviousPageParam: (firstPage) => firstPage.previousId,
      getNextPageParam: (lastPage) => lastPage.nextId,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (data.pages[0]?.data === null) {
    return (
      <div className="relative mt-24 flex w-full flex-col gap-4">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">
            No subreddit exists under /r/{subreddit}
          </p>
          <p className="text-2xl font-bold text-white">
            Try{" "}
            <Link className="text-primary underline" href="/r/react">
              /r/react
            </Link>{" "}
            instead
          </p>
        </div>
      </div>
    );
  }
  if (data.pages.length === 0) {
    return (
      <div className="relative flex w-full flex-col gap-4">
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />
        <PostCardSkeleton pulse={false} />

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          <p className="text-2xl font-bold text-white">No posts yet</p>
        </div>
      </div>
    );
  }
  console.log("data", data);
  return (
    <div className="flex w-full flex-col gap-4">
      {data.pages.map((page) => (
        <Fragment key={page.nextId}>
          {page.data?.map((post) => (
            <PostCard key={post.data.id} post={post.data} />
          ))}
        </Fragment>
      ))}
      <div>
        <button
          ref={ref}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load Newer"
              : "Nothing more to load"}
        </button>
      </div>
      <div>
        {isFetching && !isFetchingNextPage ? "Background Updating..." : null}
      </div>
    </div>
  );
}

export function PostCard(props: { post: RedditPostData }) {
  const humanizdTimeAgo = DateTime.fromSeconds(
    props.post.created_utc,
  ).toRelative({ locale: "en" });
  return (
    <a
      href={`/r/${props.post.subreddit}/comments/${props.post.id}`}
      className="bg-muted flex flex-col rounded-lg p-4"
    >
      <div className="grow">
        <h2 className="text-primary text-2xl font-bold">{props.post.title}</h2>
        <p className="text-muted-foreground mt-1 text-xs">
          Posted by u/{props.post.author} in{" "}
          {props.post.subreddit_name_prefixed}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">{humanizdTimeAgo}</p>
      </div>
      <div className="text-muted-foreground flex flex-row items-start gap-1 text-right text-xs">
        <span>{props.post.ups} upvotes</span>
        <span>{props.post.num_comments} comments</span>
      </div>
    </a>
  );
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="bg-muted flex flex-row rounded-lg p-4">
      <div className="grow">
        <h2
          className={cn(
            "bg-primary w-1/4 rounded-sm text-2xl font-bold",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </h2>
        <p
          className={cn(
            "mt-2 w-1/3 rounded-sm bg-current text-sm",
            pulse && "animate-pulse",
          )}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}

export function Post({
  subreddit,
  postId,
}: {
  subreddit: string;
  postId: string;
}) {
  const { data } = useQuery({
    queryKey: [subreddit, "posts", postId],
    queryFn: async (): Promise<PostWithComments> => {
      return getPostComments(subreddit, postId);
    },
  });

  if (!data) return null;

  const postListing = data[0];
  if (!postListing.data.children[0]) return null;
  const post = postListing.data.children[0].data;
  const rootThings = data[1].data.children;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="bg-muted flex flex-col gap-2 rounded-lg p-4">
        <h2 className="text-2xl font-bold">{post.title}</h2>
        <p className="text-muted-foreground text-xs">
          Posted by u/{post.author} in {post.subreddit_name_prefixed}
        </p>
        <p className="text-muted-foreground text-xs">
          {DateTime.fromSeconds(post.created_utc).toRelative()}
        </p>
        {post.selftext ? (
          <p className="mt-2 text-sm whitespace-pre-line">{post.selftext}</p>
        ) : null}

        <div className="text-muted-foreground flex flex-row items-start gap-1 text-right text-xs">
          <span>{post.ups} upvotes</span>
          <span>{post.num_comments} comments</span>
        </div>
      </div>
      <CommentTree things={rootThings} postId={postId} level={0} />
    </div>
  );
}

export function CommentList(props: { subreddit: string; postId: string }) {
  return <Post subreddit={props.subreddit} postId={props.postId} />;
}

interface CommentTreeProps {
  things: (RedditComment | RedditMore)[];
  postId: string;
  level: number;
}

function CommentTree({ things, postId, level }: CommentTreeProps) {
  if (!things.length) return null;

  const containerClass =
    level === 0
      ? "flex flex-col gap-3"
      : "ml-4 border-l border-border pl-4 flex flex-col gap-3";

  return (
    <div className={containerClass}>
      {things.map((thing) => {
        if (isComment(thing)) {
          return (
            <CommentNode
              key={thing.data.id}
              commentThing={thing}
              postId={postId}
              level={level}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

interface CommentNodeProps {
  commentThing: RedditComment;
  postId: string;
  level: number;
}

function CommentNode({ commentThing, postId, level }: CommentNodeProps) {
  const comment = commentThing.data;

  let nested = null;
  if (
    comment.replies !== null &&
    comment.replies !== "" &&
    isListing(comment.replies)
  ) {
    nested = (
      <CommentTree
        things={comment.replies.data.children}
        postId={postId}
        level={level + 1}
      />
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <CommentCard comment={comment} postId={postId} />
      {nested}
    </div>
  );
}

export function CommentCard(props: {
  comment: RedditCommentData;
  postId: string;
}) {
  return (
    <div className="bg-muted flex flex-col rounded-lg p-4">
      <div className="grow">
        <div className="flex items-baseline gap-2">
          <h2 className="text-primary text-base font-semibold">
            {props.comment.author}
          </h2>
          <span className="text-muted-foreground text-xs">
            {DateTime.fromSeconds(props.comment.created_utc).toRelative()}
          </span>
        </div>
        <p className="mt-1 text-sm">{props.comment.body}</p>
      </div>
      <div></div>
    </div>
  );
}
