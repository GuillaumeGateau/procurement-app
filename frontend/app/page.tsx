import Image from "next/image";
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
        <div className="container-responsive grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="section-divider" />
            <h2 className="text-3xl font-heading text-slate">Global practice with local insight</h2>
            <p className="text-lg text-muted">
              Macmillan Keck is a boutique law and strategy firm advising on the digital economy. We help
              telecommunications operators, fintech innovators, regulators, and development partners design and
              implement modern legal frameworks.
            </p>
            <div className="rounded-3xl border border-white/50 bg-white/90 p-6 shadow-card">
              <ul className="space-y-3 text-sm text-muted">
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
          <div className="relative flex justify-center">
            <div className="absolute inset-0 -translate-y-6 translate-x-4 rounded-full bg-accent/10 blur-3xl" />
            <Image
              src="/assets/hero-illustration.jpg"
              alt="Global digital infrastructure illustration"
              width={720}
              height={540}
              className="relative z-10 rounded-3xl border border-white/40 shadow-card"
              priority
            />
          </div>
        </div>
      </section>

      <ExpertiseGrid items={expertiseItems} />
      <ProjectsShowcase projects={projects} />
      <PublicationsShowcase publications={publications} />
      <TeamSection members={teamMembers.slice(0, 3)} />
    </div>
  );
}


