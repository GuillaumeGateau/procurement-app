import { TeamSection } from "@sections/TeamSection";
import { loadYaml, TeamMember } from "@lib/content";

const teamMembers = loadYaml<TeamMember[]>("team.yml");

export default function TeamPage() {
  return (
    <div>
      <section className="bg-ocean/5 py-12">
        <div className="container-responsive space-y-4">
          <div className="section-divider" />
          <h1 className="text-3xl font-heading text-slate">Our Team</h1>
          <p className="max-w-3xl text-muted">
            Macmillan Keck is led by partners and senior counsel who combine deep legal experience with on-the-ground
            policy work across Africa, the Middle East, Asia, Europe, and the Americas. We bring a multidisciplinary
            approach to complex digital economy reforms and transactions.
          </p>
        </div>
      </section>
      <TeamSection members={teamMembers} />
    </div>
  );
}

