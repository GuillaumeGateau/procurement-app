import { ProjectsShowcase } from "@sections/ProjectsShowcase";
import { loadJson, Project } from "@lib/content";

const projects = loadJson<Project[]>("projects_summary.json", "data");

export default function AchievementsPage() {
  return (
    <div className="space-y-16">
      <section className="bg-ocean/5 py-12">
        <div className="container-responsive space-y-4">
          <div className="section-divider" />
          <h1 className="text-3xl font-heading text-slate">Achievements</h1>
          <p className="max-w-3xl text-muted">
            Our projects span legal reform, digital infrastructure, and competition policy across the globe. Each
            engagement is partner-led and designed to deliver practical outcomes for regulators, investors, and service
            providers.
          </p>
        </div>
      </section>
      <ProjectsShowcase projects={projects} />
    </div>
  );
}

