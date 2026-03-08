"use client";

// Error boundaries must be Client Components
import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <p className="text-2xl font-bold text-white">
        Try{" "}
        <Link className="text-primary underline" href="/r/react">
          /r/react
        </Link>{" "}
      </p>
    </div>
  );
}
