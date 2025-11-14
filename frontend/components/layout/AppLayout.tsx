"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/achievements", label: "Achievements" },
  { href: "/publications", label: "Publications" },
  { href: "/opportunities", label: "Opportunities" },
];

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname() || "/";

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="sticky top-0 z-50 glass-panel border-b border-white/40">
        <div className="container-responsive flex items-center justify-between py-4">
          <Link href="/" className="flex flex-col">
            <span className="text-lg font-heading uppercase tracking-[0.2em] text-ocean">
              Macmillan Keck
            </span>
            <span className="text-xs font-medium text-muted">Digital economy law & strategy</span>
          </Link>
          <nav className="flex gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150",
                    isActive ? "bg-ocean text-white shadow" : "text-muted hover:bg-white/70 hover:text-slate"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-16 border-t border-slate/10 bg-white/80 py-8 text-sm text-muted">
        <div className="container-responsive flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            © {new Date().getFullYear()} Macmillan Keck • Geneva & New York • Digital Economy Counsel
          </div>
          <div className="flex gap-6">
            <a href="mailto:contact@macmillankeck.pro" className="hover:text-ocean">
              Email us
            </a>
            <a href="tel:+41225754522" className="hover:text-ocean">
              +41 22 575 45 22
            </a>
            <a href="tel:+12126266666" className="hover:text-ocean">
              +1 212 626 6666
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};


