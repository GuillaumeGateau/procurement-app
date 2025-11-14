import { loadJson, Publication } from "@lib/content";
import { PublicationsLibrary } from "@sections/PublicationsLibrary";

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

      <PublicationsLibrary publications={publications} />
    </div>
  );
}

