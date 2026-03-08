import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container h-screen py-16">
      Hæ, hérna eru linkar á{" "}
      <Link className="text-primary underline" href="/r/react">
        React subreddit
      </Link>{" "}
      og á{" "}
      <Link className="text-primary underline" href="/r/dotnet">
        Dotnet subreddit
      </Link>
    </main>
  );
}
