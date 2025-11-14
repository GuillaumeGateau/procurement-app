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
          <Card key={project.title}>
            <h3 className="text-xl font-semibold text-slate">{project.title}</h3>
            <p className="mt-3 text-sm text-muted leading-relaxed">{project.summary}</p>
            {project.category ? (
              <span className="mt-4 inline-flex rounded-full bg-ocean/10 px-3 py-1 text-xs font-semibold text-ocean">
                {project.category}
              </span>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  </section>
);


