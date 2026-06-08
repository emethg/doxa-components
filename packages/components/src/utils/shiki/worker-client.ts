import type { Remote } from "comlink";

import type { ShikiHighlightedHtmlArgs } from "../shiki";

type HighlightFn = (
  props: ShikiHighlightedHtmlArgs
) => string | undefined | Promise<string | undefined>;
type ShikiWorkerInstance =
  | Remote<{ highlight: HighlightFn; ready: () => Promise<void> }>
  | undefined;

// The Shiki web worker is intentionally disabled.
//
// It was only ever an optimization for oversized code blocks (> 50 KB); normal
// blocks already highlight synchronously on the main thread, and callers treat
// `undefined` as "fall back to synchronous / unhighlighted". By always returning
// `undefined` here we keep that fallback while removing the
// `new Worker(new URL("./worker.js"), { type: "module" })` statement entirely.
//
// Why: a `type: "module"` worker makes the bundler emit an ESM worker chunk.
// When this library is consumed by a Next.js app, Next's SWC minifier parses
// that chunk as a classic script and fails with "'import' and 'export' cannot be
// used outside of module code", breaking the production build. Dropping the
// worker keeps highlighting fully main-thread and bundler-safe everywhere.
function getShikiWorker(): ShikiWorkerInstance {
  return undefined;
}

export { getShikiWorker };
