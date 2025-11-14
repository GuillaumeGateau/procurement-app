import clsx from "clsx";

type TagProps = {
  label: string;
  tone?: "default" | "accent" | "muted";
  className?: string;
};

export const Tag = ({ label, tone = "default", className }: TagProps) => {
  const toneClasses = {
    default: "bg-ocean/10 text-ocean border border-ocean/20",
    accent: "bg-accent/10 text-accent border border-accent/20",
    muted: "bg-slate/10 text-muted border border-slate/20",
  }[tone];

  return (
    <span className={clsx("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", toneClasses, className)}>
      {label}
    </span>
  );
};


