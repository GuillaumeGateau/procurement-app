import { Publication } from "@lib/content";
import { Card } from "@ui/Card";
import { LinkButton } from "@ui/Button";

type PublicationsShowcaseProps = {
  publications: Publication[];
};

export const PublicationsShowcase = ({ publications }: PublicationsShowcaseProps) => (
  <section className="bg-ocean/5 py-16">
    <div className="container-responsive space-y-6">
      <div className="section-divider" />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-heading text-slate">Thought leadership & technical guidance</h2>
          <p className="mt-2 text-muted">
            We publish on the frontier of competition policy, digital payments, data governance, and infrastructure
            regulation.
          </p>
        </div>
        <LinkButton variant="secondary" href="/publications">
          Explore publications
        </LinkButton>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {publications.slice(0, 6).map((publication) => (
          <Card key={publication.title} tone="tint">
            <h3 className="text-lg font-semibold text-slate">{publication.title}</h3>
            {publication.summary ? (
              <p className="mt-2 text-sm text-muted leading-relaxed">{publication.summary}</p>
            ) : null}
            <div className="mt-4 flex items-center justify-between text-sm text-ocean">
              <a href={publication.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                Read publication →
              </a>
              {publication.year ? <span className="text-muted">{publication.year}</span> : null}
            </div>
          </Card>
        ))}
      </div>
    </div>
  </section>
);


