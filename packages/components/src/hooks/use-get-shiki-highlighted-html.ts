import { useState } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import {
  getShikiHighlightedHtml,
  type ShikiHighlightedHtmlArgs,
} from "@/utils/shiki";

const useGetShikiHighlightedHtml = (
  props: ShikiHighlightedHtmlArgs
): string | undefined => {
  const htmlOrPromise = getShikiHighlightedHtml(props);

  // Always start `undefined` so the server (and the first client render that
  // hydrates it) emit the plain, unhighlighted code. If we seeded this with the
  // synchronously-highlighted HTML, the server and client could serialize the
  // same Shiki theme colors with different letter-case (e.g. #ffffff vs
  // #FFFFFF), producing a React hydration mismatch. The layout effect below then
  // sets the highlighted HTML on the client before paint, so the flash is
  // negligible while SSR and the initial CSR render stay identical at hydration.
  const [html, setHtml] = useState<string | undefined>(undefined);

  useIsomorphicLayoutEffect(() => {
    if (!(htmlOrPromise instanceof Promise)) {
      setHtml(htmlOrPromise);
      return;
    }

    let cancelled = false;

    async function getHtml() {
      if (!(htmlOrPromise instanceof Promise)) {
        setHtml(htmlOrPromise);
        return;
      }

      try {
        const result = await htmlOrPromise;
        if (!cancelled) {
          setHtml(result);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setHtml(undefined);
        }
      }
    }

    // biome-ignore lint/complexity/noVoid: TODO
    void getHtml();

    return () => {
      cancelled = true;
    };
  }, [props, htmlOrPromise]);

  return html;
};

export { useGetShikiHighlightedHtml };
