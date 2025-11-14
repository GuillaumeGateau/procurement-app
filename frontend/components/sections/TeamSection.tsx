import Image from "next/image";
import { TeamMember } from "@lib/content";

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
            Senior advisers with decades of experience in telecoms, financial services, technology, and regulatory reform
            around the world.
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        {members.map((member) => (
          <article
            key={member.name}
            className="overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-white via-sky-50/40 to-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition-transform hover:-translate-y-1"
          >
            <div className="grid gap-6 p-6 md:grid-cols-[220px,1fr] md:items-start lg:grid-cols-[240px,1fr]">
              <div className="space-y-4">
                <div className="relative flex justify-center">
                  <div className="absolute inset-0 translate-y-6 scale-105 rounded-full bg-ocean/30 blur-3xl" />
                  <div className="relative rounded-[28px] border border-ocean/20 bg-gradient-to-br from-sky-500/20 via-white/40 to-sky-500/10 p-1 shadow-inner">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={`${member.name} portrait`}
                        width={200}
                        height={240}
                        className="h-60 w-full rounded-[24px] object-cover"
                      />
                    ) : (
                      <div className="h-56 w-full rounded-[24px] bg-slate/10" />
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate">
                  {member.email ? (
                    <p>
                      <span className="font-semibold text-slate/70">Email:</span>{" "}
                      <a href={`mailto:${member.email}`} className="text-ocean hover:underline">
                        {member.email}
                      </a>
                    </p>
                  ) : null}
                  {member.phone ? (
                    <p>
                      <span className="font-semibold text-slate/70">Telephone:</span>{" "}
                      <a href={`tel:${member.phone}`} className="text-ocean hover:underline">
                        {member.phone}
                      </a>
                    </p>
                  ) : null}
                  {member.linkedin ? (
                    <p>
                      <span className="font-semibold text-slate/70">LinkedIn:</span>{" "}
                      <a
                        href={member.linkedin}
                        className="inline-flex items-center gap-1 text-ocean hover:underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        LinkedIn <span aria-hidden="true">&rarr;</span>
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-6">
                <header className="flex flex-col gap-2 border-b border-slate/10 pb-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-slate">{member.name}</h3>
                      {member.role ? <p className="text-sm uppercase tracking-wide text-ocean">{member.role}</p> : null}
                    </div>
                  </div>
                  <div className="grid gap-2 text-sm text-slate md:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate/60">Areas of expertise</p>
                      <ul className="mt-2 space-y-1">
                        {member.expertise.slice(0, 6).map((item) => (
                          <li key={`${member.name}-${item}`} className="flex items-start gap-2">
                            <span className="mt-1 text-ocean">▹</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-4">
                      {member.credentials && member.credentials.length ? (
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate/60">Credentials</p>
                          <ul className="mt-2 space-y-1">
                            {member.credentials.map((credential) => (
                              <li key={`${member.name}-cred-${credential}`} className="text-sm">
                                {credential}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {member.formerly_with && member.formerly_with.length ? (
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate/60">Formerly with</p>
                          <ul className="mt-2 space-y-1">
                            {member.formerly_with.map((org) => (
                              <li key={`${member.name}-former-${org}`} className="text-sm text-slate/80">
                                {org}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </header>

                <div className="grid gap-4 md:grid-cols-2">
                  {member.notable && member.notable.length ? (
                    <div className="space-y-2">
                      <p className="text-xs uppercase tracking-wide text-slate/60">Notable</p>
                      <ul className="space-y-2 text-sm text-slate">
                        {member.notable.map((note) => (
                          <li key={`${member.name}-note-${note}`} className="leading-relaxed">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {member.quote ? (
                    <div className="rounded-2xl border border-ocean/10 bg-white/70 p-4 text-sm text-slate">
                      <p className="font-serif italic text-slate">
                        “{member.quote.text}”
                      </p>
                      {member.quote.attribution ? (
                        <p className="mt-2 text-xs uppercase tracking-wide text-slate/60">
                          — {member.quote.attribution}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

