export type ThemeDefinition = {
  id: string;
  color: string;
  gradient: string;
  icon: string;
};

export const sectorThemes: Record<string, ThemeDefinition> = {
  "Digital financial services": {
    id: "dfs",
    color: "#0D9488",
    gradient: "from-emerald-500/20 via-cyan-500/10 to-emerald-500/30",
    icon: "💳",
  },
  "Digital identity & data governance": {
    id: "digital-id",
    color: "#6366F1",
    gradient: "from-indigo-500/20 via-slate-500/10 to-indigo-500/30",
    icon: "🪪",
  },
  "Broadband & infrastructure": {
    id: "infra",
    color: "#2563EB",
    gradient: "from-blue-500/20 via-sky-500/10 to-blue-500/30",
    icon: "🛰️",
  },
  "Data protection & AI policy": {
    id: "privacy",
    color: "#8B5CF6",
    gradient: "from-violet-500/20 via-fuchsia-500/10 to-violet-500/30",
    icon: "🛡️",
  },
  "Health supply chains": {
    id: "health",
    color: "#059669",
    gradient: "from-teal-500/20 via-green-500/10 to-teal-500/30",
    icon: "🚚",
  },
  "Health markets & pricing": {
    id: "markets",
    color: "#F59E0B",
    gradient: "from-amber-500/20 via-orange-500/10 to-amber-500/30",
    icon: "📊",
  },
};

export const defaultTheme: ThemeDefinition = {
  id: "default",
  color: "#1C6DD0",
  gradient: "from-ocean/20 via-slate-500/10 to-ocean/30",
  icon: "🌐",
};


