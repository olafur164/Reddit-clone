"use client";

import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@holm/ui/alert";

export const OfflineMessage = () => {
  // Initialize state with the current online status
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true,
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // Empty dependency array means this runs once on mount

  return !isOnline ? (
    <Alert className="max-w-md">
      <AlertTitle>Network offline</AlertTitle>
      <AlertDescription>
        data will be fetched when you connect to the internet again.
      </AlertDescription>
    </Alert>
  ) : null;
};
