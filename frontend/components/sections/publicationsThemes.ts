import { Publication } from "@lib/content";

export type PublicationTheme = {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  gradient: string;
  accent: string;
  icon: string;
};

export const PUBLICATION_THEMES: PublicationTheme[] = [
  {
    id: "data",
    label: "Data & AI governance",
    description: "Privacy, digital ID, responsible AI, and cross-border data flows.",
    keywords: ["data", "privacy", "id", "identity", "ai", "cyber", "biometric"],
    gradient: "from-violet-500/20 via-slate-500/10 to-violet-500/30",
    accent: "text-violet-600",
    icon: "🛡️",
  },
  {
    id: "telecom",
    label: "Telecom & infrastructure",
    description: "PPP models, fiber networks, spectrum, universal connectivity.",
    keywords: ["telecom", "broadband", "infrastructure", "spectrum", "tower", "fiber", "satellite"],
    gradient: "from-blue-500/20 via-cyan-500/10 to-blue-500/30",
    accent: "text-blue-600",
    icon: "📡",
  },
  {
    id: "dfs",
    label: "Digital financial services",
    description: "Mobile money, interoperability, consumer protection, fintech.",
    keywords: ["financial", "fintech", "mobile money", "dfs", "payments", "bank", "remittance", "finance"],
    gradient: "from-emerald-500/20 via-teal-500/10 to-emerald-500/30",
    accent: "text-emerald-600",
    icon: "💳",
  },
  {
    id: "competition",
    label: "Competition & policy reform",
    description: "Market inquiries, dispute resolution, mergers, regulatory design.",
    keywords: ["competition", "arbitration", "merger", "policy", "dispute", "litigation", "market"],
    gradient: "from-indigo-500/20 via-slate-500/10 to-indigo-500/30",
    accent: "text-indigo-600",
    icon: "⚖️",
  },
  {
    id: "commerce",
    label: "Commerce & joint ventures",
    description: "Investment vehicles, commercial transactions, JV structures.",
    keywords: ["commerce", "joint", "venture", "transactions", "investment", "deal"],
    gradient: "from-amber-500/20 via-orange-500/10 to-amber-500/30",
    accent: "text-amber-600",
    icon: "🤝",
  },
];

export const FALLBACK_PUBLICATION_THEME = PUBLICATION_THEMES[0];

export const classifyPublication = (publication: Publication) => {
  const haystack = `${publication.title} ${publication.summary ?? ""}`.toLowerCase();
  for (const theme of PUBLICATION_THEMES) {
    if (theme.keywords.some((keyword) => haystack.includes(keyword))) {
      return theme;
    }
  }
  return FALLBACK_PUBLICATION_THEME;
};

