import { Project } from "@lib/content";
import { Card } from "@ui/Card";

type ProjectsShowcaseProps = {
  projects: Project[];
};

export const ProjectsShowcase = ({ projects }: ProjectsShowcaseProps) => (
  <section className="py-16">
    <div className="container-responsive space-y-6">
      <div className="section-divider" />
      <div className="max-w-3xl">
        <h2 className="text-3xl font-heading text-slate">Transformational engagements</h2>
        <p className="mt-2 text-muted">
          From broadband PPPs to national data protection regimes, our projects drive investment, inclusion, and strong
          governance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.title} className="space-y-3">
            <details className="group space-y-3">
              <summary className="flex cursor-pointer list-none flex-col gap-2 text-left">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate transition-colors group-open:text-ocean">
                    {project.title}
                  </h3>
                  <span className="mt-1 text-xs uppercase tracking-wide text-ocean group-open:text-ocean/80">
                    View details
                  </span>
                </div>
                {project.category ? (
                  <span className="inline-flex w-fit rounded-full bg-ocean/5 px-3 py-1 text-xs font-medium text-ocean/80">
                    {project.category}
                  </span>
                ) : null}
              </summary>
              <p className="text-sm leading-relaxed text-muted">{project.summary}</p>
            </details>
          </Card>
        ))}
      </div>
    </div>
  </section>
);
