import { readFile } from "node:fs/promises";
import * as path from "node:path";
import { CLARIFY_TASK_SKILL_NAME } from "../constants";
import { categoryLabel, type SkillRecord, type SkillSource } from "../domain/skill";
import { discoverSkills } from "./skillFileService";

export interface SkillContent {
  readonly name: string;
  readonly source: SkillSource;
  readonly skillFilePath: string;
  readonly content: string;
}

export type SkillLookupResult =
  | { readonly kind: "found"; readonly skill: SkillContent }
  | { readonly kind: "ambiguous"; readonly matches: readonly SkillSummary[] }
  | { readonly kind: "notFound"; readonly available: readonly SkillSummary[] };

export interface SkillSummary {
  readonly name: string;
  readonly description: string;
  readonly category: string;
  readonly framework?: string;
  readonly source: SkillSource;
}

export async function loadClarifyTaskSkillContent(
  extensionPath: string,
  personalDirectory: string
): Promise<SkillContent> {
  const [personalSkills, bundledSkills] = await Promise.all([
    discoverSkills(personalDirectory, "personal"),
    discoverSkills(path.join(extensionPath, "skills"), "bundled")
  ]);
  const skill =
    personalSkills.find(
      ({ name, enabled }) => name === CLARIFY_TASK_SKILL_NAME && enabled
    ) ??
    bundledSkills.find(({ name }) => name === CLARIFY_TASK_SKILL_NAME);

  if (!skill) {
    throw new Error("The clarify-task skill was not found.");
  }

  return {
    name: skill.name,
    source: skill.source,
    skillFilePath: skill.skillFilePath,
    content: await readFile(skill.skillFilePath, "utf8")
  };
}

export async function findSkillContent(
  extensionPath: string,
  personalDirectory: string,
  query: string,
  isBundledEnabled: (name: string) => boolean = () => true
): Promise<SkillLookupResult> {
  const skills = await discoverEnabledSkills(
    extensionPath,
    personalDirectory,
    isBundledEnabled
  );
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return {
      kind: "notFound",
      available: skills.map(summarizeSkill)
    };
  }

  const exact = skills.find(({ name }) => normalize(name) === normalizedQuery);
  if (exact) {
    return { kind: "found", skill: await readSkillContent(exact) };
  }

  const ranked = skills
    .map((skill) => ({ skill, score: scoreSkill(skill, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score);

  if (ranked.length === 0) {
    return {
      kind: "notFound",
      available: skills.map(summarizeSkill)
    };
  }

  const topScore = ranked[0].score;
  const topMatches = ranked.filter(({ score }) => score === topScore);
  if (topMatches.length > 1) {
    return {
      kind: "ambiguous",
      matches: topMatches.slice(0, 5).map(({ skill }) => summarizeSkill(skill))
    };
  }

  return { kind: "found", skill: await readSkillContent(ranked[0].skill) };
}

async function discoverEnabledSkills(
  extensionPath: string,
  personalDirectory: string,
  isBundledEnabled: (name: string) => boolean
): Promise<SkillRecord[]> {
  const [personalSkills, bundledSkills] = await Promise.all([
    discoverSkills(personalDirectory, "personal"),
    discoverSkills(path.join(extensionPath, "skills"), "bundled")
  ]);
  const personal = personalSkills.filter(({ enabled }) => enabled);
  const personalNames = new Set(personal.map(({ name }) => name));
  const bundled = bundledSkills.filter(
    ({ name }) => !personalNames.has(name) && isBundledEnabled(name)
  );

  return [...personal, ...bundled];
}

async function readSkillContent(skill: SkillRecord): Promise<SkillContent> {
  return {
    name: skill.name,
    source: skill.source,
    skillFilePath: skill.skillFilePath,
    content: await readFile(skill.skillFilePath, "utf8")
  };
}

function scoreSkill(skill: SkillRecord, query: string): number {
  const terms = query.split(/\s+/).filter(Boolean);
  return Math.max(
    fieldScore(skill.name, query, 90),
    fieldScore(skill.framework ?? "", query, 80),
    fieldScore(skill.category, query, 70),
    fieldScore(categoryLabel(skill.category), query, 70),
    fieldScore(skill.description, query, 50),
    ...terms.map((term) => scoreSkillTerm(skill, term))
  );
}

function scoreSkillTerm(skill: SkillRecord, term: string): number {
  return Math.max(
    fieldScore(skill.name, term, 45),
    fieldScore(skill.framework ?? "", term, 40),
    fieldScore(skill.category, term, 35),
    fieldScore(categoryLabel(skill.category), term, 35),
    fieldScore(skill.description, term, 25)
  );
}

function fieldScore(value: string, query: string, base: number): number {
  const normalized = normalize(value);
  if (!normalized) {
    return 0;
  }

  if (normalized === query) {
    return base + 10;
  }

  return normalized.includes(query) ? base : 0;
}

function summarizeSkill(skill: SkillRecord): SkillSummary {
  return {
    name: skill.name,
    description: skill.description,
    category: skill.category,
    framework: skill.framework,
    source: skill.source
  };
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase();
}
