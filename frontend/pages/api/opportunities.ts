import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

const OUTPUT_PATH = path.join(process.cwd(), "..", "output", "notices.json");

type NoticeRecord = {
  id: string;
  title: string;
  agency?: string;
  procurement_type?: string;
  countries?: { country?: string; countryCode?: string }[];
  countryCode?: string;
  region?: string;
  sector?: string;
  technologies?: string[];
  deadline?: string;
  fit_score?: number;
  structuredScore?: number;
  totalScore?: number;
  budget_min?: number;
  budget_max?: number;
  currency?: string;
  searchEmbedding?: number[];
  searchText?: string;
  raw_json?: Record<string, unknown>;
};

type SemanticMatch = {
  score: number;
  sourceTitle?: string;
  sourceUrl?: string;
  sourceType?: string;
};

type ReferenceProject = {
  title: string;
  summary?: string;
};

type DocumentLink = {
  title?: string;
  url: string;
};

type ApiNotice = {
  id: string;
  title: string;
  agency?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  procurementType?: string;
  deadline?: string;
  totalScore: number;
  structuredScore: number;
  semanticScore?: number;
  semanticMatches?: SemanticMatch[];
  fitSummary?: string;
  fitPros?: string[];
  fitCons?: string[];
  referenceProjects?: ReferenceProject[];
  documents?: DocumentLink[];
  sector?: string;
  technologies?: string[];
  searchEmbedding?: number[];
  budget?: { currency?: string; min?: number; max?: number; isEstimated?: boolean; estimateSource?: string };
};

export default function handler(req: NextApiRequest, res: NextApiResponse<{ notices: ApiNotice[] } | { error: string }>) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!fs.existsSync(OUTPUT_PATH)) {
    res.status(200).json({ notices: [] });
    return;
  }

  const file = fs.readFileSync(OUTPUT_PATH, "utf-8");
  const notices: NoticeRecord[] = JSON.parse(file);
  const formatted: ApiNotice[] = notices.map((notice) => {
    const semanticMatches = (notice.raw_json?.semanticMatches as SemanticMatch[] | undefined) ?? [];
    const referenceProjects = (notice.raw_json?.referenceProjects as ReferenceProject[] | undefined) ?? [];
    const fitPros = (notice.raw_json?.fitPros as string[] | undefined) ?? [];
    const fitCons = (notice.raw_json?.fitCons as string[] | undefined) ?? [];
    const documents = (notice.raw_json?.documents as DocumentLink[] | undefined) ?? [];
    const budgetFromRaw = notice.raw_json?.budget as
      | { currency?: string; min?: number; max?: number; isEstimated?: boolean; estimateSource?: string }
      | undefined;

    return {
      id: notice.id,
      title: notice.title,
      agency: notice.agency,
      procurementType: notice.procurement_type,
      country: notice.countries?.[0]?.country ?? notice.countries?.[0]?.countryCode,
      countryCode: notice.countryCode ?? notice.countries?.[0]?.countryCode,
      region: notice.region,
      deadline: notice.deadline,
      totalScore: notice.totalScore ?? notice.fit_score ?? 0,
      structuredScore: notice.structuredScore ?? 0,
      semanticScore: notice.raw_json?.semanticScore as number | undefined,
      semanticMatches,
      fitSummary: notice.raw_json?.fitSummary as string | undefined,
      fitPros,
      fitCons,
      referenceProjects,
      documents,
      sector: notice.sector,
      technologies: notice.technologies ?? [],
      searchEmbedding: notice.searchEmbedding,
      budget:
        budgetFromRaw ??
        {
          currency: notice.currency ?? undefined,
          min: notice.budget_min ?? undefined,
          max: notice.budget_max ?? undefined,
          isEstimated: false,
        },
    };
  });

  res.status(200).json({ notices: formatted });
}


