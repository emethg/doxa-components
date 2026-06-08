import type { ComponentType } from "react";
import { Github, Globe, Linkedin, Twitter, Youtube } from "lucide-react";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  x: Twitter,
  twitter: Twitter,
  youtube: Youtube,
  website: Globe,
};

export interface FooterProps {
  siteName: string;
  footer?: { socials?: Record<string, string>; links?: unknown };
}

export function Footer({ siteName, footer }: FooterProps) {
  const socials = Object.entries(footer?.socials ?? {}).filter(
    ([, url]) => typeof url === "string" && url,
  );

  return (
    <footer className="border-t px-8 py-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {siteName}
        </p>
        {socials.length > 0 && (
          <div className="flex items-center gap-3">
            {socials.map(([name, url]) => {
              const Icon = ICONS[name.toLowerCase()] ?? Globe;
              return (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={name}
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </footer>
  );
}
