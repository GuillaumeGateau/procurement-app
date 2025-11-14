"use client";

import clsx from "clsx";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkButtonProps = BaseProps & {
  href: string;
  target?: "_blank" | "_self";
  rel?: string;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-ocean text-white hover:bg-ocean/90 shadow-card",
  secondary: "bg-white text-ocean border border-ocean/30 hover:border-ocean/60",
  ghost: "bg-transparent text-ocean hover:bg-ocean/10",
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean/60";

export const Button = ({ children, variant = "primary", className, ...props }: ButtonProps) => {
  return (
    <button className={clsx(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
};

export const LinkButton = ({ children, variant = "primary", className, href, ...props }: LinkButtonProps) => {
  return (
    <Link href={href} className={clsx(baseClasses, variantClasses[variant], className)} {...props}>
      {children}
    </Link>
  );
};


