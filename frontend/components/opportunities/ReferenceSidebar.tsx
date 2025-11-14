import clsx from "clsx";
import Link from "next/link";

type ReferenceItem = {
  id: string;
  title: string;
  snippet: string;
  relevance: string;
  source?: string;
  url?: string;
};

type ReferenceSidebarProps = {
  projectReferences: ReferenceItem[];
  publicationReferences: ReferenceItem[];
  className?: string;
};

const ReferenceList = ({ label, items }: { label: string; items: ReferenceItem[] }) => {
  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate/60">{label}</p>
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-slate/20 bg-white/80 p-4 shadow-sm">
            <h4 className="text-sm font-semibold text-slate">{item.title}</h4>
            {item.source ? <p className="text-xs uppercase tracking-wide text-slate/50">{item.source}</p> : null}
            <p className="mt-2 text-sm italic text-slate/80">“{item.snippet}”</p>
            <p className="mt-2 text-xs text-slate/70">{item.relevance}</p>
            {item.url ? (
              <Link
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center text-xs font-semibold text-ocean hover:underline"
              >
                View source →
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
};

export const ReferenceSidebar = ({
  projectReferences,
  publicationReferences,
  className,
}: ReferenceSidebarProps) => {
  if (!projectReferences.length && !publicationReferences.length) {
    return null;
  }

  return (
    <aside className={clsx("hidden lg:block", className)}>
      <div className="space-y-6 rounded-3xl border border-white/70 bg-white/95 p-6 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate/60">Reference vault</p>
          <h3 className="text-lg font-semibold text-slate">Precedents & insights</h3>
          <p className="mt-1 text-sm text-muted">Pull language directly from prior mandates and publications.</p>
        </div>

        <ReferenceList label="Project precedents" items={projectReferences} />
        <ReferenceList label="Publications & briefs" items={publicationReferences} />
      </div>
    </aside>
  );
};


