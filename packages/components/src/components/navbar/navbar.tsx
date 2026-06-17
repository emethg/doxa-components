import type { ElementType, ReactNode } from "react";
import {
  VersionSwitcher,
  type VersionSwitcherItem,
} from "@/components/version-switcher";
import { cn } from "@/utils/cn";

const ABSOLUTE_URL_RE = /^https?:\/\//;

interface NavbarLink {
  label: string;
  href: string;
}
interface NavbarConfig {
  links?: NavbarLink[];
  primary?: { label: string; href: string; type?: string };
}
type Logo = string | { light?: string; dark?: string } | undefined;

interface TabItem {
  name: string;
  firstPath: string;
}

// Repo-relative logo paths (e.g. "/logo/light.svg") aren't served by the
// host app, so only use a logo image when it's an absolute URL.
function logoSrc(logo: Logo): string | null {
  const v = typeof logo === "string" ? logo : logo?.light;
  return v && ABSOLUTE_URL_RE.test(v) ? v : null;
}

export interface NavbarProps {
  siteName: string;
  logo?: Logo;
  tabs: TabItem[];
  activeTabName: string;
  config?: NavbarConfig;
  versions?: VersionSwitcherItem[];
  /** Link component to render (e.g. next/link). Defaults to a plain anchor. */
  linkComponent?: ElementType;
  /** Theme toggle control, injected by the host app. */
  themeToggle?: ReactNode;
  /** Search control, injected by the host app (carries the client boundary). */
  search?: ReactNode;
  /**
   * Leading slot rendered before the logo — used by the host app to inject a
   * mobile navigation trigger (hidden on larger viewports by the app).
   */
  leading?: ReactNode;
}

export function Navbar({
  siteName,
  logo,
  tabs,
  activeTabName,
  config,
  versions = [],
  linkComponent: L = "a",
  themeToggle,
  search,
  leading,
}: NavbarProps) {
  const src = logoSrc(logo);
  const showTabs = tabs.filter((t) => t.name).length > 1;

  return (
    <header className="z-30 shrink-0 border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 sm:gap-4 sm:px-6">
        {leading}
        <L className="flex min-w-0 items-center gap-2 font-semibold" href="/">
          {src ? (
            // biome-ignore lint/correctness/useImageSize: logo is a remote image of unknown intrinsic size, sized responsively via CSS (h-7 w-auto).
            <img alt={siteName} className="h-7 w-auto" src={src} />
          ) : (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground text-sm">
              {siteName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="truncate">{siteName}</span>
        </L>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {search}
          {versions.length > 1 && (
            <VersionSwitcher items={versions} linkComponent={L} />
          )}
          {themeToggle}

          {config?.links?.map((l) => (
            <a
              className="hidden text-muted-foreground text-sm hover:text-foreground md:inline"
              href={l.href}
              key={l.href}
            >
              {l.label}
            </a>
          ))}

          {config?.primary && (
            <a
              className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 font-medium text-primary-foreground text-sm"
              href={config.primary.href}
            >
              {config.primary.label}
            </a>
          )}
        </div>
      </div>

      {showTabs && (
        <div className="flex gap-1 overflow-x-auto px-4 sm:px-6">
          {tabs.map((t) => (
            <L
              className={cn(
                "whitespace-nowrap border-b-2 px-2 py-2 font-medium text-sm transition-colors",
                t.name === activeTabName
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              href={`/${t.firstPath}`}
              key={t.name}
            >
              {t.name}
            </L>
          ))}
        </div>
      )}
    </header>
  );
}
