// ============================================================
// Reddit JSON API — TypeScript Types
// Covers:
//   GET /r/{subreddit}.json          → SubredditListing
//   GET /r/{subreddit}/comments/{id}.json → PostWithComments
// ============================================================

// ----------------------------------------------------------------
// Shared primitives
// ----------------------------------------------------------------

/** Reddit "fullname" — e.g. "t3_abc123". Prefix key:
 *  t1 = comment, t2 = account, t3 = link/post,
 *  t4 = message, t5 = subreddit, t6 = award
 */
export type RedditFullname = string;

export type RedditKind =
  | "t1" // Comment
  | "t2" // Account
  | "t3" // Link / Post
  | "t4" // Message
  | "t5" // Subreddit
  | "t6" // Award
  | "more" // "load more comments" placeholder
  | "Listing";

// ----------------------------------------------------------------
// Awards
// ----------------------------------------------------------------

export interface RedditAward {
  id: string;
  name: string;
  description: string;
  icon_url: string;
  icon_width: number;
  icon_height: number;
  count: number;
  coin_price: number;
  coin_reward: number;
  days_of_premium: number | null;
  resized_icons: ResizedImage[];
  resized_static_icons: ResizedImage[];
}

export interface ResizedImage {
  url: string;
  width: number;
  height: number;
}

// ----------------------------------------------------------------
// Media / Preview
// ----------------------------------------------------------------

export interface RedditImageSource {
  url: string;
  width: number;
  height: number;
}

export interface RedditImageResolution extends RedditImageSource {}

export interface RedditImageVariants {
  obfuscated?: {
    source: RedditImageSource;
    resolutions: RedditImageResolution[];
  };
  nsfw?: {
    source: RedditImageSource;
    resolutions: RedditImageResolution[];
  };
  gif?: {
    source: RedditImageSource;
    resolutions: RedditImageResolution[];
  };
  mp4?: {
    source: RedditImageSource;
    resolutions: RedditImageResolution[];
  };
}

export interface RedditPreviewImage {
  id: string;
  source: RedditImageSource;
  resolutions: RedditImageResolution[];
  variants: RedditImageVariants;
}

export interface RedditPreview {
  images: RedditPreviewImage[];
  reddit_video_preview?: RedditVideo;
  enabled: boolean;
}

export interface RedditVideo {
  bitrate_kbps?: number;
  fallback_url: string;
  height: number;
  width: number;
  scrubber_media_url?: string;
  dash_url?: string;
  duration: number;
  hls_url?: string;
  is_gif: boolean;
  transcoding_status?: string;
}

export interface RedditMedia {
  type?: string;
  oembed?: {
    provider_url: string;
    description?: string;
    title: string;
    author_name?: string;
    author_url?: string;
    type: string;
    thumbnail_url?: string;
    thumbnail_width?: number;
    thumbnail_height?: number;
    html: string;
    width: number;
    height: number | null;
    version: string;
    provider_name: string;
    url?: string;
  };
  reddit_video?: RedditVideo;
}

// ----------------------------------------------------------------
// Flair
// ----------------------------------------------------------------

export interface FlairRichtext {
  /** "text" | "emoji" */
  e: string;
  /** Text content (when e === "text") */
  t?: string;
  /** Emoji URL (when e === "emoji") */
  u?: string;
  /** Emoji shortcode (when e === "emoji") */
  a?: string;
}

// ----------------------------------------------------------------
// Post (Link) data  — t3
// ----------------------------------------------------------------

export interface RedditPostData {
  /** Fullname of the post, e.g. "t3_abc123" */
  name: RedditFullname;
  id: string;
  title: string;
  selftext: string;
  selftext_html: string | null;
  /** Post URL (external link or reddit permalink for self posts) */
  url: string;
  permalink: string;
  /** Username of the author */
  author: string;
  author_fullname?: string;
  author_flair_text: string | null;
  author_flair_richtext?: FlairRichtext[];
  author_flair_type?: string;
  author_flair_background_color?: string | null;
  author_flair_text_color?: string | null;

  subreddit: string;
  subreddit_id: string;
  subreddit_name_prefixed: string;
  subreddit_type: "public" | "private" | "restricted" | "archived";
  subreddit_subscribers: number;

  score: number;
  upvote_ratio: number;
  ups: number;
  downs: number;
  likes: boolean | null;

  num_comments: number;
  num_crossposts: number;

  /** Unix timestamp (seconds) */
  created: number;
  /** Unix timestamp (seconds), UTC */
  created_utc: number;

  is_self: boolean;
  is_video: boolean;
  is_original_content: boolean;
  is_meta: boolean;
  is_reddit_media_domain: boolean;
  is_crosspostable?: boolean;

  over_18: boolean;
  spoiler: boolean;
  locked: boolean;
  archived: boolean;
  hidden: boolean;
  quarantine: boolean;
  stickied: boolean;
  pinned: boolean;

  domain: string;
  thumbnail: string;
  thumbnail_width: number | null;
  thumbnail_height: number | null;

  link_flair_text: string | null;
  link_flair_richtext?: FlairRichtext[];
  link_flair_type?: string;
  link_flair_css_class?: string | null;
  link_flair_background_color?: string | null;
  link_flair_text_color?: string | null;

  post_hint?: "link" | "image" | "hosted:video" | "rich:video" | "self";
  preview?: RedditPreview;
  media?: RedditMedia | null;
  media_embed?: Record<string, unknown>;
  secure_media?: RedditMedia | null;
  secure_media_embed?: Record<string, unknown>;

  crosspost_parent?: RedditFullname;
  crosspost_parent_list?: RedditPostData[];

  all_awardings: RedditAward[];
  total_awards_received: number;

  gilded: number;
  gildings: Record<string, number>;

  /** Will be null for non-mod requests */
  approved_by: string | null;
  banned_by: string | null;
  removed_by: string | null;
  mod_note: string | null;
  mod_reason_title: string | null;

  /** HTML-escaped suggested sort, e.g. "confidence" */
  suggested_sort: string | null;

  send_replies: boolean;
  contest_mode: boolean;
  clicked: boolean;
  saved: boolean;
  visited: boolean;

  distinguished: "moderator" | "admin" | "special" | null;

  category: string | null;
  content_categories: string[] | null;

  url_overridden_by_dest?: string;
}

// ----------------------------------------------------------------
// Comment data — t1
// ----------------------------------------------------------------

export interface RedditCommentData {
  /** Fullname, e.g. "t1_xyz789" */
  name: RedditFullname;
  id: string;
  parent_id: RedditFullname;
  link_id: RedditFullname;

  body: string;
  body_html: string;

  author: string;
  author_fullname?: string;
  author_flair_text: string | null;
  author_flair_richtext?: FlairRichtext[];
  author_flair_type?: string;
  author_flair_background_color?: string | null;
  author_flair_text_color?: string | null;

  subreddit: string;
  subreddit_id: string;
  subreddit_name_prefixed: string;
  subreddit_type: "public" | "private" | "restricted" | "archived";

  score: number;
  ups: number;
  downs: number;
  likes: boolean | null;
  score_hidden: boolean;

  /** Unix timestamp (seconds) */
  created: number;
  /** Unix timestamp (seconds), UTC */
  created_utc: number;

  edited: number | false;

  gilded: number;
  gildings: Record<string, number>;
  all_awardings: RedditAward[];
  total_awards_received: number;

  depth: number;
  /** Nested replies — another Listing of t1/more items */
  replies: RedditListing<RedditComment | RedditMore> | "" | null;

  stickied: boolean;
  locked: boolean;
  archived: boolean;
  collapsed: boolean;
  collapsed_reason: string | null;
  collapsed_because_crowd_control: boolean | null;

  distinguished: "moderator" | "admin" | "special" | null;

  is_submitter: boolean;
  send_replies: boolean;
  saved: boolean;

  /** Present when comment is in "context" view */
  permalink?: string;

  approved_by: string | null;
  banned_by: string | null;
  removal_reason: string | null;
  mod_note: string | null;
}

// ----------------------------------------------------------------
// "More" object — lazy-load placeholder for hidden/collapsed comments
// ----------------------------------------------------------------

export interface RedditMoreData {
  id: string;
  name: RedditFullname;
  parent_id: RedditFullname;
  /** Fullnames of children to load */
  children: string[];
  count: number;
  depth: number;
}

// ----------------------------------------------------------------
// Generic Thing wrapper
// ----------------------------------------------------------------

export interface RedditThing<K extends RedditKind, D> {
  kind: K;
  data: D;
}

export type RedditPost = RedditThing<"t3", RedditPostData>;
export type RedditComment = RedditThing<"t1", RedditCommentData>;
export type RedditMore = RedditThing<"more", RedditMoreData>;

// ----------------------------------------------------------------
// Listing wrapper
// ----------------------------------------------------------------

export interface RedditListingData<T> {
  /** "Listing" */
  modhash: string;
  dist: number | null;
  /** Fullname of the item BEFORE the first item in this listing (for pagination) */
  before: RedditFullname | null;
  /** Fullname of the item AFTER the last item in this listing (for pagination) */
  after: RedditFullname | null;
  children: T[];
  geo_filter?: string;
}

export type RedditListing<T> = RedditThing<"Listing", RedditListingData<T>>;

// ----------------------------------------------------------------
// Subreddit Listing  (/r/{subreddit}.json)
// ----------------------------------------------------------------

/**
 * Response from GET /r/{subreddit}.json
 * A Listing of posts (t3 things).
 */
export type SubredditListing = RedditListing<RedditPost>;

// ----------------------------------------------------------------
// Post detail with comments  (/r/{subreddit}/comments/{id}.json)
// ----------------------------------------------------------------

/**
 * Response from GET /r/{subreddit}/comments/{post_id}.json
 *
 * A two-element tuple:
 *   [0] — Listing containing the single post (t3)
 *   [1] — Listing containing top-level comments (t1) and "more" placeholders
 */
export type PostWithComments = [
  RedditListing<RedditPost>,
  RedditListing<RedditComment | RedditMore>
];

// ----------------------------------------------------------------
// Helper type guards
// ----------------------------------------------------------------

export function isPost(thing: RedditThing<RedditKind, unknown>): thing is RedditPost {
  return thing.kind === "t3";
}

export function isComment(thing: RedditThing<RedditKind, unknown>): thing is RedditComment {
  return thing.kind === "t1";
}

export function isMore(thing: RedditThing<RedditKind, unknown>): thing is RedditMore {
  return thing.kind === "more";
}

export function isListing(thing: RedditThing<RedditKind, unknown>): thing is RedditListing<unknown> {
  return thing.kind === "Listing";
}