"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/console", label: "Captures" },
  { href: "/console/replays", label: "Replays" },
  { href: "/console/alerts", label: "Alerts" },
  { href: "/console/settings", label: "Settings" },
];

export function ConsoleNav({ variant }: { variant: "rail" | "bar" }) {
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (href === "/console") {
      return (
        pathname === "/console" ||
        (pathname.startsWith("/console/") &&
          !ITEMS.some(
            (item) =>
              item.href !== "/console" && pathname.startsWith(item.href),
          ))
      );
    }
    return pathname.startsWith(href);
  }

  if (variant === "bar") {
    return (
      <nav
        aria-label="Console"
        className="flex gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:hidden"
      >
        {ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href) ? "page" : undefined}
            className={`shrink-0 rounded-full px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] uppercase transition-colors ${
              isActive(item.href)
                ? "bg-ink text-paper"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Console" className="flex flex-col gap-0.5 p-3">
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? "page" : undefined}
          className={`border-l-2 py-2 pl-3 font-mono text-[11px] tracking-[0.06em] uppercase transition-colors ${
            isActive(item.href)
              ? "border-signal text-ink"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
