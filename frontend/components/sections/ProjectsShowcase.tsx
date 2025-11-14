"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { Project } from "@lib/content";
import { Card } from "@ui/Card";

type ProjectsShowcaseProps = {
  projects: Project[];
};

type ProjectTheme = {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  gradient: string;
  accent: string;
  icon: string;
};

const PROJECT_THEMES: ProjectTheme[] = [
  {
    id: "infrastructure",
    label: "Digital infrastructure",
    description: "PPPs for cables, towers, and broadband infrastructure sharing.",
    keywords: ["submarine", "cable", "broadband", "tower", "infrastructure", "sharing", "spectrum", "ppp", "connectivity"],
    gradient: "from-sky-500/20 via-blue-500/10 to-sky-600/30",
    accent: "text-sky-700",
    icon: "🌐",
  },
  {
    id: "data-trust",
    label: "Data & trust frameworks",
    description: "Drafting digital ID, privacy, and cybersecurity regimes.",
    keywords: ["data", "privacy", "protection", "digital id", "identification", "cyber", "trust"],
    gradient: "from-purple-500/20 via-violet-500/10 to-purple-600/30",
    accent: "text-violet-700",
    icon: "🛡️",
  },
  {
    id: "inclusion",
    label: "Inclusive finance & commerce",
    description: "Fintech licensing, remittances, consumer protection, interoperability.",
    keywords: ["finance", "financial", "remitt", "bank", "fintech", "commerce", "payment", "mobile money"],
    gradient: "from-emerald-500/20 via-teal-500/10 to-emerald-600/30",
    accent: "text-emerald-700",
    icon: "💸",
  },
  {
    id: "policy",
    label: "Policy & governance",
    description: "Regulatory reform, legislative drafting, and independent advisory.",
    keywords: ["policy", "govern", "draft", "law", "regulation", "government", "advising"],
    gradient: "from-indigo-500/20 via-slate-500/10 to-indigo-600/30",
    accent: "text-indigo-700",
    icon: "🏛️",
  },
  {
    id: "innovation",
    label: "Innovation & partnerships",
    description: "IoT launches, strategic partnerships, and future-facing transactions.",
    keywords: ["iot", "connected", "innovation", "partnership", "transaction", "cloud", "cooperative"],
    gradient: "from-amber-500/20 via-orange-500/10 to-amber-600/30",
    accent: "text-amber-700",
    icon: "🚀",
  },
];

const classifyProject = (project: Project): ProjectTheme => {
  const haystack = `${project.title} ${project.summary ?? ""}`.toLowerCase();
  for (const theme of PROJECT_THEMES) {
    if (theme.keywords.some((keyword) => haystack.includes(keyword))) {
      return theme;
    }
  }
  return PROJECT_THEMES[0];
};

const buildProjectGroups = (projects: Project[]) => {
  const themeByTitle = new Map<string, ProjectTheme>();
  const grouped = projects.reduce<Record<string, Project[]>>((acc, project) => {
    const theme = classifyProject(project);
    themeByTitle.set(project.title, theme);
    if (!acc[theme.id]) acc[theme.id] = [];
    acc[theme.id].push(project);
    return acc;
  }, {});
  return { grouped, themeByTitle };
};

export const ProjectsShowcase = ({ projects }: ProjectsShowcaseProps) => {
  const { grouped, themeByTitle } = useMemo(() => buildProjectGroups(projects), [projects]);
  const [activeTheme, setActiveTheme] = useState<string>("all");
  const activeThemeMeta = activeTheme === "all" ? null : PROJECT_THEMES.find((theme) => theme.id === activeTheme);

  const visibleProjects = activeTheme === "all" ? projects : grouped[activeTheme] ?? [];
  const heroProjects = visibleProjects.slice(0, 2);

  return (
    <section className="py-16">
      <div className="container-responsive space-y-8">
        <div className="section-divider" />
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-heading text-slate">Transformational engagements</h2>
            <p className="mt-2 text-muted">
              From broadband PPPs to national data protection regimes, our projects drive investment, inclusion, and strong
              governance.
            </p>
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-slate/60">Curated by theme</span>
        </div>

        <div className="flex flex-wrap gap-3">
          {[{ id: "all", label: "All themes", icon: "✨" }, ...PROJECT_THEMES].map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActiveTheme(theme.id)}
                aria-pressed={isActive}
                className={clsx(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "border-slate bg-slate text-white shadow-sm"
                    : "border-slate/20 bg-white/80 text-slate hover:border-slate/40"
                )}
              >
                <span className="text-base">{theme.icon}</span>
                <span>{theme.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {heroProjects.map((project) => {
            const theme = themeByTitle.get(project.title);
            return (
              <article
                key={project.title}
                className={clsx(
                  "flex h-full flex-col justify-between rounded-3xl border border-white/70 bg-white/90 p-6 text-left shadow-[0_20px_40px_rgba(15,23,42,0.12)]",
                  theme ? `bg-gradient-to-br ${theme.gradient}` : null
                )}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate/80">
                    <span>{theme?.icon ?? "✨"}</span>
                    <span>{theme?.label ?? "Highlight"}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate">{project.title}</h3>
                  {project.summary ? (
                    <p className="text-sm leading-relaxed text-slate/80 line-clamp-5">{project.summary}</p>
                  ) : null}
                </div>
                <span className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate/70">
                  Signature engagement
                </span>
              </article>
            );
          })}
        </div>

        {activeTheme === "all" ? (
          <div className="space-y-6">
            {PROJECT_THEMES.map((theme) => {
              const entries = grouped[theme.id] ?? [];
              if (!entries.length) return null;
              return (
                <section
                  key={theme.id}
                  className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-[0_22px_45px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{theme.icon}</span>
                        <h3 className={`text-xl font-semibold ${theme.accent}`}>{theme.label}</h3>
                      </div>
                      <p className="text-sm text-muted">{theme.description}</p>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-slate/60">{entries.length} projects</span>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {entries.slice(0, 4).map((project) => (
                      <Card key={`${theme.id}-${project.title}`} className="space-y-2">
                        <h4 className="text-lg font-semibold text-slate">{project.title}</h4>
                        {project.summary ? (
                          <p className="text-sm text-muted line-clamp-4">{project.summary}</p>
                        ) : null}
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
              {visibleProjects.map((project) => (
                <Card key={project.title} className="space-y-3">
                  <h4 className="text-lg font-semibold text-slate">{project.title}</h4>
                  {project.category ? (
                    <span className="inline-flex rounded-full bg-ocean/5 px-3 py-1 text-xs font-semibold text-ocean/80">
                      {project.category}
                    </span>
                  ) : null}
                  {project.summary ? <p className="text-sm text-muted">{project.summary}</p> : null}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
