import { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "tint";
};

export const Card = ({ children, className, tone = "surface" }: CardProps) => {
  const toneClasses =
    tone === "surface" ? "bg-white/95 shadow-card border border-white/60" : "bg-white/70 border border-white/30";

  return (
    <div
      className={clsx(
        "rounded-3xl p-6 transition-shadow duration-200 hover:shadow-[0_24px_48px_rgba(14,30,37,0.18)]",
        toneClasses,
        className
      )}
    >
      {children}
    </div>
  );
};


