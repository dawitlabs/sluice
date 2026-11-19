"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  slug: string;
  title: string;
};

export function DocsSidebar({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation">
      <p className="font-mono text-[10px] tracking-[0.12em] text-ink-faint uppercase">
        Documentation
      </p>
      <ul className="mt-4 space-y-0.5">
        {items.map((item, index) => {
          const href = `/docs/${item.slug}`;
          const isActive = pathname === href;

          return (
            <li key={item.slug}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-baseline gap-3 border-l-2 py-2.5 pl-3 transition-colors ${
                  isActive
                    ? "border-signal bg-paper-2 text-ink"
                    : "border-rule text-ink-soft hover:border-rule-strong hover:text-ink"
                }`}
              >
                <span className="font-mono text-[10px] text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-[13.5px] leading-snug">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
