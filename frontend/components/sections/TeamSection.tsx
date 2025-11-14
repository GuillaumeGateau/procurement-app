import Image from "next/image";
import { TeamMember } from "@lib/content";
import { Card } from "@ui/Card";
import { Tag } from "@ui/Tag";

type TeamSectionProps = {
  members: TeamMember[];
};

export const TeamSection = ({ members }: TeamSectionProps) => (
  <section className="bg-white/90 py-16">
    <div className="container-responsive space-y-6">
      <div className="section-divider" />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-heading text-slate">Partner-led counsel</h2>
          <p className="mt-2 text-muted">
            Senior advisers with decades of experience in telecoms, financial services, technology, and regulatory
            reform around the world.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {members.map((member) => (
          <Card key={member.name} className="overflow-hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              {member.photo ? (
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-sand/40 shadow-inner">
                  <Image src={member.photo} alt={`${member.name} portrait`} fill sizes="128px" className="object-cover" />
                </div>
              ) : null}

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-semibold text-slate">{member.name}</h3>
                  {member.role ? <p className="text-sm text-muted">{member.role}</p> : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((exp) => (
                    <Tag key={exp} label={exp} tone="muted" className="text-xs" />
                  ))}
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                  {member.email ? (
                    <a href={`mailto:${member.email}`} className="transition-colors hover:text-ocean font-medium">
                      {member.email}
                    </a>
                  ) : null}
                  {member.phone ? (
                    <a href={`tel:${member.phone}`} className="transition-colors hover:text-ocean font-medium">
                      {member.phone}
                    </a>
                  ) : null}
                </div>
              </div>
            </div>

            {member.notable && member.notable.length ? (
              <ul className="mt-4 space-y-2 text-sm text-slate">
                {member.notable.map((note) => (
                  <li key={note} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ocean/60" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  </section>
);


