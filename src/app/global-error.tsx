"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    void fetch("/api/log/client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message:
          error instanceof Error ? error.message.slice(0, 500) : "global error",
        path: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f7f5f0",
          color: "#221f1b",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        }}
      >
        <main style={{ maxWidth: 440, padding: 24 }}>
          <p
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#c2410c",
            }}
          >
            render failed
          </p>
          <h1 style={{ fontSize: 28, margin: "12px 0 8px", fontWeight: 500 }}>
            This page could not be rendered.
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: "#57534e" }}>
            The failure was reported. Retrying re-renders the route; if it
            repeats, the same error will be attached to this session.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 20,
              height: 40,
              padding: "0 20px",
              borderRadius: 999,
              border: "none",
              background: "#221f1b",
              color: "#f7f5f0",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </main>
      </body>
    </html>
  );
}
