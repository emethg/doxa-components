import type { ElementType } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";

export interface VersionSwitcherItem {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
  deprecated?: boolean;
}

export interface VersionSwitcherProps {
  items: VersionSwitcherItem[];
  /** Link component to render (e.g. next/link). Defaults to a plain anchor. */
  linkComponent?: ElementType;
}

/**
 * Tiny CSS-only dropdown (uses <details>/<summary>) so it stays a server
 * component and ships zero client JS. Switching navigates to the equivalent
 * URL of the current page in the target version — or to that version's first
 * link when the current page doesn't exist there (computed upstream).
 */
export function VersionSwitcher({
  items,
  linkComponent: L = "a",
}: VersionSwitcherProps) {
  if (items.length < 2) return null;
  const active = items.find((i) => i.isActive) ?? items[0]!;

  return (
    <details className="relative">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-md border bg-background px-2.5 py-1 text-sm font-medium text-foreground hover:bg-accent">
        {active.label}
        {active.deprecated && (
          <span className="rounded bg-yellow-200 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100">
            old
          </span>
        )}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </summary>
      <div className="absolute right-0 z-50 mt-1 min-w-[10rem] rounded-md border border-border bg-background p-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
        {items.map((i) => (
          <L
            key={i.id}
            href={i.href}
            className={cn(
              "flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
              i.isActive ? "font-semibold text-foreground" : "text-muted-foreground",
            )}
          >
            <span>{i.label}</span>
            {i.deprecated && (
              <span className="rounded bg-yellow-200 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100">
                old
              </span>
            )}
          </L>
        ))}
      </div>
    </details>
  );
}
