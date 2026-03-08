import type {
  PostWithComments,
  RedditComment,
  RedditMore,
  RedditFullname,
  SubredditListing,
} from "~/reddit-types";
import { getBaseUrl } from "./react";

function setSearchParams(
  params: Record<string, string | number | boolean | null | undefined>
): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
}

export const getSubreddit = async (subreddit: string, options: { after?: string | null; before?: string | null; } = {}): Promise<SubredditListing> => {

  const params = setSearchParams(options)
  const queryParams = params.toString().length > 0 ? `?${params.toString()}` : '';

  const response = await fetch(
    `${getBaseUrl()}/r/${subreddit}.json${queryParams}`,
    {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    }
  );
  const responseData = (await response.json()) as SubredditListing;
  return responseData;
}


export const getPostComments = async (
  subreddit: string,
  postId: string,
  options: { after?: string | null; before?: string | null } = {},
): Promise<PostWithComments> => {
  const params = setSearchParams(options);
  const queryParams =
    params.toString().length > 0 ? `?${params.toString()}` : "";

  const response = await fetch(
    `${getBaseUrl()}/r/${subreddit}/comments/${postId}.json${queryParams}`,
    {
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
    }
  );
  const responseData = (await response.json()) as PostWithComments;
  return responseData;
};

interface MoreChildrenResponse {
  json: {
    errors: unknown[];
    data: {
      things: (RedditComment | RedditMore)[];
    };
  };
}

export const getPostMoreComments = async (
  subreddit: string,
  postId: string,
  commentId: string
): Promise<PostWithComments> => {

  const response = await fetch(
    `${getBaseUrl()}/r/${subreddit}/comments/${postId}/comment/${commentId}.json`,
  );
  const responseData = (await response.json()) as PostWithComments;
  return responseData;
};
