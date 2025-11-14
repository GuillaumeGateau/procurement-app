"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/achievements", label: "Achievements" },
  { href: "/publications", label: "Publications" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/the-road-ahead", label: "The Road Ahead", icon: "↗" },
];

type AppLayoutProps = {
  children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname() || "/";
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="sticky top-0 z-50 glass-panel border-b border-white/40">
        <div className="container-responsive flex items-center justify-between py-4">
          <Link href="/" className="flex flex-col" onClick={() => setMobileNavOpen(false)}>
            <span className="text-lg font-heading uppercase tracking-[0.2em] text-ocean">
              Macmillan Keck
            </span>
            <span className="text-xs font-medium text-muted">Digital economy law & strategy</span>
          </Link>
          <nav className="hidden gap-1 overflow-x-auto whitespace-nowrap md:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "nav-link rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150",
                    isActive
                      ? "bg-ocean text-white shadow nav-link-active"
                      : link.icon
                        ? "text-rose-600 hover:bg-white/70 hover:text-rose-700"
                        : "text-muted hover:bg-white/70 hover:text-slate"
                  )}
                >
                  <span className="flex items-center gap-1">
                    {link.icon ? <span aria-hidden="true">{link.icon}</span> : null}
                    <span>{link.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="md:hidden rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm font-semibold text-ocean shadow-sm"
            onClick={() => setMobileNavOpen(true)}
          >
            Menu
          </button>
        </div>
      </header>

      <div
        className={clsx(
          "fixed inset-0 z-50 bg-white/90 backdrop-blur-xl transition-opacity duration-200 md:hidden",
          isMobileNavOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex h-full flex-col justify-between p-6">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-ocean/70">Navigate</p>
                <p className="text-lg font-heading text-slate">Macmillan Keck</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-slate/20 bg-white px-4 py-2 text-sm font-semibold text-slate shadow"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation"
              >
                Close ✕
              </button>
            </div>
            <div className="mt-8 space-y-2">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={`mobile-${link.href}`}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={clsx(
                    "flex items-center gap-2 rounded-2xl px-4 py-3 text-lg font-semibold transition",
                    isActive ? "bg-ocean text-white" : link.icon ? "bg-white/80 text-rose-600" : "bg-white/80 text-slate"
                    )}
                  >
                    {link.icon ? <span aria-hidden="true">{link.icon}</span> : null}
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="space-y-3 text-sm text-muted">
            <p className="font-semibold text-slate">Contact</p>
            <a href="mailto:contact@macmillankeck.pro" className="block text-ocean">
              contact@macmillankeck.pro
            </a>
            <a href="tel:+41225754522" className="block text-ocean">
              +41 22 575 45 22
            </a>
            <a href="tel:+12126266666" className="block text-ocean">
              +1 212 626 6666
            </a>
          </div>
        </div>
      </div>

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


