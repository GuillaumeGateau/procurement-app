"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { Publication } from "@lib/content";
import { Card } from "@ui/Card";
import { PUBLICATION_THEMES, classifyPublication, PublicationTheme } from "./publicationsThemes";

type PublicationsLibraryProps = {
  publications: Publication[];
  initialTheme?: string;
};

type GroupedPublications = {
  grouped: Record<string, Publication[]>;
  themeByTitle: Map<string, PublicationTheme>;
};

const buildGroups = (publications: Publication[]): GroupedPublications => {
  const themeByTitle = new Map<string, PublicationTheme>();
  const grouped = publications.reduce<Record<string, Publication[]>>((acc, publication) => {
    const theme = classifyPublication(publication);
    themeByTitle.set(publication.title, theme);
    if (!acc[theme.id]) acc[theme.id] = [];
    acc[theme.id].push(publication);
    return acc;
  }, {});

  return { grouped, themeByTitle };
};

const FILTERS = [{ id: "all", label: "All collections", icon: "✨" }, ...PUBLICATION_THEMES];

const normalizeTheme = (theme?: string) => {
  if (!theme) return "all";
  if (theme === "all") return "all";
  return PUBLICATION_THEMES.some((definition) => definition.id === theme) ? theme : "all";
};

export const PublicationsLibrary = ({ publications, initialTheme }: PublicationsLibraryProps) => {
  const { grouped, themeByTitle } = useMemo(() => buildGroups(publications), [publications]);
  const [activeTheme, setActiveTheme] = useState<string>(normalizeTheme(initialTheme));
  const activeThemeMeta = activeTheme === "all" ? null : PUBLICATION_THEMES.find((theme) => theme.id === activeTheme);

  const handleSelectTheme = (themeId: string) => {
    setActiveTheme(themeId);
  };

  const visiblePublications = activeTheme === "all" ? publications : grouped[activeTheme] ?? [];
  const heroPapers = visiblePublications.slice(0, 3);

  return (
    <section className="container-responsive space-y-10 pb-16">
      <div className="flex flex-wrap gap-3">
        {FILTERS.map((filter) => {
          const isActive = activeTheme === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => handleSelectTheme(filter.id)}
              className={clsx(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-slate bg-slate text-white shadow-sm"
                  : "border-slate/20 bg-white/70 text-slate hover:border-slate/40 hover:bg-white"
              )}
              aria-pressed={isActive}
            >
              <span className="text-base">{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {heroPapers.map((publication) => {
          const theme = themeByTitle.get(publication.title);
          return (
            <article
              key={publication.title}
              className="relative flex flex-col justify-between rounded-3xl border border-slate/10 bg-white p-5 text-left shadow-[0_12px_28px_rgba(15,23,42,0.12)]"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate/80">
                  <span>{theme?.icon ?? "✨"}</span>
                  <span>{theme?.label ?? "Featured insight"}</span>
                  {publication.year ? <span>• {publication.year}</span> : null}
                </div>
                <h3 className="text-xl font-semibold text-slate">{publication.title}</h3>
                {publication.summary ? (
                  <p className="text-sm leading-relaxed text-slate/80 line-clamp-4">{publication.summary}</p>
                ) : null}
              </div>
              <div className="mt-6 text-sm font-semibold text-slate">
                <a href={publication.url} target="_blank" rel="noreferrer" className="hover:underline">
                  Read the piece &rarr;
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {activeTheme === "all" ? (
        <div className="space-y-6">
          {PUBLICATION_THEMES.map((theme) => {
            const entries = grouped[theme.id] ?? [];
            if (!entries.length) return null;
            return (
              <section
                key={theme.id}
                className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_22px_45px_rgba(15,23,42,0.08)]"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{theme.icon}</span>
                      <h3 className={`text-xl font-semibold ${theme.accent}`}>{theme.label}</h3>
                    </div>
                    <p className="text-sm text-muted">{theme.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-wide text-slate/60">{entries.length} insights</span>
                    <button
                      type="button"
                      onClick={() => handleSelectTheme(theme.id)}
                      className="text-xs font-semibold text-ocean hover:underline"
                    >
                      See all →
                    </button>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {entries.slice(0, 3).map((publication) => (
                    <Card key={`${theme.id}-${publication.title}`} className="flex flex-col gap-3">
                      <p className="font-semibold text-slate">{publication.title}</p>
                      {publication.summary ? (
                        <p className="text-sm text-muted line-clamp-3">{publication.summary}</p>
                      ) : null}
                      <div className="mt-auto flex items-center justify-between text-xs text-ocean">
                        {publication.year ? <span>{publication.year}</span> : <span />}
                        <a href={publication.url} target="_blank" rel="noreferrer" className="font-semibold hover:underline">
                          Open →
                        </a>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeThemeMeta?.icon ?? "✨"}</span>
            <h3 className="text-2xl font-heading text-slate">{activeThemeMeta?.label}</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {visiblePublications.map((publication) => (
              <Card key={publication.title} className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate/60">
                    {publication.type ?? "Publication"} {publication.year ? `• ${publication.year}` : ""}
                  </p>
                  <h4 className="mt-1 text-lg font-semibold text-slate">{publication.title}</h4>
                </div>
                {publication.summary ? <p className="text-sm text-muted">{publication.summary}</p> : null}
                <a
                  href={publication.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-ocean hover:underline"
                >
                  Read online &rarr;
                </a>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

