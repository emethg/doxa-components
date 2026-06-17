import type { ElementType } from "react";
import { cn } from "@/utils/cn";

const LEADING_SLASH_RE = /^\//;

export type SidebarNode =
  | { type: "link"; title: string; path: string; method?: string }
  | { type: "group"; title: string; children: SidebarNode[] };

// HTTP method badge colors, Mintlify-style.
const METHOD_STYLES: Record<string, string> = {
  GET: "text-emerald-600 dark:text-emerald-400",
  POST: "text-blue-600 dark:text-blue-400",
  PUT: "text-amber-600 dark:text-amber-400",
  PATCH: "text-amber-600 dark:text-amber-400",
  DELETE: "text-red-600 dark:text-red-400",
};

function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={cn(
        "inline-flex w-12 shrink-0 items-center rounded px-1 py-0.5 font-bold text-[10px] uppercase leading-none tracking-wide",
        "bg-muted/60",
        METHOD_STYLES[method] ?? "text-muted-foreground"
      )}
    >
      {method}
    </span>
  );
}

function NavTree({
  nodes,
  current,
  linkComponent: L,
  depth = 0,
}: {
  nodes: SidebarNode[];
  current: string;
  linkComponent: ElementType;
  depth?: number;
}) {
  return (
    <ul className={cn(depth > 0 && "ml-3 border-l pl-2")}>
      {nodes.map((node) => {
        if (node.type === "group") {
          return (
            <li className="mt-4 first:mt-0" key={`group-${node.title}`}>
              <p className="mb-1 px-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                {node.title}
              </p>
              <NavTree
                current={current}
                depth={depth}
                linkComponent={L}
                nodes={node.children}
              />
            </li>
          );
        }
        const active = node.path === current;
        return (
          <li key={node.path}>
            <L
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
              href={`/${node.path}`}
            >
              {node.method && <MethodBadge method={node.method} />}
              <span>{node.title}</span>
            </L>
          </li>
        );
      })}
    </ul>
  );
}

export interface SidebarNavProps {
  tree: SidebarNode[];
  /** Current page URL path (provided by the host app; no router dependency). */
  currentPath: string;
  /** Link component to render (e.g. next/link). Defaults to a plain anchor. */
  linkComponent?: ElementType;
  /**
   * Extra classes merged onto the root `<nav>` — used by the host app to control
   * responsive visibility (e.g. hide on mobile, where it renders in a drawer).
   */
  className?: string;
}

export function SidebarNav({
  tree,
  currentPath,
  linkComponent = "a",
  className,
}: SidebarNavProps) {
  const current = currentPath.replace(LEADING_SLASH_RE, "");
  return (
    <nav
      className={cn("w-64 shrink-0 overflow-y-auto border-r p-4", className)}
    >
      <NavTree current={current} linkComponent={linkComponent} nodes={tree} />
    </nav>
  );
}
