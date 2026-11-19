"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ListKeys({ ids }: { ids: string[] }) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT");

      if (event.key === "/" && !isTyping) {
        const search = document.getElementById("capture-search");
        if (search instanceof HTMLInputElement) {
          event.preventDefault();
          search.focus();
        }
        return;
      }

      if (isTyping || (event.key !== "j" && event.key !== "k")) return;
      if (ids.length === 0) return;

      const current = ids.findIndex((id) =>
        window.location.pathname.endsWith(id),
      );
      const step = event.key === "j" ? 1 : -1;
      const next = ids[Math.min(Math.max(current + step, 0), ids.length - 1)];
      if (!next) return;

      event.preventDefault();
      router.push(`/console/${next}`);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ids, router]);

  return null;
}
