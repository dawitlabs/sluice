"use client";

import { useEffect } from "react";

const MAX_REPORTS = 3;

export function ErrorReporter() {
  useEffect(() => {
    let sent = 0;

    function report(message: string, digest?: string) {
      if (sent >= MAX_REPORTS) return;
      sent += 1;

      void fetch("/api/log/client-error", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.slice(0, 500),
          path: window.location.pathname,
          digest,
        }),
        keepalive: true,
      }).catch(() => undefined);
    }

    function handleError(event: ErrorEvent) {
      report(event.message);
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const reason: unknown = event.reason;
      report(reason instanceof Error ? reason.message : "unhandled rejection");
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
