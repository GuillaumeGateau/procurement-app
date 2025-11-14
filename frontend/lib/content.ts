import fs from "fs";
import path from "path";
import yaml from "js-yaml";

const contentRoot = path.join(process.cwd(), "..", "content");
const dataRoot = path.join(process.cwd(), "..", "data");

export type HeroContent = {
  headline: string;
  subheading: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
};

export type ExpertiseItem = {
  title: string;
  description: string;
  tags?: string[];
};

export type Testimonial = {
  quote: string;
  attribution: string;
  role?: string;
};

export type TeamMember = {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  photo?: string;
  linkedin?: string;
  expertise: string[];
  credentials?: string[];
  formerly_with?: string[];
  notable?: string[];
  quote?: {
    text: string;
    attribution?: string;
  };
};

export type Project = {
  title: string;
  summary: string;
  category?: string;
};

export type Publication = {
  title: string;
  summary?: string;
  url: string;
  year?: string;
  type?: string;
};

export const loadYaml = <T>(relativePath: string): T => {
  const fullPath = path.join(contentRoot, relativePath);
  const file = fs.readFileSync(fullPath, "utf-8");
  return yaml.load(file) as T;
};

export const loadJson = <T>(relativePath: string, root: "content" | "data" = "content"): T => {
  const base = root === "content" ? contentRoot : dataRoot;
  const fullPath = path.join(base, relativePath);
  const file = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(file) as T;
};


