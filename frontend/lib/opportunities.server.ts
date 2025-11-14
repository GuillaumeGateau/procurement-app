import fs from "fs";
import path from "path";

export type OpportunityRecord = {
  id: string;
  title: string;
  agency?: string;
  procurement_type?: string;
  countries?: { country?: string; countryCode?: string }[];
  deadline?: string;
  totalScore?: number;
  structuredScore?: number;
  raw_json?: {
    fitSummary?: string;
    fitPros?: string[];
    fitCons?: string[];
    referenceProjects?: { title: string; summary?: string }[];
    documents?: { title?: string; url: string }[];
    semanticMatches?: { score: number; sourceTitle?: string; sourceUrl?: string }[];
    budget?: { currency?: string; min?: number; max?: number; isEstimated?: boolean; estimateSource?: string };
  };
  budget_min?: number | null;
  budget_max?: number | null;
  currency?: string | null;
};

const OUTPUT_PATH = path.join(process.cwd(), "..", "output", "notices.json");

export function loadOpportunities(): OpportunityRecord[] {
  if (!fs.existsSync(OUTPUT_PATH)) {
    return [];
  }
  const file = fs.readFileSync(OUTPUT_PATH, "utf-8");
  return JSON.parse(file) as OpportunityRecord[];
}

export function findOpportunity(id: string): OpportunityRecord | undefined {
  return loadOpportunities().find((opp) => opp.id === id);
}

