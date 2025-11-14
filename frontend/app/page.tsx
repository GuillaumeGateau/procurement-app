import { Hero } from "@sections/Hero";
import { ExpertiseGrid } from "@sections/ExpertiseGrid";
import { ProjectsShowcase } from "@sections/ProjectsShowcase";
import { PublicationsShowcase } from "@sections/PublicationsShowcase";
import { TeamSection } from "@sections/TeamSection";
import {
  loadYaml,
  loadJson,
  HeroContent,
  ExpertiseItem,
  TeamMember,
  Project,
  Publication,
} from "@lib/content";
import { HeroVisual } from "@visuals/HeroVisual";

const heroContent = loadYaml<HeroContent>("homepage/hero.yml");
const expertiseItems = loadJson<ExpertiseItem[]>("homepage/expertise.json");
const teamMembers = loadYaml<TeamMember[]>("team.yml");
const projects = loadJson<Project[]>("projects_summary.json", "data");
const publications = loadJson<Publication[]>("publications.json");

export default function HomePage() {
  return (
    <div className="space-y-16">
      <Hero content={heroContent} />

      <section className="relative">
        <div className="container-responsive grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          <div className="space-y-6">
            <div className="section-divider" />
            <h2 className="text-3xl font-heading text-slate">Global practice with local insight</h2>
            <p className="text-lg text-muted">
              Macmillan Keck is a boutique law and strategy firm advising on the digital economy. We help
              telecommunications operators, fintech innovators, regulators, and development partners design and
              implement modern legal frameworks.
            </p>
            <div className="rounded-3xl border border-white/50 bg-white/90 p-6 shadow-card lg:flex lg:flex-col lg:justify-center lg:gap-4 lg:p-8 lg:min-h-[320px]">
              <ul className="space-y-4 text-base text-muted lg:text-lg">
                <li>
                  <strong className="text-slate">Digital Financial Services:</strong> market access, USSD pricing,
                  interoperability, consumer protection, and competition.
                </li>
                <li>
                  <strong className="text-slate">Telecom & Infrastructure:</strong> PPP design for submarine cables,
                  infrastructure sharing, spectrum reform, and cross-border connectivity.
                </li>
                <li>
                  <strong className="text-slate">Data Governance:</strong> national data protection regimes, digital ID,
                  cybersecurity, and AI policy.
                </li>
              </ul>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <ExpertiseGrid items={expertiseItems} />
      <ProjectsShowcase projects={projects} />
      <PublicationsShowcase publications={publications} />
      <TeamSection members={teamMembers.slice(0, 3)} />
    </div>
  );
}


