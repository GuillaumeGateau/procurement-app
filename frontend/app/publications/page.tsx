import { loadJson, Publication } from "@lib/content";
import { Card } from "@ui/Card";

const publications = loadJson<Publication[]>("publications.json");

export default function PublicationsPage() {
  return (
    <div className="space-y-12">
      <section className="bg-ocean/5 py-12">
        <div className="container-responsive space-y-4">
          <div className="section-divider" />
          <h1 className="text-3xl font-heading text-slate">Publications</h1>
          <p className="max-w-3xl text-muted">
            Our partners contribute to global thinking on telecom liberalization, digital financial inclusion, data
            protection, AI, and competition policy. Explore selected publications below.
          </p>
        </div>
      </section>

      <section>
        <div className="container-responsive grid gap-6 md:grid-cols-2">
          {publications.map((publication) => (
            <Card key={publication.title}>
              <h3 className="text-lg font-semibold text-slate">{publication.title}</h3>
              {publication.summary ? (
                <p className="mt-2 text-sm text-muted leading-relaxed">{publication.summary}</p>
              ) : null}
              <div className="mt-4 flex items-center justify-between text-sm">
                <a
                  href={publication.url}
                  className="font-medium text-ocean hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  View publication →
                </a>
                {publication.year ? <span className="text-muted">{publication.year}</span> : null}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

