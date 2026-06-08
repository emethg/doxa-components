import type { ElementType, ReactNode } from "react";
import { cn } from "@/utils/cn";
import {
  VersionSwitcher,
  type VersionSwitcherItem,
} from "@/components/version-switcher";

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
  return v && /^https?:\/\//.test(v) ? v : null;
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
}: NavbarProps) {
  const src = logoSrc(logo);
  const showTabs = tabs.filter((t) => t.name).length > 1;

  return (
    <header className="z-30 shrink-0 border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-6">
        <L href="/" className="flex items-center gap-2 font-semibold">
          {src ? (
            <img src={src} alt={siteName} className="h-7 w-auto" />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
              {siteName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="truncate">{siteName}</span>
        </L>

        <div className="ml-auto flex items-center gap-3">
          {search}
          {versions.length > 1 && (
            <VersionSwitcher items={versions} linkComponent={L} />
          )}
          {themeToggle}

          {config?.links?.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hidden text-sm text-muted-foreground hover:text-foreground md:inline"
            >
              {l.label}
            </a>
          ))}

          {config?.primary && (
            <a
              href={config.primary.href}
              className="inline-flex items-center rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
            >
              {config.primary.label}
            </a>
          )}
        </div>
      </div>

      {showTabs && (
        <div className="flex gap-1 overflow-x-auto px-6">
          {tabs.map((t) => (
            <L
              key={t.name}
              href={`/${t.firstPath}`}
              className={cn(
                "whitespace-nowrap border-b-2 px-2 py-2 text-sm font-medium transition-colors",
                t.name === activeTabName
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.name}
            </L>
          ))}
        </div>
      )}
    </header>
  );
}
