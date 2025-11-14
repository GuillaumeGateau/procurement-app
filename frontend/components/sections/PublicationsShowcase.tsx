import { useMemo } from "react";
import { Publication } from "@lib/content";
import { LinkButton } from "@ui/Button";
import { PUBLICATION_THEMES, classifyPublication } from "./publicationsThemes";

type PublicationsShowcaseProps = {
  publications: Publication[];
};

export const PublicationsShowcase = ({ publications }: PublicationsShowcaseProps) => {
  const grouped = useMemo(() => {
    return publications.reduce<Record<string, Publication[]>>((acc, publication) => {
      const theme = classifyPublication(publication);
      if (!acc[theme.id]) acc[theme.id] = [];
      acc[theme.id].push(publication);
      return acc;
    }, {});
  }, [publications]);

  const heroPapers = publications.slice(0, 2);

  return (
    <section className="bg-ocean/5 py-16">
      <div className="container-responsive space-y-8">
        <div className="section-divider" />
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-ocean/70">Library</p>
            <h2 className="text-3xl font-heading text-slate">Insight collections</h2>
            <p className="mt-2 text-muted">
              Curated briefings, toolkits, and research notes spanning digital infrastructure, DFS, policy reform, and
              data governance.
            </p>
          </div>
          <LinkButton variant="secondary" href="/publications">
            Browse all publications
          </LinkButton>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {heroPapers.map((publication) => (
            <article
              key={publication.title}
              className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-ocean/5 to-white p-5 shadow-lg"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-ocean/80">
                  <span>{publication.type ?? "Publication"}</span>
                  {publication.year ? <span>• {publication.year}</span> : null}
                </div>
                <h3 className="text-2xl font-semibold text-slate">{publication.title}</h3>
                {publication.summary ? (
                  <p className="text-sm leading-relaxed text-slate/80 line-clamp-4">{publication.summary}</p>
                ) : null}
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-ocean">
                <span>Featured insight</span>
                <a href={publication.url} target="_blank" rel="noreferrer" className="font-medium hover:underline">
                  Read online →
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="space-y-6">
          {PUBLICATION_THEMES.map((theme) => {
            const entries = grouped[theme.id] ?? [];
            if (!entries.length) return null;
            return (
              <section
                key={theme.id}
                className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_18px_44px_rgba(14,30,37,0.08)]"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{theme.icon}</span>
                      <h3 className={`text-xl font-semibold ${theme.accent}`}>{theme.label}</h3>
                    </div>
                    <p className="text-sm text-muted">{theme.description}</p>
                  </div>
                  <span className="text-xs uppercase tracking-wide text-slate/60">{entries.length} insights</span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  {entries.slice(0, 3).map((publication) => (
                    <article
                      key={`${theme.id}-${publication.title}`}
                      className="rounded-2xl border border-slate/10 bg-white/90 p-4 text-sm text-slate shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <p className="font-semibold">{publication.title}</p>
                      {publication.summary ? (
                        <p className="mt-2 text-xs text-muted line-clamp-3">{publication.summary}</p>
                      ) : null}
                      <div className="mt-4 flex items-center justify-between text-xs text-ocean">
                        {publication.year ? <span>{publication.year}</span> : <span />}
                        <a href={publication.url} target="_blank" rel="noreferrer" className="hover:underline">
                          Read →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
};

