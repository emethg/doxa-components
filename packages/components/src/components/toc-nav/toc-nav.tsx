"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export interface TocEntry {
  depth: number; // 2 = h2, 3 = h3
  title: string;
  id: string;
}

export interface TocNavProps {
  items: TocEntry[];
}

// Right-hand "On this page" table of contents with scroll-spy highlighting.
export function TocNav({ items }: TocNavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const firstItem = items[0];
    if (!firstItem) {
      return;
    }
    const firstEl = document.getElementById(firstItem.id);
    let root: Element | null = firstEl?.parentElement ?? null;
    while (root && root !== document.body) {
      const overflowY = getComputedStyle(root).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        break;
      }
      root = root.parentElement;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        root: root === document.body ? null : root,
        rootMargin: "0px 0px -75% 0px",
        threshold: 0,
      }
    );
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) {
        observer.observe(el);
      }
    }
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-0 p-4">
        <p className="mb-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
          On this page
        </p>
        <ul className="space-y-1 text-sm">
          {items.map((item) => (
            <li key={item.id} style={{ paddingLeft: (item.depth - 2) * 12 }}>
              <a
                className={cn(
                  "block transition-colors",
                  activeId === item.id
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                href={`#${item.id}`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
