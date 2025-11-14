import { ExpertiseItem } from "@lib/content";
import { Card } from "@ui/Card";
import { Tag } from "@ui/Tag";

type ExpertiseGridProps = {
  items: ExpertiseItem[];
};

export const ExpertiseGrid = ({ items }: ExpertiseGridProps) => (
  <section className="py-16">
    <div className="container-responsive space-y-6">
      <div className="section-divider" />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-heading text-slate">Strategic expertise for digital transformation</h2>
          <p className="mt-2 text-muted">
            Our partner-led teams blend legal, regulatory, and commercial insight to unlock investments and inclusive
            growth.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title}>
            <h3 className="text-xl font-semibold text-slate">{item.title}</h3>
            <p className="mt-3 text-sm text-muted leading-relaxed">{item.description}</p>
            {item.tags && item.tags.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Tag key={tag} label={tag} tone="muted" />
                ))}
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  </section>
);


