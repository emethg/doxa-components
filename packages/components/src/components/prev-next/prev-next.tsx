import type { ElementType } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface PageLink {
  title: string;
  path: string;
}

export interface PrevNextProps {
  prev?: PageLink;
  next?: PageLink;
  /** Link component to render (e.g. next/link). Defaults to a plain anchor. */
  linkComponent?: ElementType;
}

export function PrevNext({ prev, next, linkComponent: L = "a" }: PrevNextProps) {
  if (!prev && !next) return null;
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 border-t pt-6">
      <div>
        {prev && (
          <L
            href={`/${prev.path}`}
            className="group flex flex-col rounded-lg border p-4 transition-colors hover:border-primary/50"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="size-3" />
              Previous
            </span>
            <span className="mt-1 font-medium group-hover:text-primary">
              {prev.title}
            </span>
          </L>
        )}
      </div>
      <div>
        {next && (
          <L
            href={`/${next.path}`}
            className="group flex flex-col items-end rounded-lg border p-4 text-right transition-colors hover:border-primary/50"
          >
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              Next
              <ArrowRight className="size-3" />
            </span>
            <span className="mt-1 font-medium group-hover:text-primary">
              {next.title}
            </span>
          </L>
        )}
      </div>
    </div>
  );
}
