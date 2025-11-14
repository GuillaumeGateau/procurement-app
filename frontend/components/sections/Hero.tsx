import { HeroContent } from "@lib/content";
import { LinkButton } from "@ui/Button";

type HeroProps = {
  content: HeroContent;
};

export const Hero = ({ content }: HeroProps) => {
  return (
    <section className="gradient-hero relative overflow-hidden pb-20 pt-24">
      <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-ocean/10 blur-3xl" />
      <div className="container-responsive relative z-10 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
        <div className="space-y-6">
          <div className="section-divider" />
          <h1 className="text-4xl font-heading text-slate sm:text-5xl lg:text-6xl">{content.headline}</h1>
          <p className="text-lg text-muted sm:text-xl">{content.subheading}</p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={content.cta.href}>{content.cta.label}</LinkButton>
            {content.secondaryCta ? (
              <LinkButton variant="ghost" href={content.secondaryCta.href}>
                {content.secondaryCta.label}
              </LinkButton>
            ) : null}
          </div>
        </div>

        <div className="glass-panel shadow-card rounded-3xl border border-white/50 p-8">
          <h2 className="text-lg font-semibold text-ocean">We operate where innovation meets regulation.</h2>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            From digital financial services to national digital ID and telecom reform, Macmillan Keck helps
            governments, investors, and innovators build future-proof legal frameworks. Our counsel bridges strategy,
            policy, and execution across 80+ markets.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate">
            <div>
              <dt className="font-semibold text-ocean">Global Engagements</dt>
              <dd className="text-muted">80+ jurisdictions advised on digital economy transformation.</dd>
            </div>
            <div>
              <dt className="font-semibold text-ocean">Trusted Partners</dt>
              <dd className="text-muted">World Bank, IFC, UNICEF, multinational operators, and regulators.</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
};


