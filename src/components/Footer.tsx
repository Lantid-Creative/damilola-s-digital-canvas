import * as React from "react";
import { Github, Linkedin, Mail, Instagram } from "lucide-react";

const iconClass = "h-5 w-5 shrink-0";
const linkClass = "text-muted-foreground transition-colors hover:text-primary inline-flex items-center justify-center";

type SocialLink = {
  href: string;
  icon: React.ComponentType<any>;
  label: string;
  strokeWidth?: number;
};

export default function Footer() {
  const socialLinks: SocialLink[] = [
    { href: "https://github.com/Damilola-Yinusa", icon: Github, label: "GitHub", strokeWidth: 2 },
    { href: "https://linkedin.com/in/damilola-yinusa", icon: Linkedin, label: "LinkedIn", strokeWidth: 2 },
    { href: "https://x.com/thedamilyinusa", icon: XIcon, label: "X" },
    { href: "https://instagram.com/thedamilyinusa", icon: Instagram, label: "Instagram", strokeWidth: 2 },
    { href: "https://tiktok.com/@thedamilyinusa", icon: TiktokIcon, label: "TikTok" },
    { href: "mailto:hi@thedamiyinusa.com", icon: Mail, label: "Email", strokeWidth: 2 },
  ];

  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <div>
          <a href="#" className="font-display text-xl font-bold text-gradient">DY.</a>
          <p className="mt-1 font-body text-sm text-muted-foreground">
            © {new Date().getFullYear()} Damilola Yinusa. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {socialLinks.map(({ href, icon: Icon, label, strokeWidth }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className={linkClass}
              aria-label={label}
            >
              <Icon className={iconClass} {...(strokeWidth != null && { strokeWidth })} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

function XIcon({ className, ...props }: React.SVGAttributes<SVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TiktokIcon({ className, ...props }: React.SVGAttributes<SVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}
