"use client";

import { FileText, Search as SearchIcon } from "lucide-react";
import {
  type ElementType,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

export interface DocsSearchItem {
  title: string;
  path: string;
}

export interface DocsSearchProps {
  items: DocsSearchItem[];
  /** Link component to render results with (e.g. next/link). Defaults to <a>. */
  linkComponent?: ElementType;
}

export function DocsSearch({ items, linkComponent: L = "a" }: DocsSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Refs to the rendered result links so Enter can trigger the injected link's
  // own navigation (e.g. next/link client routing) without a router dependency.
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // The modal is portaled to <body>, so it needs the client to be mounted.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return items.slice(0, 20);
    }
    return items
      .map((it) => {
        const title = it.title.toLowerCase();
        const path = it.path.toLowerCase();
        let score = 0;
        if (title === q) {
          score = 100;
        } else if (title.startsWith(q)) {
          score = 80;
        } else if (title.includes(q)) {
          score = 60;
        } else if (path.includes(q)) {
          score = 40;
        }
        return { it, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((r) => r.it);
  }, [query, items]);

  useEffect(() => {
    setActive(0);
  }, []);

  const onInputKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      linkRefs.current[active]?.click();
    }
  };

  return (
    <>
      <button
        className="hidden w-44 items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5 text-muted-foreground text-sm transition-colors hover:bg-muted sm:flex"
        onClick={() => setOpen(true)}
        type="button"
      >
        <SearchIcon className="size-4" />
        Search…
        <kbd className="ml-auto rounded border bg-background px-1.5 text-xs">
          ⌘K
        </kbd>
      </button>

      {open &&
        mounted &&
        createPortal(
          <>
            <button
              aria-label="Close search"
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              type="button"
            />
            <div
              aria-label="Search documentation"
              aria-modal="true"
              className="fixed inset-x-0 top-0 z-[101] flex justify-center p-4 pt-[15vh]"
              role="dialog"
            >
              <div className="w-full max-w-xl overflow-hidden rounded-xl border bg-background shadow-2xl">
                <div className="flex items-center gap-2 border-b px-4">
                  <SearchIcon className="size-4 text-muted-foreground" />
                  <input
                    className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={onInputKey}
                    placeholder="Search documentation…"
                    ref={inputRef}
                    value={query}
                  />
                  <kbd className="rounded border bg-muted px-1.5 text-muted-foreground text-xs">
                    Esc
                  </kbd>
                </div>
                <ul className="max-h-80 overflow-y-auto p-2">
                  {results.length === 0 ? (
                    <li className="px-3 py-6 text-center text-muted-foreground text-sm">
                      No results
                    </li>
                  ) : (
                    results.map((r, i) => (
                      <li key={r.path}>
                        <L
                          className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                            i === active
                              ? "bg-accent text-foreground"
                              : "text-muted-foreground"
                          )}
                          href={`/${r.path}`}
                          onClick={() => setOpen(false)}
                          onMouseEnter={() => setActive(i)}
                          ref={(el: HTMLAnchorElement | null) => {
                            linkRefs.current[i] = el;
                          }}
                        >
                          <FileText className="size-4 shrink-0" />
                          <span className="flex-1 truncate text-foreground">
                            {r.title}
                          </span>
                          <span className="truncate text-muted-foreground text-xs">
                            /{r.path}
                          </span>
                        </L>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
